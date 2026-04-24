import https from "https";

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: { message: "Method not allowed" } });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set");
    return res.status(500).json({
      error: { message: "GEMINI_API_KEY not set in Vercel environment variables" },
    });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const system = body.system || "";
    const messages = body.messages || [];

    if (!messages.length) {
      return res.status(400).json({ error: { message: "messages required" } });
    }

    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const payload = JSON.stringify({
      system_instruction: { parts: [{ text: system }] },
      contents: contents,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.9,
        topP: 0.95,
      },
    });

    const path =
      "/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

    const options = {
      hostname: "generativelanguage.googleapis.com",
      port: 443,
      path: path,
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
        try {
          const parsed = JSON.parse(data);

          if (parsed.error) {
            console.error("Gemini API error:", parsed.error);
            return res.status(parsed.error.code || 500).json({
              error: { message: parsed.error.message || "Gemini API error" },
            });
          }

          let text = "";
          if (
            parsed.candidates &&
            parsed.candidates[0] &&
            parsed.candidates[0].content &&
            parsed.candidates[0].content.parts
          ) {
            for (const part of parsed.candidates[0].content.parts) {
              if (part.text) text += part.text;
            }
          }

          if (!text) {
            console.error("Empty text. Full response:", JSON.stringify(parsed));
            return res.status(500).json({
              error: { message: "Empty response from Gemini" },
            });
          }

          res.status(200).json({
            content: [{ type: "text", text: text }],
          });
        } catch (e) {
          console.error("Parse error:", e.message, "Data:", data.substring(0, 500));
          res.status(500).json({
            error: { message: "Parse error: " + data.substring(0, 300) },
          });
        }
      });
    });

    apiReq.on("error", (err) => {
      console.error("Request error:", err);
      res.status(500).json({
        error: { message: "Request failed: " + err.message },
      });
    });

    apiReq.write(payload);
    apiReq.end();
  } catch (err) {
    console.error("Handler error:", err);
    res.status(500).json({
      error: { message: "Server error: " + err.message },
    });
  }
}