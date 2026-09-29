SIPAT DATAR - Pengolah Data Leveling (mengacu SNI 19-6988-2004)

*Mode install/offline (PWA) hanya aktif lewat https:// atau localhost (mis. GitHub Pages), bukan file://.

STRUKTUR
index.html    kerangka halaman (kartu, tabel, dialog)
styles.css    tampilan: warna, tabel, mode gelap
utils.js      perhitungan murni: konstanta SNI, jarak, dH, elevasi, salah penutup
app.js        tampilan & aksi: render tabel, simpan/buka, CSV, hapus
manifest.json, sw.js, icon-192.png, icon-512.png    PWA (ikon bisa diganti dengan ikon Anda)

YANG SERING DIUBAH
- Konstanta SNI per kelas ......... utils.js -> C = {kelas: [c seksi, c jalur, c kring, orde]}
- Batas BA+BB-2BT (mm) ............ utils.js -> TOL_BENANG
- Batas selisih jarak B-M (%) ..... utils.js -> TOL_PCT (teks "<2%" di index.html diganti manual)
- Warna header .................... styles.css -> header{background:#2563eb}
- Menambah file baru .............. daftarkan di FILES pada sw.js, lalu naikkan CACHE

RUMUS
Jarak (m)     = (BA - BB) x 100   (BA, BB dalam mm -> (BA-BB)/10)
dH (mm)       = BT belakang - BT muka
Elevasi muka  = elevasi belakang + dH/1000
Kor. BT (m)   = (BA+BB)/2 - BT, dibagi 1000
Toleransi     = c x akar(D) mm, D dalam km (pergi-pulang: D = separuh total jarak)
