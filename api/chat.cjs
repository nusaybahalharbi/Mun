const https = require("https");

module.exports = function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: { message: "Method not allowed" } });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: { message: "GEMINI_API_KEY not set in Vercel" },
    });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const system = body.system || "";
  const messages = body.messages || [];

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const payload = JSON.stringify({
    system_instruction: { parts: [{ text: system }] },
    contents,
    generationConfig: {
      maxOutputTokens: 500,
      temperature: 0.9,
      topP: 0.95,
    },
  });

  const options = {
    hostname: "generativelanguage.googleapis.com",
    port: 443,
    path: `/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payload),
    },
  };

  const apiReq = https.request(options, (apiRes) => {
    let data = "";

    apiRes.on("data", (chunk) => {
      data += chunk;
    });

    apiRes.on("end", () => {
      const parsed = JSON.parse(data);

      if (parsed.error) {
        return res.status(500).json({
          error: { message: parsed.error.message },
        });
      }

      const text =
        parsed?.candidates?.[0]?.content?.parts
          ?.map((p) => p.text || "")
          .join("") || "No response generated";

      return res.status(200).json({
        content: [{ type: "text", text }],
      });
    });
  });

  apiReq.on("error", (err) => {
    return res.status(500).json({
      error: { message: err.message },
    });
  });

  apiReq.write(payload);
  apiReq.end();
};