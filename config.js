/* Konfigurasi RIDA-AFAEK. Ubah nilai di bawah ini; tidak perlu menyunting index.html atau login.html. */
window.RIDA_CONFIG = {
  // Tautan Google Form pengusulan riset/kajian OPD
  FORM_URL: "https://forms.gle/aSLm64Esid9QYE2V8",

  // Spreadsheet "Data untuk dasboard" (tanggapan Google Form), tab pertama. Dibaca langsung selama berbagi
  // diatur "Siapa saja yang memiliki tautan dapat melihat". Kolom dicocokkan menurut judul pertanyaan.
  TANGGAPAN_SHEET_ID: "1rmPQ51ULpwJIHMGLwGDK0GP29jRq-_p2UTE-4ukBfVc",

  // Spreadsheet "Evaluasi & Umpan Balik Penggunaan Platform RIDA-AFAEK" (lima butir skala 1-5), tab pertama
  FEEDBACK_SHEET_ID: "1DsbCO4RVjS1LsmbaNUHoYuWFPgTRhndLrGjEnXAs4Jc",

  // Lembar kerja terbit "Isu dari RPJMD dan renstra" (kolom B = OPD, kolom D = dokumen Renstra); tautan berakhiran /pub
  RENSTRA_PUB_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRKPVvwfsx0vMEKVl2eX8mrVkVwxKDhrPtmxPDuys8FSEAWpu25wjVZCLvy6jOy2eiU20mHUYfKu8zU/pub",

  // URL aplikasi web Google Apps Script (apps-script/kemitraan.gs). Satu URL yang sama untuk keempat kegunaan di bawah:
  // penerima permohonan mitra, penghitung pengunjung, penyimpanan penyesuaian skor admin, dan verifikasi login.
  MT_ENDPOINT: "",
  VISIT_URL: "",
  ADMIN_API: "",
  VERIFY_URL: "",

  // Tautan CSV terbit lembar "Publik" berisi permohonan mitra (tanpa kolom surel)
  MT_CSV: "",

  // OAuth Client ID Google (Google Cloud Console > Credentials > Web application) untuk login admin
  GOOGLE_CLIENT_ID: "",

  // Halaman login admin (tombol "Login Admin" pada footer)
  ADMIN_URL: "login.html"
};
