// PageSpeed Insights Automation Script for Google Apps Script
// Extracts PageSpeed data automatically and stores it in Google Sheets

// env variables === properties in appscript
// project settings > go down to "Script Properties" add your secret variables
function getScriptSecret(key) {
  if (!key) return;
  let secret = PropertiesService.getScriptProperties().getProperty(key);
  if (!secret) {
    throw Error(`Secret ${key} is empty`);
  }
  return secret;
}
var API_KEY = getScriptSecret("PAGESPEED_API_KEY");
var SPREAD_SHEET_ID = getScriptSecret("PAGESPEED_SPREAD_SHEET_ID");
var WEBSITE_URL = getScriptSecret("PAGESPEED_WEBSITE_URL");
var SHEET_NAME = getScriptSecret("PAGESPEED_SHEET_NAME");

// ==============================
// CONFIGURATION (EDIT HERE)
// ==============================
const CONFIG = {
  // Websites to monitor
  urls: [WEBSITE_URL, "http://tabbsa.com"],

  // Google Sheets configuration
  spreadsheetId: SPREAD_SHEET_ID,
  sheetName: SHEET_NAME || "TEST", // MUST USE PROPERTY ON PRODUCTION

  // PageSpeed Insights API Key
  apiKey: API_KEY,

  // Email Notifications
  emailNotification: true,
  notificationEmail: ["ib-basheer@tab.sa", "sfwn.mo.work@gmail.com"],

  // ✅ Schedule Times (Runs Daily)
  scheduleTimes: [
    { hour: 8, minute: 30 }, // 8:30 AM
    { hour: 12, minute: 0 }, // 12:00 PM
    { hour: 15, minute: 15 }, // 12:00 PM
    { hour: 16, minute: 30 }, // 4:30 PM
  ],
};

// ==============================
// MAIN EXTRACTION FUNCTION
// ==============================
function extractPageSpeedData() {
  try {
    console.log("🚀 Starting PageSpeed data extraction...");

    const sheet = getOrCreateSheet();

    CONFIG.urls.forEach((url) => {
      const websiteDomain = url.split("/").pop();
      // const websiteDomain = new URL(url).hostname
      console.log("url information", {
        url,
        websiteDomain,
      });
      const sheetName = getOrCreateSheet(websiteDomain);
      console.log(`🌐 Processing URL: ${url}`);

      // Mobile + Desktop Tests
      const mobileData = getPageSpeedData(url, "mobile");
      const desktopData = getPageSpeedData(url, "desktop");

      if (mobileData) addDataToSheet(sheetName, url, "mobile", mobileData);
      if (desktopData) addDataToSheet(sheetName, url, "desktop", desktopData);

      Utilities.sleep(1000);
    });

    console.log("✅ PageSpeed extraction completed successfully!");

    if (CONFIG.emailNotification) {
      sendNotification("✅ PageSpeed data extraction completed successfully.");
    }
  } catch (error) {
    console.error("❌ Error in extractPageSpeedData:", error);

    if (CONFIG.emailNotification) {
      sendNotification(`❌ PageSpeed extraction failed: ${error.message}`);
    }

    throw error;
  }
}

const runTest = () => {
  console.log("🔃TESTING STARTED🔃");
  extractPageSpeedData();
  console.log("✅TESTING FINISHED✅");
};

// ==================================================================================
// ==============================
// EXTRACT TOP INSIGHT (Opportunities)
// ==============================
function extractTopInsight(audits) {
  // const opportunityAudits = [
  //   "render-blocking-resources",
  //   "unused-css-rules",
  //   "unused-javascript",
  //   "modern-image-formats",
  //   "offscreen-images",
  //   "unminified-css",
  //   "unminified-javascript",
  //   "efficient-animated-content",
  //   "duplicated-javascript",
  //   "legacy-javascript",
  //   "uses-optimized-images",
  //   "uses-text-compression",
  //   "uses-responsive-images"
  // ];

  const opportunityAudits = [
    "uses-long-cache-ttl", // Cache policy
    "legacy-javascript", // Legacy JS
    "render-blocking-resources", // Render blocking
    "unused-css-rules", // Unused CSS
    "unused-javascript", // Unused JS
    "modern-image-formats", // Image formats
    "offscreen-images", // Offscreen images
    "unminified-css", // Minified CSS
    "unminified-javascript", // Minified JS
    "efficient-animated-content", // Animated content
    "duplicated-javascript", // Duplicated JS
    "uses-optimized-images", // Optimized images
    "uses-text-compression", // Text compression
    "uses-responsive-images", // Responsive images
    "uses-rel-preconnect", // Preconnect
  ];

  return returnFormatedData(audits, opportunityAudits);
}

