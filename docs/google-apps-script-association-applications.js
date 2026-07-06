/**
 * SURE START 협단체 협약 신청 — Google Apps Script
 *
 * 1. Google Sheet 생성 후 SHEET_ID 설정
 * 2. ADMIN_TOKEN, ADMIN_EMAIL 설정
 * 3. 배포 > 새 배포 > 웹 앱 > 액세스: 모든 사용자
 */

const SHEET_ID = "YOUR_GOOGLE_SHEET_ID";
const SHEET_NAME = "applications";
const ADMIN_TOKEN = "YOUR_SECURE_ADMIN_TOKEN";
const ADMIN_EMAIL = "wiseon@wiseinc.co.kr";

const HEADERS = [
  "id",
  "createdAt",
  "associationName",
  "websiteUrl",
  "memberCompanyCount",
  "managerName",
  "managerPhone",
  "managerEmail",
  "representativeName",
  "businessNumber",
  "establishedYear",
  "address",
  "industry",
  "smallBusinessMemberCount",
  "managerPosition",
  "preferredContactMethod",
  "message",
  "privacyConsent",
  "newsletterConsent",
  "status",
  "adminMemo",
  "updatedAt",
];

const VALID_STATUSES = ["접수완료", "검토중", "연락완료", "협약서 발송", "협약완료", "보류"];

function doGet(e) {
  try {
    const action = e.parameter.action;
    if (action === "list") {
      assertAdmin(e.parameter.token);
      return jsonResponse({ ok: true, data: getAllApplications() });
    }
    if (action === "get") {
      assertAdmin(e.parameter.token);
      const row = findById(e.parameter.id);
      if (!row) return jsonResponse({ ok: false, error: "Not found" }, 404);
      return jsonResponse({ ok: true, data: row });
    }
    return jsonResponse({ ok: false, error: "Invalid action" }, 400);
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err.message || err) }, err.status || 500);
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");
    if (body.action === "create") return handleCreate(body);
    if (body.action === "updateStatus") {
      assertAdmin(body.token);
      return handleUpdateStatus(body);
    }
    if (body.action === "updateMemo") {
      assertAdmin(body.token);
      return handleUpdateMemo(body);
    }
    return jsonResponse({ ok: false, error: "Invalid action" }, 400);
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err.message || err) }, err.status || 500);
  }
}

function handleCreate(body) {
  if (body.website && String(body.website).trim()) {
    return jsonResponse({ ok: true, data: { id: "ignored" } });
  }

  const associationName = String(body.associationName || "").trim();
  const websiteUrl = normalizeUrl(String(body.websiteUrl || "").trim());
  const memberCompanyCount = Number(body.memberCompanyCount);
  const managerName = String(body.managerName || "").trim();
  const managerPhone = String(body.managerPhone || "").trim();
  const managerEmail = String(body.managerEmail || "").trim();
  const message = String(body.message || "").trim();
  const privacyConsent = body.privacyConsent === true;

  if (!associationName) throw new Error("협회·단체명이 필요합니다.");
  if (!websiteUrl) throw new Error("웹사이트 주소가 올바르지 않습니다.");
  if (!Number.isFinite(memberCompanyCount) || memberCompanyCount < 1) {
    throw new Error("회원사 수가 올바르지 않습니다.");
  }
  if (!managerName) throw new Error("담당자명이 필요합니다.");
  if (managerPhone.replace(/\D/g, "").length < 9) throw new Error("전화번호가 올바르지 않습니다.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(managerEmail)) throw new Error("이메일이 올바르지 않습니다.");
  if (!privacyConsent) throw new Error("개인정보 동의가 필요합니다.");
  if (message.length > 1000) throw new Error("문의사항이 너무 깁니다.");

  const sheet = getSheet();
  ensureHeaders(sheet);

  const now = new Date().toISOString();
  const id = generateId();
  const rowData = {
    id: id,
    createdAt: now,
    associationName: associationName,
    websiteUrl: websiteUrl,
    memberCompanyCount: memberCompanyCount,
    managerName: managerName,
    managerPhone: managerPhone,
    managerEmail: managerEmail,
    representativeName: String(body.representativeName || "").trim(),
    businessNumber: String(body.businessNumber || "").trim(),
    establishedYear: String(body.establishedYear || "").trim(),
    address: String(body.address || "").trim(),
    industry: String(body.industry || "").trim(),
    smallBusinessMemberCount: String(body.smallBusinessMemberCount || "").trim(),
    managerPosition: String(body.managerPosition || "").trim(),
    preferredContactMethod: String(body.preferredContactMethod || "").trim(),
    message: message,
    privacyConsent: privacyConsent ? "true" : "false",
    newsletterConsent: body.newsletterConsent === true ? "true" : "false",
    status: "접수완료",
    adminMemo: "",
    updatedAt: now,
  };

  appendRowByHeaders(sheet, rowData);
  notifyAdminNewApplication(rowData);

  return jsonResponse({ ok: true, data: { id: id } });
}

function handleUpdateStatus(body) {
  const sheet = getSheet();
  const rowIndex = findRowIndex(sheet, body.id);
  if (rowIndex < 0) throw new Error("Not found");
  if (!VALID_STATUSES.includes(body.status)) throw new Error("유효하지 않은 상태입니다.");

  setCell(sheet, rowIndex, "status", body.status);
  setCell(sheet, rowIndex, "updatedAt", new Date().toISOString());
  return jsonResponse({ ok: true });
}

function handleUpdateMemo(body) {
  const sheet = getSheet();
  const rowIndex = findRowIndex(sheet, body.id);
  if (rowIndex < 0) throw new Error("Not found");

  setCell(sheet, rowIndex, "adminMemo", String(body.adminMemo || ""));
  setCell(sheet, rowIndex, "updatedAt", new Date().toISOString());
  return jsonResponse({ ok: true });
}

function getAllApplications() {
  const sheet = getSheet();
  ensureHeaders(sheet);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const headerMap = getHeaderMap(sheet);
  const colCount = sheet.getLastColumn();
  const values = sheet.getRange(2, 1, lastRow, colCount).getValues();
  return values.map(function (row) {
    return rowToObject(row, headerMap);
  }).reverse();
}

function findById(id) {
  const all = getAllApplications();
  for (var i = 0; i < all.length; i++) {
    if (all[i].id === id) return all[i];
  }
  return null;
}

function findRowIndex(sheet, id) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;
  const ids = sheet.getRange(2, 1, lastRow, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (ids[i][0] === id) return i + 2;
  }
  return -1;
}

