# RIDA-AFAEK

Platform Penghimpunan Isu Strategis dan Kebutuhan Riset Perangkat Daerah Provinsi Nusa Tenggara Timur
(Riset dan Inovasi Daerah – Arena Forum Aspirasi, Evaluasi, dan Kaji-Riset), Bapperida Provinsi NTT.

Situs statis (HTML, CSS, JavaScript tanpa proses build). Data dibaca dari Google Sheets; penyimpanan permohonan mitra,
penyesuaian skor admin, dan penghitung pengunjung memakai Google Apps Script.

## Isi repositori

| Berkas | Fungsi |
|---|---|
| `index.html` | Beranda dan dasbor |
| `login.html` | Login admin dengan akun Google (hanya dua email admin yang diterima) |
| `config.js` | Seluruh pengaturan tautan, ID spreadsheet, dan kunci layanan. Satu-satunya berkas yang perlu disunting |
| `apps-script/kemitraan.gs` | Kode Google Apps Script: permohonan mitra, penyesuaian skor, verifikasi token, penghitung pengunjung |
| `.nojekyll` | Mencegah GitHub Pages memproses berkas dengan Jekyll |

## 1. Menayangkan melalui GitHub Pages

1. Buat repositori baru, lalu unggah seluruh isi folder ini (termasuk `.nojekyll`, berkas berawalan titik sering tersembunyi).
2. **Settings → Pages → Deploy from a branch**, branch `main`, folder `/ (root)`, simpan.
3. Situs tersedia di `https://<akun>.github.io/<repositori>/`.

## 2. Sumber data

| Bagian dasbor | Sumber | Pengaturan |
|---|---|---|
| Ringkasan, Profil OPD, Isu dan Masalah, Prioritas, Keluaran, Pendanaan, Kemitraan | Spreadsheet "Data untuk dasboard" (tanggapan Google Form) | `TANGGAPAN_SHEET_ID` |
| Umpan Balik Platform | Spreadsheet "Evaluasi & Umpan Balik Penggunaan Platform RIDA-AFAEK" | `FEEDBACK_SHEET_ID` |
| Dokumen Perencanaan yang Menjadi Rujukan | Lembar "Isu dari RPJMD dan renstra" (kolom B dan D) | `RENSTRA_PUB_URL` |

Catatan:
- Atur berbagi kedua spreadsheet tanggapan menjadi "Siapa saja yang memiliki tautan dapat melihat". Seluruh kolom, termasuk nama penanggung jawab, dapat dibaca pemegang tautan; pertimbangkan lembar turunan yang hanya memuat kolom yang dibutuhkan.
- Kolom tanggapan dicocokkan menurut **judul pertanyaan**, jadi judul tidak boleh diubah sembarangan. Kolom RPJMD dan RKPD tidak ada pada form; bila ingin dihitung dalam keterkaitan, tambahkan kolom berjudul "RPJMD" dan "Program RKPD" di sisi kanan lembar. Kolom "indikator kinerja (IKU/Renstra)" dipakai sebagai isian Renstra.
- Selama spreadsheet tanggapan belum berisi data, dasbor menampilkan data contoh dengan keterangan yang jelas.
- Hyperlink pada kolom D lembar Renstra terbaca dari versi HTML lembar terbit. Bila tidak terbaca dari domain `github.io`, tulis alamat Drive sebagai teks biasa pada kolom D.

## 3. Google Apps Script (permohonan mitra, penyesuaian skor, pengunjung)

1. Buka spreadsheet penyimpanan, *Ekstensi → Apps Script*, tempel isi `apps-script/kemitraan.gs`, lalu isi `GOOGLE_CLIENT_ID`.
2. *Terapkan → Deployment baru → Aplikasi web* (jalankan sebagai: Saya; akses: Siapa saja). Salin URL `/exec`.
3. Tempel URL itu pada `config.js`: `MT_ENDPOINT`, `VISIT_URL`, `ADMIN_API`, dan `VERIFY_URL`.
4. Terbitkan lembar turunan "Permohonan" tanpa kolom surel sebagai CSV, lalu tempel tautannya ke `MT_CSV`.

Lembar yang dibuat otomatis: `Permohonan`, `Penyesuaian` (skor dan penghapusan oleh admin), `Statistik`.

## 4. Login admin dengan akun Google

1. Google Cloud Console → *APIs & Services → Credentials → Create credentials → OAuth client ID → Web application*.
2. Pada *Authorized JavaScript origins*, isi alamat situs (misalnya `https://<akun>.github.io`). Untuk uji lokal tambahkan `http://localhost:8000`.
3. Salin Client ID ke `GOOGLE_CLIENT_ID` pada `config.js` **dan** pada `apps-script/kemitraan.gs`.
4. Hanya `bridabapperidanttprov@gmail.com` dan `iffahbapperida@gmail.com` yang diterima sebagai admin.

Admin yang login dapat membuka menu **Peringkat Prioritas Riset** dan melihat kolom **Aksi** setelah Skor: Tampilkan (rincian lengkap usulan), Edit (ubah skor 0–100 dengan alasan), dan Hapus (sembunyikan dari peringkat, dapat dipulihkan). Perubahan disimpan ke lembar `Penyesuaian` dan terlihat semua pengunjung. Penulisan ke server hanya diterima bila token Google sah dan milik email admin.

## Catatan keamanan

- Halaman statis tidak dapat menyembunyikan isi dari pengunjung yang sengaja mencarinya; tampilan admin pada peramban hanya penghalang tampilan. Yang terlindungi di sisi server hanyalah penulisan penyesuaian skor melalui Apps Script.
- Repositori publik memperlihatkan seluruh isi `config.js` dan kode sumber. Jangan menaruh rahasia di dalamnya. Client ID dan URL Web App bukan rahasia.
- Data isian formulir disaring (di-escape) sebelum ditampilkan agar kode berbahaya yang diketik pengisi tidak berjalan.

Rujukan: Perubahan RKPD Provinsi NTT 2025 dan RPJMD Provinsi NTT 2025–2029 (Perda No. 6 Tahun 2025).