// ==============================
// EXTRACT TOP DIAGNOSTIC
// ==============================
function extractTopDiagnostic(audits) {
  // const diagnosticAudits = [
  //   "mainthread-work-breakdown",
  //   "bootup-time",
  //   "uses-rel-preconnect",
  //   "font-display",
  //   "third-party-summary",
  //   "third-party-facades",
  //   "largest-contentful-paint-element",
  //   "lcp-lazy-loaded",
  //   "layout-shift-elements",
  //   "uses-passive-event-listeners",
  //   "no-document-write",
  //   "long-tasks",
  //   "non-composited-animations",
  //   "unsized-images",
  //   "viewport"
  // ];
  const diagnosticAudits = [
    "bootup-time", // JavaScript execution time
    "mainthread-work-breakdown", // Main-thread work
    "long-tasks", // Long tasks
    "non-composited-animations", // Non-composited animations
    "unsized-images", // Image dimensions
    "third-party-summary", // Third-party code
    "layout-shift-elements", // Layout shift elements
    "uses-passive-event-listeners", // Passive event listeners
    "dom-size", // DOM size
    "critical-request-chains", // Critical requests
    "user-timings", // User timings
    "font-display", // Font display
    "uses-rel-preconnect", // Preconnect
    "network-rtt", // Network RTT
    "network-server-latency", // Server latency
  ];

  return returnFormatedData(audits, diagnosticAudits);
}

// ==============================
// EXTRACT TOP GENERAL INFO
// ==============================
function extractTopGeneral(audits) {
  // const generalAudits = [
  //   "uses-http2",
  //   "uses-long-cache-ttl",
  //   "total-byte-weight",
  //   "dom-size",
  //   "critical-request-chains",
  //   "user-timings",
  //   "diagnostics",
  //   "network-requests",
  //   "network-rtt",
  //   "network-server-latency",
  //   "main-thread-tasks",
  //   "metrics",
  //   "screenshot-thumbnails",
  //   "final-screenshot"
  // ];
  const generalAudits = [
    "third-party-cookies", // Third-party cookies
    "errors-in-console", // Console errors
    "inspector-issues", // Inspector issues
    "js-libraries", // JavaScript libraries
    "uses-http2", // HTTP/2
    "uses-long-cache-ttl", // Cache TTL
    "total-byte-weight", // Network payload
    "dom-size", // DOM size
    "crawlable-anchors", // Crawlable links
    "canonical", // Canonical
    "robots-txt", // robots.txt
    "is-crawlable", // Crawlability
  ];

  return returnFormatedData(audits, generalAudits);
}
// ==================================================================================

