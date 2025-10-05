// Content script for Threads Data Downloader
// This script extracts data from Threads profile pages

let isExtracting = false;
let shouldStop = false;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startDownload') {
    if (!isExtracting) {
      extractThreadsData(request.options)
        .then(data => {
          sendResponse({ success: true, data });
        })
        .catch(error => {
          sendResponse({ success: false, error: error.message });
        });
      return true; // Keep channel open for async response
    }
  } else if (request.action === 'stopDownload') {
    shouldStop = true;
    sendResponse({ success: true });
  }
});

async function extractThreadsData(options) {
  isExtracting = true;
  shouldStop = false;

  try {
    // Get username from URL or page
    const username = extractUsername();
    if (!username) {
      throw new Error('Không tìm thấy username trên trang này');
    }

    // Wait for page to load
    await waitForPageLoad();

    // Scroll to load posts
    const posts = await loadAndExtractPosts(options);

    const data = {
      username: username,
      profileUrl: window.location.href,
      extractedAt: new Date().toISOString(),
      totalPosts: posts.length,
      posts: posts,
      options: options
    };

    chrome.runtime.sendMessage({
      action: 'complete',
      data: data
    });

    return data;

  } catch (error) {
    chrome.runtime.sendMessage({
      action: 'error',
      error: error.message
    });
    throw error;
  } finally {
    isExtracting = false;
  }
}

function extractUsername() {
  // Try to get username from URL
  const urlMatch = window.location.pathname.match(/\/@([^\/]+)/);
  if (urlMatch) {
    return urlMatch[1];
  }

  // Try to get from page elements
  const usernameElement = document.querySelector('[role="link"][tabindex="0"]');
  if (usernameElement) {
    const text = usernameElement.textContent;
    if (text.startsWith('@')) {
      return text.substring(1);
    }
  }

  // Fallback: try meta tags
  const metaTags = document.querySelectorAll('meta[property^="og:"]');
  for (const meta of metaTags) {
    if (meta.content.includes('threads.com/@')) {
      const match = meta.content.match(/@([^\/\?]+)/);
      if (match) return match[1];
    }
  }

  return null;
}

async function waitForPageLoad() {
  // Wait for posts to appear
  let attempts = 0;
  while (attempts < 30) {
    const posts = document.querySelectorAll('[role="article"], article, [class*="Post"]');
    if (posts.length > 0) {
      return;
    }
    await sleep(500);
    attempts++;
  }
  throw new Error('Không tìm thấy bài viết nào trên trang');
}

async function loadAndExtractPosts(options) {
  const limit = options.limit || 50;
  const extractedPosts = new Map(); // Use Map to avoid duplicates
  let lastHeight = 0;
  let unchangedCount = 0;

  while (extractedPosts.size < limit && !shouldStop) {
    // Extract visible posts
    const articles = document.querySelectorAll('[role="article"], article');
    
    for (const article of articles) {
      if (extractedPosts.size >= limit || shouldStop) break;

      const postData = extractPostData(article, options);
      if (postData && postData.id) {
        if (!extractedPosts.has(postData.id)) {
          extractedPosts.set(postData.id, postData);
          
          // Send progress update
          chrome.runtime.sendMessage({
            action: 'progress',
            current: extractedPosts.size,
            total: limit
          });
        }
      }
    }

    // Check if we've reached the limit
    if (extractedPosts.size >= limit) {
      break;
    }

    // Scroll down to load more
    const currentHeight = document.documentElement.scrollHeight;
    window.scrollTo(0, currentHeight);
    await sleep(1500); // Wait for content to load

    // Check if page height changed
    const newHeight = document.documentElement.scrollHeight;
    if (newHeight === currentHeight || newHeight === lastHeight) {
      unchangedCount++;
      if (unchangedCount >= 3) {
        // No more content to load
        break;
      }
    } else {
      unchangedCount = 0;
    }
    lastHeight = newHeight;
  }

  if (shouldStop) {
    chrome.runtime.sendMessage({ action: 'stopped' });
  }

  return Array.from(extractedPosts.values());
}

