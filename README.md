# SMK PINTAR - 3D Runner Game (SMK 17 MUNCAR)

Game 3D Princess Runner interaktif bertema SMK PINTAR yang terintegrasi penuh dengan **Vercel** dan **Google Sheets**.

## Fitur Utama Game:
- Avatar Princess 3D dengan **angka 17** tercetak di baju.
- Rintangan 3D berupa **Gedung Sekolah SMK PINTAR** dan koin emas.
- Validasi Input Siswa (Nama Lengkap & Nomor WhatsApp diawali `+62`).
- Sistem Kuis Interaktif 10 Level:
  - Level 1: Akuntansi dan Keuangan Lembaga (AKL)
  - Level 2: Bisnis Daring dan Pemasaran (BDP)
  - Level 3: Perhotelan (PH)
  - Level 4: Rekayasa Perangkat Lunak (RPL)
  - Level 5: Teknik Otomotif (TO)
  - Level 6: Teknik Pengelasan (TP)
  - Level 7: Rencana Setelah Lulus SMP
  - Level 8: Pilihan Jurusan di SMK PINTAR
  - Level 9: Jurusan Impian Utama
  - Level 10: Hobi & Cita-Cita (Ditulis jujur dari hati)
- **Leaderboard Real-Time** terhubung dengan Google Sheets.

## Tutorial Setup Backend Google Apps Script (Google Sheets):
1. Buat **Google Sheets** baru dengan header di Baris 1: `Timestamp`, `Nama`, `WhatsApp`, `Level`, `Jawaban/Kuis`, `Skor`.
2. Buka menu **Ekstensi > Apps Script**.
3. Salin kode Apps Script berikut:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([new Date(), data.nama, data.whatsapp, data.level, data.jawaban, data.skor]);
  return ContentService.createTextOutput(JSON.stringify({status: "success"})).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rows = sheet.getDataRange().getValues();
  var result = [];
  for (var i = 1; i < rows.length; i++) {
    result.push({ nama: rows[i][1], level: rows[i][3], skor: rows[i][5] });
  }
  result.sort((a, b) => b.skor - a.skor);
  return ContentService.createTextOutput(JSON.stringify(result.slice(0, 10))).setMimeType(ContentService.MimeType.JSON);
}
```

4. Klik **Deploy > Deployment baru**, pilih **Aplikasi web**, ubah akses ke **Anyone (Siapa saja)**, lalu salin **URL Web App**.
5. Di Vercel Dashboard, tambahkan Environment Variable:
   - `GOOGLE_SCRIPT_URL` = *(URL Web App yang disalin tadi)*
