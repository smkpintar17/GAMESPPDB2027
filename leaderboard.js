// Vercel Serverless Function - Integrated Leaderboard & Google Sheets API

export default async function handler(req, res) {
  const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || "";

  if (req.method === 'POST') {
    const { nama, whatsapp, level, jawaban, skor } = req.body;

    try {
      if (GOOGLE_SCRIPT_URL) {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nama, whatsapp, level, jawaban, skor })
        });
      }
      return res.status(200).json({ status: 'success', message: 'Data berhasil dikirim!' });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  } 
  
  else if (req.method === 'GET') {
    try {
      if (GOOGLE_SCRIPT_URL) {
        const response = await fetch(GOOGLE_SCRIPT_URL);
        const data = await response.json();
        return res.status(200).json(data);
      }
      
      // Default Fallback Data jika belum dipasang Google Apps Script
      return res.status(200).json([
        { nama: "Siswa Contoh 1", level: 10, skor: 10000 },
        { nama: "Siswa Contoh 2", level: 5, skor: 5000 }
      ]);
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  } 
  
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
