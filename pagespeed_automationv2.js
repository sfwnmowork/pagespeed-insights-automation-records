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
// var SHEET_NAME = getScriptSecret("PAGESPEED_SHEET_NAME");

// ==============================
// CONFIGURATION (EDIT HERE)
// ==============================
const CONFIG = {
  // Websites to monitor
  urls: [WEBSITE_URL],

  // Google Sheets configuration
  spreadsheetId: SPREAD_SHEET_ID,
  sheetName: "PageSpeed Data SFWN5", // MUST USE PROPERTY ON PRODUCTION

  // PageSpeed Insights API Key
  apiKey: API_KEY,

  // Email Notifications
  emailNotification: true,
  notificationEmail: ["ib-basheer@tab.sa", "sfwn.mo.work@gmail.com"],

  // ✅ Schedule Times (Runs Daily)
  scheduleTimes: [
    { hour: 8, minute: 30 }, // 8:30 AM
    { hour: 12, minute: 0 }, // 12:00 PM
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
      console.log(`🌐 Processing URL: ${url}`);

      // Mobile + Desktop Tests
      const mobileData = getPageSpeedData(url, "mobile");
      const desktopData = getPageSpeedData(url, "desktop");

      if (mobileData) addDataToSheet(sheet, url, "mobile", mobileData);
      if (desktopData) addDataToSheet(sheet, url, "desktop", desktopData);

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
  const opportunityAudits = [
    "render-blocking-resources",
    "unused-css-rules",
    "unused-javascript",
    "modern-image-formats",
    "offscreen-images",
    "unminified-css",
    "unminified-javascript",
    "efficient-animated-content",
    "duplicated-javascript",
    "legacy-javascript",
    "uses-optimized-images",
    "uses-text-compression",
    "uses-responsive-images",
  ];

  // let topInsight = { title: "Optimized", savings: 0 };

  // opportunityAudits.forEach(auditKey => {
  //   const audit = audits[auditKey];
  //   if (audit && audit.details && audit.details.overallSavingsMs) {
  //     const savings = audit.details.overallSavingsMs;
  //     if (savings > topInsight.savings) {
  //       topInsight = {
  //         title: audit.title,
  //         savings: savings
  //       };
  //     }
  //   }
  // });

  // if (topInsight.savings > 0) {
  //   return `${topInsight.title} Est savings of ${(topInsight.savings / 1000).toFixed(2)} s`;
  // }
  return returnFormatedData(audits, opportunityAudits);

  return "Optimized";
}

// ==============================
// EXTRACT TOP DIAGNOSTIC
// ==============================
function extractTopDiagnostic(audits) {
  const diagnosticAudits = [
    "mainthread-work-breakdown",
    "bootup-time",
    "uses-rel-preconnect",
    "font-display",
    "third-party-summary",
    "third-party-facades",
    "largest-contentful-paint-element",
    "lcp-lazy-loaded",
    "layout-shift-elements",
    "uses-passive-event-listeners",
    "no-document-write",
    "long-tasks",
    "non-composited-animations",
    "unsized-images",
    "viewport",
  ];

  // let allDiagnostics = []

  // diagnosticAudits.forEach(auditKey => {
  //   const audit = audits[auditKey];
  //   if (audit && audit.displayValue) {
  //     allDiagnostics.push({ title: audit.title, displayValue: audit.displayValue })
  //   }
  // });

  // // return every diagnostic in a single line.
  // let parsedDiagnostics = ""
  // let parseDiagnostics = allDiagnostics.map((diag) => {
  //   const lastElement = allDiagnostics.length - 1 === allDiagnostics.indexOf(diag)
  //   if (lastElement) {
  //     parsedDiagnostics += `${diag.title} ${diag.displayValue}`
  //   } else {
  //     parsedDiagnostics += `${diag.title} ${diag.displayValue}` + "\n"
  //   }
  // })

  return returnFormatedData(audits, diagnosticAudits);

  return parsedDiagnostics;
}

// ==============================
// EXTRACT TOP GENERAL INFO
// ==============================
function extractTopGeneral(audits) {
  const generalAudits = [
    "uses-http2",
    "uses-long-cache-ttl",
    "total-byte-weight",
    "dom-size",
    "critical-request-chains",
    "user-timings",
    "diagnostics",
    "network-requests",
    "network-rtt",
    "network-server-latency",
    "main-thread-tasks",
    "metrics",
    "screenshot-thumbnails",
    "final-screenshot",
  ];

  // let allGenerals = []

  // generalAudits.forEach((gen) => {
  //   const audit = audits[gen];
  //   if (!audit) return;
  //   const { title, displayValue } = audit
  //   if (displayValue) {
  //     allGenerals.push({ title, displayValue })
  //   }
  // })

  // console.log("the new function to return general: ", returnFormatedData(audits, generalAudits))
  // console.log("general audits: ", allGenerals)

  // // Check for common issues
  // if (audits["uses-http2"] && audits["uses-http2"].score < 1) {
  //   return audits["uses-http2"].title;
  // }

  // if (audits["uses-long-cache-ttl"] && audits["uses-long-cache-ttl"].score < 1) {
  //   return `${audits["uses-long-cache-ttl"].title} ${audits["uses-long-cache-ttl"].displayValue || ""}`;
  // }

  // if (audits["total-byte-weight"] && audits["total-byte-weight"].score < 1) {
  //   return `${audits["total-byte-weight"].title} ${audits["total-byte-weight"].displayValue || ""}`;
  // }

  // if (audits["dom-size"] && audits["dom-size"].score < 1) {
  //   return `${audits["dom-size"].title} ${audits["dom-size"].displayValue || ""}`;
  // }

  // return "Optimized";
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
function getOrCreateSheet() {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.spreadsheetId);
  let sheet = spreadsheet.getSheetByName(CONFIG.sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.sheetName);

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