function extractPostData(article, options) {
  try {
    const content = extractContent(article);
    const firstComment = options.includeFirstComment ? extractFirstComment(article) : null;
    
    const postData = {
      id: generatePostId(article),
      timestamp: extractTimestamp(article),
      content: content,
      media: options.includeMedia ? extractMedia(article) : [],
      engagement: options.includeEngagement ? extractEngagement(article) : {},
      firstComment: firstComment,
      postUrl: extractPostUrl(article)
    };

    // Extract Shopee links if convertShopee option is enabled
    if (options.convertShopee) {
      const shopeeLinks = extractShopeeLinksFromPost(content, firstComment);
      postData.shopeeLinks = shopeeLinks.original;
      postData.shopeeLinksConverted = shopeeLinks.converted;
    }

    return postData;
  } catch (error) {
    console.error('Error extracting post data:', error);
    return null;
  }
}

function generatePostId(article) {
  // Try to find a unique identifier
  const link = article.querySelector('a[href*="/post/"]');
  if (link) {
    const match = link.href.match(/\/post\/([^\/\?]+)/);
    if (match) return match[1];
  }

  // Fallback: use content hash
  const content = article.textContent.substring(0, 100);
  return hashCode(content).toString();
}

function extractTimestamp(article) {
  // Look for time elements
  const timeElement = article.querySelector('time');
  if (timeElement) {
    return timeElement.getAttribute('datetime') || timeElement.textContent;
  }

  // Look for relative time text
  const timeText = Array.from(article.querySelectorAll('span, div'))
    .find(el => /\d+[smhd]|\d+\s*(giây|phút|giờ|ngày|tuần|tháng|năm)/.test(el.textContent));
  
  if (timeText) {
    return timeText.textContent.trim();
  }

  return new Date().toISOString();
}

function extractContent(article) {
  // Try to find the main text content
  const textElements = article.querySelectorAll('[dir="auto"], [class*="Text"], p, span');
  const texts = [];

  for (const element of textElements) {
    const text = element.textContent.trim();
    // Filter out short elements and navigation text
    if (text.length > 20 && !text.match(/^\d+\s*(likes?|comments?|shares?)/i)) {
      const isDescendant = Array.from(textElements).some(other => 
        other !== element && other.contains(element)
      );
      if (!isDescendant && !texts.includes(text)) {
        texts.push(text);
      }
    }
  }

  // Return the longest text as main content
  return texts.sort((a, b) => b.length - a.length)[0] || '';
}

function extractMedia(article) {
  const media = [];

  // Extract images
  const images = article.querySelectorAll('img[src*="cdninstagram"], img[src*="threads"], img[alt]');
  for (const img of images) {
    const src = img.src || img.getAttribute('data-src');
    if (src && !src.includes('avatar') && !src.includes('profile')) {
      media.push({
        type: 'image',
        url: src,
        alt: img.alt || ''
      });
    }
  }

  // Extract videos
  const videos = article.querySelectorAll('video');
  for (const video of videos) {
    const src = video.src || video.querySelector('source')?.src;
    if (src) {
      media.push({
        type: 'video',
        url: src,
        poster: video.poster || ''
      });
    }
  }

  return media;
}

function extractEngagement(article) {
  const engagement = {
    likes: 0,
    comments: 0,
    reposts: 0,
    shares: 0
  };

  // Look for engagement text
  const engagementTexts = article.querySelectorAll('span, div');
  
  for (const element of engagementTexts) {
    const text = element.textContent.trim();
    
    // Match patterns like "123 likes", "45 replies", etc.
    const likeMatch = text.match(/(\d+(?:,\d+)*(?:\.\d+)?[KMB]?)\s*(likes?|thích)/i);
    if (likeMatch) {
      engagement.likes = parseEngagementNumber(likeMatch[1]);
    }

    const commentMatch = text.match(/(\d+(?:,\d+)*(?:\.\d+)?[KMB]?)\s*(replies?|comments?|bình luận)/i);
    if (commentMatch) {
      engagement.comments = parseEngagementNumber(commentMatch[1]);
    }

    const repostMatch = text.match(/(\d+(?:,\d+)*(?:\.\d+)?[KMB]?)\s*(reposts?|đăng lại)/i);
    if (repostMatch) {
      engagement.reposts = parseEngagementNumber(repostMatch[1]);
    }

    const shareMatch = text.match(/(\d+(?:,\d+)*(?:\.\d+)?[KMB]?)\s*(shares?|chia sẻ)/i);
    if (shareMatch) {
      engagement.shares = parseEngagementNumber(shareMatch[1]);
    }
  }

  // Alternative: try aria-labels
  const buttons = article.querySelectorAll('button, [role="button"]');
  for (const button of buttons) {
    const ariaLabel = button.getAttribute('aria-label') || '';
    const match = ariaLabel.match(/(\d+(?:,\d+)*)/);
    if (match) {
      const count = parseEngagementNumber(match[1]);
      if (ariaLabel.toLowerCase().includes('like') || ariaLabel.includes('thích')) {
        engagement.likes = Math.max(engagement.likes, count);
      } else if (ariaLabel.toLowerCase().includes('comment') || ariaLabel.includes('bình luận')) {
        engagement.comments = Math.max(engagement.comments, count);
      } else if (ariaLabel.toLowerCase().includes('repost') || ariaLabel.includes('đăng lại')) {
        engagement.reposts = Math.max(engagement.reposts, count);
      } else if (ariaLabel.toLowerCase().includes('share') || ariaLabel.includes('chia sẻ')) {
        engagement.shares = Math.max(engagement.shares, count);
      }
    }
  }

  return engagement;
}

