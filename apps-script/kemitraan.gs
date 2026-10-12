/* Google Apps Script RIDA-AFAEK: permohonan mitra, penyesuaian skor admin, verifikasi login, penghitung pengunjung.
 * Cara pakai: buka spreadsheet > Ekstensi > Apps Script > tempel kode ini > isi GOOGLE_CLIENT_ID
 * > Terapkan > Deployment baru > Aplikasi web (Jalankan sebagai: Saya; Akses: Siapa saja)
 * > salin URL ke MT_ENDPOINT / VISIT_URL / ADMIN_API pada konfigurasi dasbor dan ke VERIFY_URL pada login.html.
 * Lembar yang dibuat otomatis: "Permohonan" (kolom D = surel, internal), "Penyesuaian" (skor/penghapusan oleh admin), "Statistik".
 * Penyesuaian hanya diterima bila ID token Google valid, berasal dari Client ID ini, dan milik salah satu surel admin. */
const SHEET_NAME = "Permohonan";
const OVERRIDE_SHEET = "Penyesuaian";
const GOOGLE_CLIENT_ID = "ISI_CLIENT_ID_ANDA.apps.googleusercontent.com"; // sama dengan login.html
const ADMIN_EMAILS = ["bridabapperidanttprov@gmail.com", "iffahbapperida@gmail.com"];

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

/* Mengembalikan surel admin bila token sah, selain itu null. */
function verifyToken_(token) {
  try {
    const r = UrlFetchApp.fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(token || ""), { muteHttpExceptions: true });
    if (r.getResponseCode() !== 200) return null;
    const t = JSON.parse(r.getContentText());
    const mail = String(t.email || "").toLowerCase();
    if (String(t.email_verified) === "true" && t.aud === GOOGLE_CLIENT_ID && ADMIN_EMAILS.indexOf(mail) >= 0) return mail;
  } catch (err) {}
  return null;
}

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.getActive();

  // Penyesuaian skor / penghapusan dari peringkat prioritas (khusus admin)
  if (d.act === "override") {
    const who = verifyToken_(d.token);
    if (!who) return json_({ ok: false, error: "unauthorized" });
    const sh = ss.getSheetByName(OVERRIDE_SHEET) || ss.insertSheet(OVERRIDE_SHEET);
    const lock = LockService.getScriptLock();
    lock.waitLock(5000);
    if (sh.getLastRow() === 0) sh.appendRow(["Kunci", "Skor", "Hapus", "Alasan", "Oleh", "Waktu"]);
    const n = Math.max(sh.getLastRow() - 1, 1);
    const keys = sh.getRange(2, 1, n, 1).getValues().map(function (r) { return r[0]; });
    const idx = keys.indexOf(d.key);
    const skor = (d.skor === "" || d.skor == null) ? "" : Number(d.skor);
    const clear = skor === "" && !d.hapus;
    const vals = [d.key, skor, d.hapus ? "ya" : "", d.ket || "", who, new Date()];
    if (idx >= 0) {
      if (clear) sh.deleteRow(idx + 2); else sh.getRange(idx + 2, 1, 1, 6).setValues([vals]);
    } else if (!clear) {
      sh.appendRow(vals);
    }
    lock.releaseLock();
    return json_({ ok: true });
  }

  // Permohonan intervensi mitra
  const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(["Waktu", "Lembaga", "Jenis Mitra", "Surel", "OPD", "Masalah", "Kontribusi", "Uraian", "Bukti Kerja Sama", "Rencana Keluaran", "Dokumen Hasil", "Status"]);
  }
  sh.appendRow([new Date(), d.lembaga, d.jenis, d.em, d.opd, d.isu,
    (d.kontr || []).join("; "), d.ur, d.bukti, (d.keluaran || []).join("; "), "", "Diajukan"]);
  return ContentService.createTextOutput("ok");
}

function doGet(e) {
  const act = e && e.parameter && e.parameter.act;

  // Verifikasi ID token Google untuk login admin (VERIFY_URL pada login.html)
  if (act === "verify") {
    const mail = verifyToken_(e.parameter.token);
    return json_(mail ? { ok: true, email: mail } : { ok: false });
  }

  // Daftar penyesuaian skor. Skor dan status hapus bersifat publik; alasan dan pelaku hanya untuk admin bertoken sah.
  if (act === "overrides") {
    const admin = e.parameter.token ? verifyToken_(e.parameter.token) : null;
    const sh = SpreadsheetApp.getActive().getSheetByName(OVERRIDE_SHEET);
    const out = {};
    if (sh && sh.getLastRow() > 1) {
      sh.getRange(2, 1, sh.getLastRow() - 1, 6).getValues().forEach(function (r) {
        if (!r[0]) return;
        const o = {};
        if (r[1] !== "") o.skor = Number(r[1]);
        if (r[2] === "ya") o.hapus = true;
        if (admin) { o.ket = r[3]; o.by = r[4]; }
        out[r[0]] = o;
      });
    }
    return json_(out);
  }

  // Penghitung pengunjung: act=hit menambah, act=get hanya membaca
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName("Statistik");
  if (!sh) {
    sh = ss.insertSheet("Statistik");
    sh.getRange("B2").setNumberFormat("@");
    sh.getRange("A1:B3").setValues([["total", 0], ["tanggal", ""], ["hari", 0]]);
  }
  const today = Utilities.formatDate(new Date(), "Asia/Makassar", "yyyy-MM-dd");
  let total = Number(sh.getRange("B1").getValue());
  let tgl = String(sh.getRange("B2").getValue());
  let hari = Number(sh.getRange("B3").getValue());
  if (tgl !== today) { tgl = today; hari = 0; }
  if (act === "hit") { total++; hari++; }
  sh.getRange("B1:B3").setValues([[total], [tgl], [hari]]);
  lock.releaseLock();
  return json_({ total: total, hari: hari });
}