// ==============================
// GET PAGESPEED DATA
// ==============================
function getPageSpeedData(url, strategy) {
  try {
    const cleanUrl = cleanAndValidateUrl(url);
    if (!cleanUrl) return null;

    const requestParams = `&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo`;

    let apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(cleanUrl)}${requestParams}`;

    if (CONFIG.apiKey) {
      apiUrl += `&key=${CONFIG.apiKey}`;
    }

    console.log(`📊 Testing ${cleanUrl} (${strategy})...`);

    const response = UrlFetchApp.fetch(apiUrl, {
      method: "GET",
      muteHttpExceptions: true,
    });

    if (response.getResponseCode() !== 200) {
      console.error("❌ API Error:", response.getContentText());
      return null;
    }

    const data = JSON.parse(response.getContentText());
    // active only on testing
    // const text = response.getContentText();
    // const currentDate = new Date()
    // const getTime = currentDate.toISOString()
    // DriveApp.createFile(strategy+"-"+getTime+"-pagespeed.json", text, "application/json");

    const audits = data.lighthouseResult.audits;
    const loadingExperience = data.loadingExperience;

    // Extract top insights, diagnostics, and general info
    const insights = extractTopInsight(audits);
    const diagnostics = extractTopDiagnostic(audits);
    const general = extractTopGeneral(audits);

    return {
      performanceScore: Math.round(
        data.lighthouseResult.categories.performance.score * 100,
      ),
      // firstContentfulPaint: getMetricValue(audits["first-contentful-paint"]),
      // largestContentfulPaint: getMetricValue(audits["largest-contentful-paint"]),
      // cumulativeLayoutShift: getMetricValue(audits["cumulative-layout-shift"]),
      // speedIndex: getMetricValue(audits["speed-index"]),
      // timeToInteractive: getMetricValue(audits["interactive"]),
      // totalBlockingTime: getMetricValue(audits["total-blocking-time"]),
      seoScore: Math.round(data.lighthouseResult.categories.seo.score * 100),
      bestPracticesScore: Math.round(
        data.lighthouseResult.categories["best-practices"].score * 100,
      ),
      accessibilityScore: Math.round(
        data.lighthouseResult.categories.accessibility.score * 100,
      ),

      // Field Data (Real Users)
      // fieldFCP: loadingExperience?.metrics?.FIRST_CONTENTFUL_PAINT_MS?.percentile || "N/A",
      // fieldLCP: loadingExperience?.metrics?.LARGEST_CONTENTFUL_PAINT_MS?.percentile || "N/A",
      // fieldCLS: loadingExperience?.metrics?.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile || "N/A",
      // fieldFID: loadingExperience?.metrics?.FIRST_INPUT_DELAY_MS?.percentile || "N/A",

      // Insights and diagnostics
      insights: insights,
      diagnostics: diagnostics,
      general: general,
    };
  } catch (error) {
    console.error(`❌ Error fetching PageSpeed for ${url}:`, error);
    return null;
  }
}

// ==============================
// URL VALIDATION
// ==============================
function cleanAndValidateUrl(url) {
  url = url.trim();

  if (!url.startsWith("http")) {
    url = "https://" + url;
  }

  const urlPattern =
    /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

  if (!urlPattern.test(url)) {
    console.error("❌ Invalid URL:", url);
    return null;
  }

  return url;
}

// ==============================
// METRIC FORMATTER
// ==============================
function getMetricValue(metric) {
  if (!metric?.numericValue) return "N/A";

  if (metric.numericUnit === "millisecond") {
    return Math.round(metric.numericValue / 10) / 100;
  }

  return Math.round(metric.numericValue * 1000) / 1000;
}

// ==============================
// GOOGLE SHEET SETUP
// ==============================
function getOrCreateSheet(sheetName) {
  console.log("getOrCreateSheet urls: ", {
    sheetName,
  });
  const spreadsheet = SpreadsheetApp.openById(CONFIG.spreadsheetId);
  let sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);

    // const headers = [
    //   "Timestamp", "URL", "Device", "Performance Score",
    //   "FCP (s)", "LCP (s)", "CLS", "Speed Index (s)",
    //   "TTI (s)", "TBT (ms)",
    //   "Field FCP (ms)", "Field LCP (ms)",
    //   "Field CLS", "Field FID (ms)",
    //   "Accessibility", "Best Practices", "SEO",
    //   "Insights", "Diagnostics", "General"  // NEW COLUMNS ADDED
    // ];
    const headers = [
      "Timestamp",
      "Website",
      "Device",
      "Performance",
      "Accessibility",
      "Best Practices",
      "SEO",
      "Insights",
      "Diagnostics",
      "General", // NEW COLUMNS ADDED
    ];
    const headerStyle02 = [""];
    const topHeaders = ["information"];

    // merge first row across all header columns
    sheet.getRange(1, 1, 1, headers.length).merge();

    // insert top header text
    sheet
      .getRange(1, 1)
      .setValue(topHeaders[0])
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setFontSize(14);

    // insert actual column headers in row 2
    sheet
      .getRange(2, 1, 1, headers.length)
      .setValues([headers])
      .setFontWeight("bold");

    // freeze rows
    sheet.setFrozenRows(2);
  }

  return sheet;
}

// ==============================
// SAVE RESULTS TO SHEET
// ==============================
function addDataToSheet(sheet, url, device, data) {
  sheet.appendRow([
    new Date(),
    url,
    device,
    data.performanceScore,
    // data.firstContentfulPaint,
    // data.largestContentfulPaint,
    // data.cumulativeLayoutShift,
    // data.speedIndex,
    // data.timeToInteractive,
    // data.totalBlockingTime,
    // data.fieldFCP,
    // data.fieldLCP,
    // data.fieldCLS,
    // data.fieldFID,
    data.accessibilityScore || "N/A",
    data.bestPracticesScore || "N/A",
    data.seoScore || "N/A",
    data.insights || "in progress", // NEW
    data.diagnostics || "in progress", // NEW
    data.general || "in progress", // NEW
  ]);

  const lastRow = sheet.getLastRow();
  const backgroundColor = device === "mobile" ? "#E8F4FD" : "#FFF4E6";
  sheet.getRange(lastRow, 1, 1, 10).setBackground(backgroundColor);

  sheet
    .getRange(lastRow, 8, 1, 3)
    .setWrap(false)
    .setVerticalAlignment("bottom");

  console.log(`✅ Data saved: ${url} (${device})`);
}

// ==============================
// EMAIL NOTIFICATION
// ==============================
function sendNotification(message) {
  if (!CONFIG.notificationEmail.length) return;

  const sheetUrl = `https://docs.google.com/spreadsheets/d/${CONFIG.spreadsheetId}/edit`;

  CONFIG.notificationEmail.forEach((email) => {
    MailApp.sendEmail({
      to: email,
      subject: "📊 PageSpeed Insights Report",
      body: `${message}\n\nView Sheet:\n${sheetUrl}`,
    });
  });

  console.log("📩 Email notification sent!");
}