function extractFirstComment(article) {
  // Look for comment sections or reply indicators
  const commentSection = article.querySelector('[class*="Comment"], [class*="Reply"]');
  
  if (!commentSection) return null;

  const commentText = commentSection.textContent.trim();
  const links = Array.from(commentSection.querySelectorAll('a'))
    .map(a => a.href)
    .filter(href => href && !href.includes('threads.com/@'));

  if (commentText || links.length > 0) {
    return {
      text: commentText,
      links: links
    };
  }

  return null;
}

function extractPostUrl(article) {
  const link = article.querySelector('a[href*="/post/"]');
  if (link) {
    return link.href;
  }
  return window.location.href;
}

function parseEngagementNumber(str) {
  // Remove commas and parse
  str = str.replace(/,/g, '');
  
  // Handle K, M, B suffixes
  if (str.endsWith('K')) {
    return Math.round(parseFloat(str) * 1000);
  } else if (str.endsWith('M')) {
    return Math.round(parseFloat(str) * 1000000);
  } else if (str.endsWith('B')) {
    return Math.round(parseFloat(str) * 1000000000);
  }
  
  return parseInt(str) || 0;
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Shopee link extraction and conversion
function extractShopeeLinksFromPost(content, firstComment) {
  const original = [];
  const converted = [];
  const SHOPEE_AFFILIATE_ID = '17357490088';

  // Regex patterns for Shopee links
  const patterns = [
    /https?:\/\/(?:www\.)?shopee\.vn\/[^\s<>"']+/gi,
    /https?:\/\/(?:www\.)?shopee\.com\.vn\/[^\s<>"']+/gi,
    /https?:\/\/shope\.ee\/[^\s<>"']+/gi
  ];

  // Extract from content
  if (content) {
    patterns.forEach(pattern => {
      const matches = content.match(pattern) || [];
      matches.forEach(link => {
        if (!original.includes(link)) {
          original.push(link);
          converted.push(convertShopeeToAffiliate(link, SHOPEE_AFFILIATE_ID));
        }
      });
    });
  }

  // Extract from first comment
  if (firstComment) {
    // From comment text
    if (firstComment.text) {
      patterns.forEach(pattern => {
        const matches = firstComment.text.match(pattern) || [];
        matches.forEach(link => {
          if (!original.includes(link)) {
            original.push(link);
            converted.push(convertShopeeToAffiliate(link, SHOPEE_AFFILIATE_ID));
          }
        });
      });
    }

    // From comment links array
    if (firstComment.links && Array.isArray(firstComment.links)) {
      firstComment.links.forEach(link => {
        if (isShopeeLink(link) && !original.includes(link)) {
          original.push(link);
          converted.push(convertShopeeToAffiliate(link, SHOPEE_AFFILIATE_ID));
        }
      });
    }
  }

  return { original, converted };
}

function isShopeeLink(url) {
  if (!url || typeof url !== 'string') return false;
  return url.includes('shopee.vn') || 
         url.includes('shopee.com.vn') || 
         url.includes('shope.ee');
}

function convertShopeeToAffiliate(url, affiliateId) {
  try {
    const urlObj = new URL(url);
    
    // Add or update af_siteid parameter
    urlObj.searchParams.set('af_siteid', affiliateId);
    
    return urlObj.toString();
  } catch (e) {
    // If URL parsing fails, append manually
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}af_siteid=${affiliateId}`;
  }
}

// Log that content script is loaded
console.log('Threads Data Downloader: Content script loaded');
