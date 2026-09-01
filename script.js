function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var contents = e.postData.contents;
    var data = JSON.parse(contents);
    
    // Format tanggal WIB
    var timestamp = Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd HH:mm:ss");
    
    // Menyimpan data ke Google Sheets
    sheet.appendRow([
      timestamp,
      data.nama || "-",
      data.whatsapp || "-",
      data.level || 1,
      data.jawaban || "-",
      Number(data.skor) || 0
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rows = sheet.getDataRange().getValues();
    var result = [];
    
    // Ambil data mulai dari baris ke-2 (mengabaikan header)
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][1]) { // Pastikan kolom nama tidak kosong
        result.push({
          nama: rows[i][1],
          level: rows[i][3],
          skor: Number(rows[i][5]) || 0
        });
      }
    }
    
    // Urutkan berdasarkan Skor Tertinggi (Top 10)
    result.sort(function(a, b) { return b.skor - a.skor; });
    var top10 = result.slice(0, 10);
    
    return ContentService.createTextOutput(JSON.stringify(top10))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }
}