// ==============================
// ✅ SETUP AUTOMATION SCHEDULE
// Run ONCE to activate triggers
// ==============================
function setupAutomation() {
  // Remove old triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach((trigger) => {
    if (trigger.getHandlerFunction() === "extractPageSpeedData") {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Create new triggers from config
  CONFIG.scheduleTimes.forEach((time) => {
    ScriptApp.newTrigger("extractPageSpeedData")
      .timeBased()
      .everyDays(1)
      .atHour(time.hour)
      .nearMinute(time.minute)
      .create();

    console.log(`✅ Scheduled daily at ${time.hour}:${time.minute}`);
  });

  console.log("🎯 Automation triggers created successfully!");
}

// ==============================
// ❌ STOP AUTOMATION (Remove Triggers)
// ==============================
function stopAutomation() {
  const triggers = ScriptApp.getProjectTriggers();

  triggers.forEach((trigger) => {
    if (trigger.getHandlerFunction() === "extractPageSpeedData") {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  console.log("❌ Automation stopped. All triggers removed.");
}

//===============================
// UTILS
//===============================

// parse the audits titles and displayValues
// and return every audit in a single line.
function returnFormatedData(audits, auditsKeys) {
  let validAudits = [];

  auditsKeys.forEach((auditKey) => {
    const audit = audits[auditKey];
    if (!audit) return;
    const { title, displayValue } = audit;
    if (displayValue) {
      validAudits.push({ title, displayValue });
    }
  });

  // return validAudits

  // return every audit in a single line.
  let parsedAudits = "";
  let parseAudits = validAudits.map((auditObj) => {
    const lastElement =
      validAudits.length - 1 === validAudits.indexOf(auditObj);
    if (lastElement) {
      parsedAudits += `${auditObj.title} ${auditObj.displayValue}`;
    } else {
      parsedAudits += `${auditObj.title} ${auditObj.displayValue}` + "\n";
    }
  });

  return parsedAudits;
}
