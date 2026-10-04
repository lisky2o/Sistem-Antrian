# Sistem Antrian Layanan Pajak

Aplikasi antrian kantor pajak berbahasa Indonesia dengan dashboard operator, layar informasi untuk TV, dan kiosk pengambilan nomor. Tidak memerlukan akun, layanan cloud, atau konfigurasi server.

## Menjalankan aplikasi

1. Pastikan Node.js versi 18 atau lebih baru telah tersedia.
2. Buka terminal di folder proyek ini, lalu jalankan `npm install`.
3. Jalankan `npm run dev` dan buka `http://localhost:5173`.
4. Gunakan menu **Panel Operator** untuk memilih loket, memanggil antrian berikutnya, memanggil ulang, menyelesaikan layanan, atau melewati pemohon.
5. Pilih **Layar TV** untuk membuka tampilan publik di jendela baru. Gunakan tombol **Layar penuh**; sambungkan komputer ke TV dan pilih mode duplikasi/extended display sesuai kebutuhan.
6. Pilih **Ambil Antrian** untuk kiosk. Pemohon memilih kategori layanan; tiket akan dibuka untuk dicetak melalui dialog cetak browser. Aktifkan pop-up dan printer jika pencetakan fisik diperlukan.
7. Sesuaikan nama layanan, kode, loket, dan pengumuman melalui menu **Pengaturan**. Perubahan tersimpan otomatis.

## Fitur

- Dashboard ringkasan status loket, layanan, dan daftar tunggu.
- Panel operator dengan panggil berikutnya, panggil ulang, selesaikan, dan lewati.
- Layar TV 16:9 dengan nomor yang dipanggil, nomor tunggu, jam, pengumuman, dan mode layar penuh.
- Kiosk pilihan layanan dan tiket siap cetak.
- Layar TV membacakan nomor antrian dan nama loket dalam bahasa Indonesia setiap kali nomor dipanggil atau dipanggil ulang. Gunakan tombol **Tes Suara** satu kali pada TV sebelum pelayanan dimulai untuk mengizinkan audio browser; kontrol speaker di dashboard mengaktifkan atau mematikan suara. Browser/TV perlu menyediakan suara sintetis bahasa Indonesia.
- Nada panggilan sintetis pada panel operator; audio memerlukan browser yang mendukung Web Audio dan interaksi pengguna.
- Data dan konfigurasi tersimpan di `localStorage`, tersinkron antar tab/jendela pada browser yang sama.
- Data awal contoh tersedia agar layar terisi saat demo pertama. Gunakan **Pengaturan → Reset antrian** untuk mengosongkan antrian.

## Struktur kode

- `src/components/`: halaman dashboard, operator, pengaturan, kiosk, TV, serta komponen layout dan tampilan bersama.
- `src/hooks/`: hook untuk waktu dan penyimpanan/sinkronisasi data antrian.
- `src/data/`: data awal dan konfigurasi default layanan/loket.
- `src/types/`: tipe data TypeScript untuk layanan, loket, tiket, dan status halaman.
- `src/utils/`: utilitas nomor antrian, format tanggal, audio panggilan, dan pencetakan tiket.
- `src/App.tsx`: komposisi halaman dan penghubung aksi utama aplikasi.
- `src/styles.css`: stylesheet aplikasi.

## Catatan penggunaan

Aplikasi ini menyimpan data di browser/perangkat, bukan di server. Untuk sinkronisasi antar komputer atau TV yang menjalankan browser di perangkat berbeda, dibutuhkan backend dan jaringan lokal; sinkronisasi lintas perangkat belum termasuk dalam versi siap-pakai lokal ini. Jangan gunakan data pribadi wajib pajak pada perangkat bersama tanpa kebijakan keamanan yang sesuai.

Dashboard, kiosk, dan TV harus dibuka dari alamat/origin yang sama (`http://localhost:5173`) dan profil browser yang sama. Jangan mencampur alamat seperti port `8080` dan `5173`, karena browser mengisolasi penyimpanan masing-masing port.

Untuk membuat build produksi jalankan `npm run build`; hasilnya berada di folder `dist`.