function rowToObject(row, headerMap) {
  function val(key) {
    var idx = headerMap[key];
    if (idx === undefined) return undefined;
    return row[idx];
  }

  function str(key) {
    var v = val(key);
    if (v === undefined || v === null || v === "") return undefined;
    return String(v);
  }

  function bool(key) {
    var v = val(key);
    return v === true || v === "true";
  }

  function dateStr(key) {
    var v = val(key);
    if (!v) return undefined;
    return v instanceof Date ? v.toISOString() : String(v);
  }

  return {
    id: str("id") || "",
    createdAt: dateStr("createdAt") || "",
    associationName: str("associationName") || "",
    websiteUrl: str("websiteUrl") || "",
    memberCompanyCount: Number(val("memberCompanyCount")) || 0,
    managerName: str("managerName") || "",
    managerPhone: str("managerPhone") || "",
    managerEmail: str("managerEmail") || "",
    representativeName: str("representativeName"),
    businessNumber: str("businessNumber"),
    establishedYear: str("establishedYear"),
    address: str("address"),
    industry: str("industry"),
    smallBusinessMemberCount: str("smallBusinessMemberCount"),
    managerPosition: str("managerPosition"),
    preferredContactMethod: str("preferredContactMethod"),
    message: str("message"),
    privacyConsent: bool("privacyConsent"),
    newsletterConsent: bool("newsletterConsent"),
    status: str("status") || "접수완료",
    adminMemo: str("adminMemo"),
    updatedAt: dateStr("updatedAt"),
  };
}

function appendRowByHeaders(sheet, data) {
  const headerMap = getHeaderMap(sheet);
  const colCount = sheet.getLastColumn();
  const row = new Array(colCount).fill("");
  Object.keys(data).forEach(function (key) {
    if (headerMap[key] !== undefined) {
      row[headerMap[key]] = data[key];
    }
  });
  sheet.appendRow(row);
}

function getHeaderMap(sheet) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const map = {};
  headers.forEach(function (h, i) {
    if (h) map[h] = i;
  });
  return map;
}

function setCell(sheet, rowIndex, headerName, value) {
  const map = getHeaderMap(sheet);
  const col = map[headerName];
  if (col === undefined) throw new Error("Column not found: " + headerName);
  sheet.getRange(rowIndex, col + 1).setValue(value);
}

function generateId() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const sheet = getSheet();
  const count = Math.max(sheet.getLastRow() - 1, 0) + 1;
  return "APP-" + y + m + d + "-" + String(count).padStart(4, "0");
}

function normalizeUrl(raw) {
  if (!raw) return null;
  var candidate = raw;
  if (!/^https?:\/\//i.test(candidate)) candidate = "https://" + candidate;
  try {
    var url = new URL(candidate);
    if (url.hostname.indexOf(".") === -1) return null;
    return url.toString();
  } catch (e) {
    return null;
  }
}

function notifyAdminNewApplication(data) {
  var subject = "[협단체 협약 신청] " + data.associationName;
  var body =
    "새 협단체 협약 신청이 접수되었습니다.\n\n" +
    "접수번호: " + data.id + "\n" +
    "협회·단체명: " + data.associationName + "\n" +
    "웹사이트: " + data.websiteUrl + "\n" +
    "회원사 수: " + data.memberCompanyCount + "\n" +
    "담당자: " + data.managerName + "\n" +
    "전화: " + data.managerPhone + "\n" +
    "이메일: " + data.managerEmail + "\n" +
    "문의사항: " + (data.message || "(없음)") + "\n";

  MailApp.sendEmail(ADMIN_EMAIL, subject, body);
}

function getSheet() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  return sheet;
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
    return;
  }

  var existing = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var missing = [];
  HEADERS.forEach(function (h) {
    if (existing.indexOf(h) === -1) missing.push(h);
  });
  if (missing.length > 0) {
    var startCol = existing.length + 1;
    sheet.getRange(1, startCol, 1, startCol + missing.length - 1).setValues([missing]);
  }
}

function assertAdmin(token) {
  if (!token || token !== ADMIN_TOKEN) {
    var err = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }
}

function jsonResponse(obj, status) {
  status = status || 200;
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
