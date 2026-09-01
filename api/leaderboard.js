const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || "";

export default async function handler(req, res) {
  // Setup CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      if (!GOOGLE_SCRIPT_URL) {
        return res.status(500).json({ error: "GOOGLE_SCRIPT_URL belum dikonfigurasi di Vercel!" });
      }

      // Mengirim POST ke Google Script dengan text/plain & redirect follow
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        redirect: 'follow',
        body: JSON.stringify(req.body)
      });

      const responseText = await response.text();
      return res.status(200).json({ status: 'success', data: responseText });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  } 
  else if (req.method === 'GET') {
    try {
      if (!GOOGLE_SCRIPT_URL) {
        return res.status(500).json({ error: "GOOGLE_SCRIPT_URL belum dikonfigurasi di Vercel!" });
      }

      const response = await fetch(GOOGLE_SCRIPT_URL, { redirect: 'follow' });
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json([]);
    }
  }
}
