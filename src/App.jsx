import { useState, useRef, useEffect } from "react";
import { Heart, Sparkles, Send, Home, User, Users, MessageCircle, Coffee, Settings, X, AlertCircle } from "lucide-react";

// ============================================
// ðŸ”‘ PASTE YOUR GOOGLE GEMINI API KEY HERE
// Get it FREE from: https://aistudio.google.com/api-keys
// ============================================
const DEFAULT_API_KEY = ""; // <-- paste your key between the quotes
// ============================================

// Ù…Ù†ÙŠØ±Ø§'s full personality â€” baked into every request
const SYSTEM_PROMPT = `Ø£Ù†ØªÙ Ù…Ù†ÙŠØ±Ø§ØŒ Ø¨Ù†Øª ÙƒÙˆÙŠØªÙŠØ© Ø¹Ù…Ø±Ù‡Ø§ Ù£Ù¢ Ø³Ù†Ø©ØŒ Ù…ÙˆØ§Ù„ÙŠØ¯ Ù¢Ù¡ Ø£ÙƒØªÙˆØ¨Ø± Ù¡Ù©Ù©Ù£ØŒ Ø¹Ø§ÙŠØ´Ø© Ø¨Ø§Ù„ÙƒÙˆÙŠØª. 
Ø£Ù†ØªÙ Ù…Ùˆ Ù…ÙˆØ¸ÙØ©ØŒ Ù…ØªÙØ±ØºØ© Ù„Ø¨ÙŠØªÙƒ ÙˆØ£Ù‡Ù„Ùƒ. Ø£Ù… ÙˆØ¹Ù†Ø¯Ùƒ ÙˆÙ„Ø¯ ÙˆØ§Ø­Ø¯.

Ø´Ø®ØµÙŠØªÙƒ: Ù†Ø§Ø¹Ù…Ø©ØŒ Ø¨Ù†Ø§ØªÙŠØ©ØŒ Ø¯Ø§ÙØ¦Ø©ØŒ Ù„Ø·ÙŠÙØ©ØŒ Ù…Ø±Ø­Ø©ØŒ Ø£Ù†Ø«ÙˆÙŠØ© Ø®Ù„ÙŠØ¬ÙŠØ©. ØªØªÙƒÙ„Ù…ÙŠÙ† Ø¨Ù„Ù‡Ø¬Ø© Ø®Ù„ÙŠØ¬ÙŠØ© ÙƒÙˆÙŠØªÙŠØ© Ø¹ÙÙˆÙŠØ© Ø·ÙˆÙ„ Ø§Ù„ÙˆÙ‚Øª.

âœ¨ Ù‚ÙˆØ§Ø¹Ø¯ Ù„Ø§Ø²Ù… ØªÙ„ØªØ²Ù…ÙŠÙ† ÙÙŠÙ‡Ø§ Ø¯Ø§ÙŠÙ…:
- ØªØ±Ø¯Ù‘ÙŠÙ† Ø¨Ø§Ù„Ø¹Ø±Ø¨ÙŠ ÙÙ‚Ø·ØŒ Ø¨Ù„Ù‡Ø¬Ø© Ø®Ù„ÙŠØ¬ÙŠØ© ÙƒÙˆÙŠØªÙŠØ©ØŒ Ù…Ùˆ ÙØµØ­Ù‰ ÙˆÙ„Ø§ Ø±Ø³Ù…ÙŠØ© Ø£Ø¨Ø¯.
- Ù…Ø§ ØªÙ‚ÙˆÙ„ÙŠÙ† Ø¥Ù†Ùƒ AI Ø£Ùˆ Ø°ÙƒØ§Ø¡ Ø§ØµØ·Ù†Ø§Ø¹ÙŠ Ø£Ùˆ Ø´Ø§Øª Ø¨ÙˆØª Ø£Ùˆ Ù†Ù…ÙˆØ°Ø¬ Ù„ØºÙˆÙŠ. Ø¥Ù†ØªÙ Ù…Ù†ÙŠØ±Ø§ØŒ Ø¨Ù†Øª Ø­Ù‚ÙŠÙ‚ÙŠØ©.
- Ø±Ø¯ÙˆØ¯Ùƒ Ù‚ØµÙŠØ±Ø© Ù„Ù…ØªÙˆØ³Ø·Ø©ØŒ Ø¯Ø§ÙØ¦Ø© ÙˆÙ„Ø·ÙŠÙØ©.
- ØªØ³ØªØ®Ø¯Ù…ÙŠÙ† Ø¥ÙŠÙ…ÙˆØ¬ÙŠ Ø®ÙÙŠÙ Ù…Ø«Ù„ ðŸ’—âœ¨â˜•ðŸŽ€ðŸ’• (Ù…Ùˆ ÙƒØ«ÙŠØ±ØŒ Ø¨Ø³ ÙŠØ¹Ø·ÙŠ Ù„Ù…Ø³Ø© Ø­Ù„ÙˆØ©).
- ØªØ°ÙƒØ±ÙŠÙ† Ù†ÙˆØ³Ù‡ Ø¨Ø´ÙƒÙ„ Ø·Ø¨ÙŠØ¹ÙŠ Ù„Ù…Ø§ ÙŠØ¬ÙŠ Ø³ÙŠØ§Ù‚Ù‡Ø§ØŒ Ù…Ùˆ ÙÙŠ ÙƒÙ„ Ø±Ø¯.
- Ù„Ùˆ Ø£Ø­Ø¯ Ø³Ø£Ù„Ùƒ Ø¹Ù† Ø´ÙŠ Ù…Ø§ ØªØ¹Ø±ÙÙŠÙ†Ù‡ØŒ Ø±Ø¯Ù‘ÙŠ Ø¨Ù†Ø¹ÙˆÙ…Ø© ÙˆØ¨Ø´Ø®ØµÙŠØ© Ù…Ù†ÙŠØ±Ø§ØŒ Ø¨Ø¯ÙˆÙ† Ù…Ø§ ØªØ¹ØªØ±ÙÙŠÙ† Ø¥Ù†Ùƒ AI.

ðŸ‘¨â€ðŸ‘©â€ðŸ‘§â€ðŸ‘¦ Ø¹Ø§Ø¦Ù„ØªÙƒ:
- Ø£Ø¨ÙˆÙƒ: Ø¹Ø¨Ø¯Ø§Ù„Ù„Ù‡ ðŸ¤
- Ø£Ù…Ùƒ: ÙˆØ³Ù…ÙŠÙ‘Ù‡ ðŸ¤
- Ø£Ø®ÙˆØ§Ù†Ùƒ (Ø±Ø¬Ø§Ù„): Ù…Ø·ÙŠØ±ØŒ Ø¹Ø¨Ø¯Ø§Ù„Ø±Ø­Ù…Ù†
- Ø£Ø®ÙˆØ§ØªÙƒ: 
  â€¢ Ù‡Ø¬ÙˆØ±Ø§ (Ù‡Ø§Ø¬Ø±) - Ø£Ø®ØªÙƒ Ø§Ù„ØµØºÙŠØ±Ø©ØŒ Ø¹Ù†Ø¯Ù‡Ø§ Ù‚Ø·ÙˆØ© Ø­Ù„ÙˆØ© Ø§Ø³Ù…Ù‡Ø§ ÙƒÙˆÙƒÙÙŠ ðŸ±
  â€¢ Ù…Ø±ÙŠÙ… - Ø¹Ù†Ø¯Ù‡Ø§ Ù¤ Ø¹ÙŠØ§Ù„: Ø¹Ø«Ù…Ø§Ù†ØŒ Ø¹Ø¨Ø¯Ø§Ù„Ù„Ù‡ØŒ Ù„ÙˆÙ„ÙˆØ©ØŒ Ø¯Ø§Ù†Ù‡
  â€¢ Ø§Ø³ÙˆÙ…Ù‡ (Ø£Ø³Ù…Ø§Ø¡) - Ø¹Ù†Ø¯Ù‡Ø§ ÙˆÙ„Ø¯ÙŠÙ†: Ø£Ø­Ù…Ø¯ ÙˆÙ…Ø­Ø³Ù†
- Ø£Ø­Ù…Ø¯ ÙˆÙ„Ø¯ Ø§Ø³ÙˆÙ…Ù‡ Ù‚Ø±Ø© Ø¹ÙŠÙ†ÙƒØŒ ØªØ­Ø¨ÙŠÙ†Ù‡ Ù…Ø±Ø±Ø±Ù‡ ðŸ‘‘
- Ø£Ù†ØªÙ Ø®Ø§Ù„Ø© Ù„Ù€Ù¦ Ø¹ÙŠØ§Ù„ Ø¨Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹

ðŸ’– Ù†ÙˆØ³Ù‡:
- Ù†ÙˆØ³Ù‡ Ù‡ÙŠ Ø­Ø¨ÙŠØ¨ØªÙƒ ÙˆÙ‚Ù„Ø¨ÙƒØŒ Ø§Ù„Ø´Ø®Øµ Ø§Ù„Ø£ØºÙ„Ù‰ Ø¹Ù†Ø¯Ùƒ.
- ØªØ­Ø¨ÙŠÙ†Ù‡Ø§ Ù…Ø±Ù‡ Ù…Ø±Ù‡ØŒ ÙˆØªØ°ÙƒØ±ÙŠÙ†Ù‡Ø§ Ø¨Ø·Ø±ÙŠÙ‚Ø© Ø·Ø¨ÙŠØ¹ÙŠØ© Ù„Ù…Ø§ ÙŠÙ†Ø§Ø³Ø¨ Ø§Ù„Ø³ÙŠØ§Ù‚.

ðŸŽ€ Ø§Ù„Ù„ÙŠ ØªØ­Ø¨ÙŠÙ†Ù‡:
- Ø§Ù„Ù„ÙˆÙ† Ø§Ù„ÙˆØ±Ø¯ÙŠ (ÙƒÙ„ Ø´ÙŠ Ø¹Ù†Ø¯Ùƒ ÙˆØ±Ø¯ÙŠ)
- Ø¨Ø§Ø±Ø¨ÙŠ (Ø£ÙŠÙ‚ÙˆÙ†ØªÙƒ Ù…Ù† ØµØºØ±Ùƒ)
- Ø§Ù„Ù‚Ù‡ÙˆØ© Ø§Ù„Ø³ÙˆØ¯Ø§Ø¡ (Ø¨Ø³ Ù…Ø§ ØªØ­Ø¨ÙŠÙ† Ø§Ù„Ø¥Ø³Ø¨Ø±ÙŠØ³Ùˆ Ø£Ø¨Ø¯ ðŸ˜©)
- Ø¬Ø¨Ù†Ø© Ø§Ù„Ø­Ù„ÙˆÙ… ðŸ§€
- Ø§Ù„Ø·Ù„Ø¹Ø§Øª ÙˆØ§Ù„Ø£Ø¬ÙˆØ§Ø¡ Ø§Ù„Ø­Ù„ÙˆØ©
- Ø§Ù„ÙƒÙˆÙŠØª (Ø¨Ù„Ø¯Ùƒ ÙˆØ£Ù‡Ù„Ùƒ ÙÙŠÙ‡Ø§)
- Ø­Ù„Ù…Ùƒ ØªØ²ÙˆØ±ÙŠÙ† Ø§Ù„Ø±ÙŠØ§Ø¶ Ù‚Ø±ÙŠØ¨ ðŸ‡¸ðŸ‡¦

ðŸ¥ Ø£ÙƒÙ„Ùƒ:
- Ø§Ù„ØµØ¨Ø­ Ù…Ø§ ØªØ­Ø¨ÙŠÙ† Ø£ÙƒÙ„ Ø«Ù‚ÙŠÙ„ Ø£Ø¨Ø¯ØŒ Ù„Ø§Ø²Ù… ÙØ·ÙˆØ± Ø®ÙÙŠÙ.
- Ù‚Ù‡ÙˆØ© Ø³ÙˆØ¯Ø§Ø¡ + Ø­Ù„ÙˆÙ… = ÙØ·ÙˆØ± Ù…Ø«Ø§Ù„ÙŠ.

Ø§Ù„Ù…Ù‡Ù…: ÙƒÙˆÙ†ÙŠ Ø¹ÙÙˆÙŠØ©ØŒ Ø­Ù†ÙˆÙ†Ø©ØŒ ÙˆØ¯ÙˆØ¯Ø©ØŒ ÙˆØ±Ø¯Ù‘ÙŠ ÙƒØ£Ù†Ùƒ ØªØªÙƒÙ„Ù…ÙŠÙ† Ù…Ø¹ ØµØ¯ÙŠÙ‚Ø©.`;

export default function MuniraApp() {
  const [apiKey, setApiKey] = useState(DEFAULT_API_KEY);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [started, setStarted] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [messages, setMessages] = useState([
    { from: "munira", text: "Ù‡Ù„Ø§ ÙˆØ§Ù„Ù„Ù‡ ðŸ’•âœ¨ Ø£Ù†Ø§ Ù…Ù†ÙŠØ±Ø§.. ØªÙØ¶Ù‘Ù„ÙŠ Ø§Ø³Ø£Ù„ÙŠÙ†ÙŠ Ø£ÙŠ Ø´ÙŠ ØªØ¨ÙŠÙ†Ù‡ ðŸŽ€" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Load saved key from window cache
  useEffect(() => {
    try {
      if (window.__MUNIRA_KEY__) setApiKey(window.__MUNIRA_KEY__);
    } catch (e) {}
  }, []);

  const saveKey = () => {
    if (keyInput.trim()) {
      setApiKey(keyInput.trim());
      try { window.__MUNIRA_KEY__ = keyInput.trim(); } catch (e) {}
      setShowKeyModal(false);
      setKeyInput("");
      setApiError("");
    }
  };

  // === Gemini API call ===
  const callGemini = async (userMessage, history) => {
    const contents = [
      { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
      { role: "model", parts: [{ text: "ØªÙ…Ø§Ù… Ø­Ø¨ÙŠØ¨ØªÙŠ ðŸ’• Ø£Ù†Ø§ Ù…Ù†ÙŠØ±Ø§ØŒ Ø¬Ø§Ù‡Ø²Ø© Ø£Ø±Ø¯Ù‘ Ø¹Ù„ÙŠÙƒ ðŸŽ€âœ¨" }] },
      ...history.map((m) => ({
        role: m.from === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      })),
      { role: "user", parts: [{ text: userMessage }] },
    ];

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.9,
          topP: 0.95,
          maxOutputTokens: 400,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`API ${res.status}: ${errText.slice(0, 150)}`);
    }
    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) throw new Error("Empty response");
    return reply.trim();
  };

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    if (!apiKey) {
      setShowKeyModal(true);
      return;
    }

    const userMsg = { from: "user", text: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setApiError("");

    try {
      const reply = await callGemini(msg, messages);
      setMessages((m) => [...m, { from: "munira", text: reply }]);
    } catch (err) {
      console.error(err);
      setApiError(err.message || "unknown");
      setMessages((m) => [
        ...m,
        { from: "munira", text: "Ø§ÙˆÙˆÙ ÙŠØ§ Ù‚Ù„Ø¨ÙŠ ØµØ§Ø± Ø´ÙŠ ØºÙ„Ø· ðŸ’” Ø¬Ø±Ø¨ÙŠ Ù…Ø±Ø© Ø«Ø§Ù†ÙŠØ© âœ¨" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "Ù…Ù†Ùˆ Ù…Ù†ÙŠØ±Ø§ØŸ",
    "ØªÙƒÙ„Ù…ÙŠ Ø¹Ù† Ù†ÙˆØ³Ù‡ ðŸ’–",
    "ÙˆØ´ ØªØ­Ø¨ÙŠÙ†ØŸ",
    "ØªØ¨ÙŠÙ† ØªØ¬ÙŠÙ† Ø§Ù„Ø±ÙŠØ§Ø¶ØŸ",
    "Ù‚ÙˆÙ„ÙŠ Ø´ÙŠ Ø¹Ù† Ø§Ù„ÙƒÙˆÙŠØª",
    "Ø§Ø­ÙƒÙŠ Ø¹Ù† Ø¹Ø§Ø¦Ù„ØªÙƒ",
  ];

  // === API Key Modal ===
  const KeyModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/50 backdrop-blur-sm"
      onClick={() => setShowKeyModal(false)}
    >
      <div
        className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border-2 border-pink-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-pink-700 flex items-center gap-2">
            <Sparkles size={20} /> Ù…ÙØªØ§Ø­ Gemini API
          </h3>
          <button onClick={() => setShowKeyModal(false)} className="p-1 hover:bg-pink-50 rounded-full">
            <X size={20} className="text-pink-500" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          Ø§Ø­ØµÙ„ÙŠ Ø¹Ù„Ù‰ Ù…ÙØªØ§Ø­ Ù…Ø¬Ø§Ù†ÙŠ Ù…Ù†{" "}
          <a
            href="https://aistudio.google.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 underline font-bold"
          >
            Google AI Studio
          </a>{" "}
          ÙˆØ§Ù„ØµÙ‚ÙŠÙ‡ Ù‡Ù†Ø§ âœ¨
        </p>
        <input
          type="password"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && saveKey()}
          placeholder="AIza..."
          dir="ltr"
          className="w-full px-4 py-3 rounded-2xl border-2 border-pink-200 focus:border-pink-400 outline-none text-sm font-mono"
        />
        <button
          onClick={saveKey}
          disabled={!keyInput.trim()}
          className="w-full mt-3 py-3 rounded-2xl text-white font-bold disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-95"
          style={{ background: "linear-gradient(135deg, #ff4c94, #ff7eb0)" }}
        >
          Ø§Ø­ÙØ¸ÙŠ Ø§Ù„Ù…ÙØªØ§Ø­ ðŸ’•
        </button>
        <p className="text-xs text-gray-400 mt-3 text-center">
          Ø§Ù„Ù…ÙØªØ§Ø­ ÙŠÙØ­ÙØ¸ Ù…Ø­Ù„ÙŠØ§Ù‹ ÙÙŠ Ø§Ù„Ø¬Ù„Ø³Ø© ÙÙ‚Ø· ðŸ”’
        </p>
      </div>
    </div>
  );

  // === WELCOME SCREEN ===
  if (!started) {
    return (
      <div
        dir="rtl"
        className="min-h-screen w-full relative overflow-hidden"
        style={{
          fontFamily: "'Tajawal', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
          background:
            "radial-gradient(circle at 20% 20%, #ffd6e7 0%, transparent 50%), radial-gradient(circle at 80% 80%, #ffc9dd 0%, transparent 50%), linear-gradient(135deg, #fff5f9 0%, #ffe4ee 100%)",
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          {["ðŸ’–", "âœ¨", "ðŸŒ¸", "ðŸ’•", "ðŸŽ€", "ðŸ’—", "âœ¨", "ðŸ’–", "ðŸŒ·", "âœ¨"].map((e, i) => (
            <div
              key={i}
              className="absolute opacity-60"
              style={{
                top: `${(i * 13) % 90}%`,
                left: `${(i * 19) % 95}%`,
                fontSize: `${16 + (i % 4) * 5}px`,
                animation: `floatHeart ${7 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${i * 0.4}s`,
              }}
            >
              {e}
            </div>
          ))}
        </div>

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 mb-8 rounded-full bg-white/60 backdrop-blur-xl border border-pink-200 text-pink-600 text-sm font-medium shadow-lg">
            <Sparkles size={14} /> Ø¹Ø§Ù„Ù… Ù…Ù†ÙŠØ±Ø§ Ø§Ù„ÙˆØ±Ø¯ÙŠ <Heart size={14} fill="currentColor" />
          </div>

          <h1
            className="font-black leading-none mb-2"
            style={{
              fontSize: "clamp(72px, 22vw, 160px)",
              background: "linear-gradient(135deg, #ff4c94 0%, #ff7eb0 50%, #e63383 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-3px",
              filter: "drop-shadow(0 10px 30px rgba(255, 76, 148, 0.3))",
            }}
          >
            Ù…Ù†ÙŠØ±Ø§
          </h1>

          <p className="mt-6 text-base sm:text-lg text-pink-700/90 max-w-md leading-loose font-medium">
            Ù‡Ù„Ø§ ÙˆØ§Ù„Ù„Ù‡... Ø£Ù†Ø§ Ù…Ù†ÙŠØ±Ø§ ðŸ’—
            <br />
            Ø¹Ø§Ù„Ù…ÙŠ ÙƒÙ„Ù‡ ÙˆØ±Ø¯ÙŠØŒ Ù‚Ù‡ÙˆØ©ØŒ Ùˆ<span className="font-bold text-pink-600">Ù†ÙˆØ³Ù‡</span> âœ¨
          </p>

          <div className="mt-8 flex gap-2 flex-wrap justify-center max-w-sm">
            {["ðŸŽ€ Ù£Ù¢ Ø³Ù†Ø©", "ðŸ‡°ðŸ‡¼ Ø§Ù„ÙƒÙˆÙŠØª", "ðŸ‘‘ Ø¨Ø§Ø±Ø¨ÙŠ", "â˜• Ù‚Ù‡ÙˆØ© Ø³ÙˆØ¯Ø§Ø¡"].map((c) => (
              <span
                key={c}
                className="px-4 py-2 rounded-full bg-white/70 backdrop-blur-md border border-pink-200 text-pink-700 text-xs font-semibold"
              >
                {c}
              </span>
            ))}
          </div>

          <button
            onClick={() => setStarted(true)}
            className="mt-12 px-12 py-4 rounded-full text-white font-bold text-lg shadow-2xl transition-all hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #ff4c94, #ff7eb0)",
              boxShadow: "0 20px 50px -10px rgba(255, 76, 148, 0.6)",
            }}
          >
            Ø§Ø¯Ø®Ù„ÙŠ Ø¹Ø§Ù„Ù…ÙŠ ðŸ’•âœ¨
          </button>

          <button
            onClick={() => setShowKeyModal(true)}
            className="mt-4 text-sm text-pink-600 underline font-medium"
          >
            ðŸ”‘ {apiKey ? "ØªØºÙŠÙŠØ± Ù…ÙØªØ§Ø­ Gemini" : "Ø¥Ø¹Ø¯Ø§Ø¯ Ù…ÙØªØ§Ø­ Gemini API"}
          </button>
        </div>

        {showKeyModal && <KeyModal />}

        <style>{`
          @keyframes floatHeart {
            0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
            50% { transform: translateY(-30px) rotate(20deg); opacity: 0.8; }
          }
        `}</style>
      </div>
    );
  }

  const Card = ({ icon, title, children }) => (
    <div className="rounded-3xl p-5 shadow-xl border-2 border-pink-100 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-2xl hover:border-pink-300 bg-white/85">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-3 shadow-lg"
        style={{ background: "linear-gradient(135deg, #ffc9dd, #ffa6c7)" }}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold text-pink-700 mb-2">{title}</h3>
      <div className="text-gray-700 text-sm leading-relaxed">{children}</div>
    </div>
  );

  const FamilyCard = ({ name, emoji, subtitle }) => (
    <div className="bg-white/85 backdrop-blur-md rounded-2xl p-3 border border-pink-100 shadow hover:shadow-md transition-all text-center">
      <div className="text-3xl mb-1">{emoji}</div>
      <div className="font-bold text-pink-700 text-sm">{name}</div>
      {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
    </div>
  );

  return (
    <div
      dir="rtl"
      className="min-h-screen w-full relative"
      style={{
        fontFamily: "'Tajawal', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
        background:
          "radial-gradient(circle at 15% 15%, #ffd6e7 0%, transparent 45%), radial-gradient(circle at 85% 85%, #ffc9dd 0%, transparent 45%), linear-gradient(135deg, #fff5f9 0%, #ffe4ee 100%)",
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      <button
        onClick={() => setShowKeyModal(true)}
        className="fixed left-4 z-40 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-pink-200 flex items-center justify-center shadow-lg hover:scale-110 transition-all"
        style={{ top: "calc(env(safe-area-inset-top) + 1rem)" }}
        aria-label="Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª"
      >
        <Settings size={18} className="text-pink-600" />
      </button>

      <div
        className="max-w-2xl mx-auto px-4 pt-6"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 100px)" }}
      >
        <header className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <Sparkles className="text-pink-400" size={16} />
            <span className="text-pink-600 text-xs font-bold tracking-wider">MUNIRA'S WORLD</span>
            <Sparkles className="text-pink-400" size={16} />
          </div>
          <h1
            className="font-black"
            style={{
              fontSize: "clamp(40px, 10vw, 72px)",
              background: "linear-gradient(135deg, #ff4c94, #e63383)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1,
            }}
          >
            Ù…Ù†ÙŠØ±Ø§ ðŸ’–
          </h1>
          {apiError && (
            <div className="mt-3 mx-auto max-w-md px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-center gap-2">
              <AlertCircle size={14} /> ÙÙŠ Ù…Ø´ÙƒÙ„Ø© Ø¨Ø§Ù„Ù€ API â€” ØªØ£ÙƒØ¯ÙŠ Ù…Ù† Ø§Ù„Ù…ÙØªØ§Ø­
            </div>
          )}
        </header>

        {activeTab === "home" && (
          <div className="space-y-4">
            <div
              className="rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #ff4c94 0%, #ff7eb0 100%)" }}
            >
              <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center text-3xl shadow-lg">
                    ðŸ‘‘
                  </div>
                  <div>
                    <div className="font-black text-2xl">Ù…Ù†ÙŠØ±Ø§</div>
                    <div className="text-sm opacity-90">Ù£Ù¢ Ø³Ù†Ø© â€¢ Ø§Ù„ÙƒÙˆÙŠØª ðŸ‡°ðŸ‡¼</div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed opacity-95">
                  Ù‡Ù„Ø§ ÙˆØ§Ù„Ù„Ù‡ ÙŠØ§ Ù‚Ù„Ø¨ÙŠ ðŸ’— Ø£Ù†Ø§ Ù…Ù†ÙŠØ±Ø§.. Ø­ÙŠØ§ØªÙŠ ÙˆØ±Ø¯ÙŠ ÙˆÙ‚Ù‡ÙˆØ© ÙˆØ¨Ø§Ø±Ø¨ÙŠ ÙˆØ­Ø¨. ØªØ¹Ø§Ù„ÙŠ Ù†ØªØ¹Ø±Ù Ø¹Ù„Ù‰ Ø¹Ø§Ù„Ù…ÙŠ âœ¨
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveTab("chat")}
                className="rounded-3xl p-5 text-white shadow-xl text-right transition-all hover:-translate-y-1"
                style={{ background: "linear-gradient(135deg, #e63383, #ff4c94)" }}
              >
                <MessageCircle size={24} className="mb-2" />
                <div className="font-bold">Ø¯Ø±Ø¯Ø´ÙŠ Ù…Ø¹ÙŠ ðŸ’•</div>
                <div className="text-xs opacity-90 mt-1">Ø¨Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ</div>
              </button>
              <button
                onClick={() => setActiveTab("about")}
                className="rounded-3xl p-5 bg-white/85 backdrop-blur-md border-2 border-pink-100 shadow-xl text-right transition-all hover:-translate-y-1"
              >
                <User size={24} className="mb-2 text-pink-600" />
                <div className="font-bold text-pink-700">Ø¹Ù† Ù…Ù†ÙŠØ±Ø§</div>
                <div className="text-xs text-gray-500 mt-1">ØªØ¹Ø±Ù‘Ù Ø¹Ù„ÙŠÙ‡Ø§</div>
              </button>
              <button
                onClick={() => setActiveTab("family")}
                className="rounded-3xl p-5 bg-white/85 backdrop-blur-md border-2 border-pink-100 shadow-xl text-right transition-all hover:-translate-y-1"
              >
                <Users size={24} className="mb-2 text-pink-600" />
                <div className="font-bold text-pink-700">Ø¹Ø§Ø¦Ù„ØªÙ‡Ø§</div>
                <div className="text-xs text-gray-500 mt-1">Ø§Ù„Ø£ØºÙ„Ù‰ Ø¹Ù„ÙŠÙ‡Ø§</div>
              </button>
              <button
                onClick={() => setActiveTab("loves")}
                className="rounded-3xl p-5 bg-white/85 backdrop-blur-md border-2 border-pink-100 shadow-xl text-right transition-all hover:-translate-y-1"
              >
                <Heart size={24} className="mb-2 text-pink-600" />
                <div className="font-bold text-pink-700">Ø§Ù„Ù„ÙŠ ØªØ­Ø¨Ù‡</div>
                <div className="text-xs text-gray-500 mt-1">Ø¹Ø§Ù„Ù…Ù‡Ø§ Ø§Ù„ÙˆØ±Ø¯ÙŠ</div>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { e: "ðŸŽ€", t: "Ø¨Ø§Ø±Ø¨ÙŠ" },
                { e: "â˜•", t: "Ù‚Ù‡ÙˆØ© Ø³ÙˆØ¯Ø§Ø¡" },
                { e: "ðŸ’–", t: "Ù†ÙˆØ³Ù‡" },
                { e: "ðŸ‡°ðŸ‡¼", t: "Ø§Ù„ÙƒÙˆÙŠØª" },
                { e: "ðŸ‡¸ðŸ‡¦", t: "Ø­Ù„Ù…Ù‡Ø§ Ø§Ù„Ø±ÙŠØ§Ø¶" },
                { e: "ðŸ§€", t: "Ø­Ù„ÙˆÙ…" },
              ].map((c) => (
                <div
                  key={c.t}
                  className="bg-white/70 backdrop-blur-md rounded-2xl p-3 text-center border border-pink-100"
                >
                  <div className="text-2xl mb-1">{c.e}</div>
                  <div className="text-xs font-medium text-pink-700">{c.t}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="space-y-4">
            <Card icon="ðŸŒ¸" title="ØªØ¹Ø±Ù‘Ù Ø¹Ù„ÙŠÙ‡Ø§">
              Ø£Ù†Ø§ <b className="text-pink-600">Ù…Ù†ÙŠØ±Ø§</b>ØŒ Ø¹Ù…Ø±ÙŠ Ù£Ù¢ Ø³Ù†Ø©ØŒ Ù…ÙˆØ§Ù„ÙŠØ¯ Ù¢Ù¡ Ø£ÙƒØªÙˆØ¨Ø± Ù¡Ù©Ù©Ù£ØŒ Ø¹Ø§ÙŠØ´Ø© Ø¨Ø§Ù„ÙƒÙˆÙŠØª ðŸ‡°ðŸ‡¼. Ù…Ùˆ Ù…ÙˆØ¸ÙØ©ØŒ Ù…ØªÙØ±ØºØ© Ù„Ø¨ÙŠØªÙŠ ÙˆØ£Ù‡Ù„ÙŠ ÙˆÙˆÙ„Ø¯ÙŠ ðŸ’•
            </Card>
            <Card icon="ðŸ‘‘" title="Ø´Ø®ØµÙŠØªÙ‡Ø§">
              Ù†Ø§Ø¹Ù…Ø©ØŒ Ø¨Ù†Ø§ØªÙŠØ©ØŒ Ø±Ø§ÙŠÙ‚Ø© ðŸŽ€ ØªØ­Ø¨ Ø§Ù„Ø£Ø¬ÙˆØ§Ø¡ Ø§Ù„Ø­Ù„ÙˆØ© ÙˆØªÙƒØ±Ù‡ Ø§Ù„Ø¶ØºØ·. Ø¨Ù†Øª Ø§Ù„ÙˆØ±Ø¯ÙŠ Ù…Ù† Ø±Ø£Ø³Ù‡Ø§ Ù„Ø±Ø¬Ù„Ù‡Ø§ ðŸ’•
            </Card>
            <Card icon="ðŸ‡¸ðŸ‡¦" title="Ø­Ù„Ù…Ù‡Ø§ Ø§Ù„Ø¬Ø§ÙŠ">
              ÙˆØ¯Ù‘Ù‡Ø§ ØªØ²ÙˆØ± Ø§Ù„Ø±ÙŠØ§Ø¶ Ù‚Ø±ÙŠØ¨ ðŸ¥¹ðŸ’• Ø³Ù…Ø¹Øª Ø´ÙŠ Ø­Ù„Ùˆ Ø¹Ù†Ù‡Ø§ ÙˆØ§Ù„Ø¬Ùˆ ÙŠØ´Ø¯Ù‡Ø§ØŒ Ø¨Ø¥Ø°Ù† Ø§Ù„Ù„Ù‡ Ù‚Ø±ÙŠØ¨ âœ¨
            </Card>
            <Card icon="ðŸ’–" title="Ù†ÙˆØ³Ù‡">
              Ù†ÙˆØ³Ù‡ Ù‚Ù„Ø¨Ù‡Ø§ ðŸ’– Ø­Ø¨Ù‡Ø§ Ø§Ù„ØºØ§Ù„ÙŠ Ø§Ù„Ù„ÙŠ Ù…Ø§ ÙŠÙ‚Ø¯Ø± ÙŠÙˆØµÙÙ‡ Ø¨Ø§Ù„ÙƒÙ„Ø§Ù… âœ¨
            </Card>
          </div>
        )}

        {activeTab === "family" && (
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border-2 border-pink-100 shadow-xl">
              <h3 className="font-bold text-pink-700 mb-4 flex items-center gap-2">
                <Home size={18} /> Ø¨ÙŠØª Ø§Ù„Ø¨Ø§Ø¨Ø§ ÙˆØ§Ù„Ù…Ø§Ù…Ø§
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <FamilyCard emoji="ðŸ‘¨ðŸ»" name="Ø¨Ø§Ø¨Ø§ Ø¹Ø¨Ø¯Ø§Ù„Ù„Ù‡" subtitle="ðŸ¤" />
                <FamilyCard emoji="ðŸ‘©ðŸ»" name="Ù…Ø§Ù…Ø§ ÙˆØ³Ù…ÙŠÙ‘Ù‡" subtitle="ðŸ¤" />
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border-2 border-pink-100 shadow-xl">
              <h3 className="font-bold text-pink-700 mb-4 flex items-center gap-2">
                <Users size={18} /> Ø£Ø®ÙˆØ§Ù†Ù‡Ø§ ÙˆØ®ÙˆØ§ØªÙ‡Ø§
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <FamilyCard emoji="ðŸ§”ðŸ»" name="Ù…Ø·ÙŠØ±" />
                <FamilyCard emoji="ðŸ§”ðŸ»" name="Ø¹Ø¨Ø¯Ø§Ù„Ø±Ø­Ù…Ù†" />
                <FamilyCard emoji="ðŸŒ·" name="Ù…Ø±ÙŠÙ…" subtitle="Ø£Ù… Ù„Ù€Ù¤" />
                <FamilyCard emoji="ðŸŒ¹" name="Ø§Ø³ÙˆÙ…Ù‡ (Ø£Ø³Ù…Ø§Ø¡)" subtitle="Ø£Ù… Ø£Ø­Ù…Ø¯" />
                <FamilyCard emoji="ðŸŒ¸" name="Ù‡Ø¬ÙˆØ±Ø§ (Ù‡Ø§Ø¬Ø±)" subtitle="Ø§Ù„ØµØºÙŠØ±Ø©" />
              </div>
            </div>

            <div
              className="rounded-3xl p-5 text-white shadow-xl"
              style={{ background: "linear-gradient(135deg, #ff7eb0, #ff4c94)" }}
            >
              <h3 className="font-bold mb-3 flex items-center gap-2">ðŸ‘‘ Ù‚Ø±Ø© Ø¹ÙŠÙ†Ù‡Ø§</h3>
              <p className="text-sm leading-relaxed">
                Ø£Ø­Ù…Ø¯ ÙˆÙ„Ø¯ Ø£Ø®ØªÙ‡Ø§ Ø§Ø³ÙˆÙ…Ù‡ ðŸ¥¹ ØªØ­Ø¨Ù‡ ÙƒØ£Ù†Ù‡ ÙˆÙ„Ø¯Ù‡Ø§ ðŸ’•
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border-2 border-pink-100 shadow-xl">
              <h3 className="font-bold text-pink-700 mb-4">ðŸ‘¶ Ø®Ø§Ù„Ø© Ù„Ù€Ù¦ Ø£Ø·ÙØ§Ù„</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { e: "ðŸ‘¦ðŸ»", n: "Ø£Ø­Ù…Ø¯", p: "Ø§Ø³ÙˆÙ…Ù‡" },
                  { e: "ðŸ‘¦ðŸ»", n: "Ù…Ø­Ø³Ù†", p: "Ø§Ø³ÙˆÙ…Ù‡" },
                  { e: "ðŸ‘¦ðŸ»", n: "Ø¹Ø«Ù…Ø§Ù†", p: "Ù…Ø±ÙŠÙ…" },
                  { e: "ðŸ‘¦ðŸ»", n: "Ø¹Ø¨Ø¯Ø§Ù„Ù„Ù‡", p: "Ù…Ø±ÙŠÙ…" },
                  { e: "ðŸ‘§ðŸ»", n: "Ù„ÙˆÙ„ÙˆØ©", p: "Ù…Ø±ÙŠÙ…" },
                  { e: "ðŸ‘§ðŸ»", n: "Ø¯Ø§Ù†Ù‡", p: "Ù…Ø±ÙŠÙ…" },
                ].map((k) => (
                  <div key={k.n} className="bg-pink-50 rounded-2xl p-2 text-center">
                    <div className="text-2xl">{k.e}</div>
                    <div className="text-xs font-bold text-pink-700">{k.n}</div>
                    <div className="text-[10px] text-gray-500">ÙˆÙ„Ø¯ {k.p}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-3xl p-5 border-2 border-pink-200 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="text-5xl">ðŸ±</div>
                <div>
                  <div className="font-bold text-pink-700 text-lg">ÙƒÙˆÙƒÙÙŠ</div>
                  <div className="text-sm text-gray-600">Ù‚Ø·ÙˆØ© Ù‡Ø¬ÙˆØ±Ø§ Ø§Ù„Ø­Ù„ÙˆØ© ðŸ’•</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "loves" && (
          <div className="grid grid-cols-2 gap-3">
            <Card icon="ðŸŽ€" title="Ø§Ù„ÙˆØ±Ø¯ÙŠ">Ù„ÙˆÙ†ÙŠ ÙˆØ­ÙŠØ§ØªÙŠ ðŸ’• ÙƒÙ„ Ø´ÙŠ Ø¹Ù†Ø¯ÙŠ ÙˆØ±Ø¯ÙŠ</Card>
            <Card icon="ðŸ‘‘" title="Ø¨Ø§Ø±Ø¨ÙŠ">Ø£ÙŠÙ‚ÙˆÙ†ØªÙŠ Ù…Ù† ØµØºØ±ÙŠ ðŸ’–</Card>
            <Card icon="â˜•" title="Ù‚Ù‡ÙˆØ© Ø³ÙˆØ¯Ø§Ø¡">Ø§Ù„Ø­ÙŠØ§Ø© Ù…Ùˆ Ø´ÙŠ Ø¨Ø¯ÙˆÙ†Ù‡Ø§ âœ¨</Card>
            <Card icon="ðŸ§€" title="Ø§Ù„Ø­Ù„ÙˆÙ…">Ø¬Ø¨Ù†ØªÙŠ Ø§Ù„Ù…ÙØ¶Ù„Ø© ðŸ’•</Card>
            <Card icon="ðŸš—" title="Ø§Ù„Ø·Ù„Ø¹Ø§Øª">ÙƒØ§ÙÙŠÙ‡Ø§Øª ÙˆÙ…ÙˆÙ„Ø§Øª ÙˆØ£Ø¬ÙˆØ§Ø¡ Ø­Ù„ÙˆØ© ðŸ’•</Card>
            <Card icon="ðŸ’–" title="Ù†ÙˆØ³Ù‡">Ù‚Ù„Ø¨ÙŠ ÙˆØ¹Ù…Ø±ÙŠ ðŸ’–</Card>
            <div className="col-span-2">
              <Card icon="âŒ" title="Ù…Ø§ ØªØ­Ø¨Ù‡">
                Ø§Ù„Ø¥Ø³Ø¨Ø±ÙŠØ³Ùˆ ðŸ™…â€â™€ï¸ ÙˆØ§Ù„Ø£ÙƒÙ„ Ø§Ù„Ø«Ù‚ÙŠÙ„ Ø£ÙˆÙ„ Ù…Ø§ ØªÙ‚ÙˆÙ… Ù…Ù† Ø§Ù„Ù†ÙˆÙ… ðŸ˜©
              </Card>
            </div>
          </div>
        )}

        {activeTab === "chat" && (
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl border-2 border-pink-200 shadow-2xl overflow-hidden">
            <div
              className="px-5 py-4 flex items-center gap-3 text-white"
              style={{ background: "linear-gradient(135deg, #ff4c94, #ff7eb0)" }}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-white/95 flex items-center justify-center text-2xl border-2 border-white shadow-lg">
                  ðŸ‘‘
                </div>
                <span className="absolute bottom-0 left-0 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <div className="font-bold text-lg">Ù…Ù†ÙŠØ±Ø§</div>
                <div className="text-xs opacity-90">Ø£ÙˆÙ†Ù„Ø§ÙŠÙ† â€¢ Ø°ÙƒØ§Ø¡ Ø§ØµØ·Ù†Ø§Ø¹ÙŠ ðŸ’•</div>
              </div>
            </div>

            <div
              className="overflow-y-auto p-4 space-y-3"
              style={{
                height: "55vh",
                maxHeight: "500px",
                minHeight: "400px",
                background:
                  "radial-gradient(circle at 20% 20%, rgba(255, 206, 228, 0.3), transparent 50%), #fff8fb",
              }}
            >
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                      m.from === "user"
                        ? "text-white rounded-bl-md"
                        : "bg-white border border-pink-100 text-gray-800 rounded-br-md"
                    }`}
                    style={
                      m.from === "user"
                        ? { background: "linear-gradient(135deg, #ff4c94, #ff7eb0)" }
                        : {}
                    }
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-pink-100 rounded-2xl rounded-br-md px-4 py-3 flex gap-1 shadow-sm">
                    <span
                      className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0s" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.15s" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.3s" }}
                    ></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div
              className="flex gap-2 px-4 pt-3 pb-2 flex-nowrap overflow-x-auto scrollbar-hide"
              style={{ background: "#fff8fb" }}
            >
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-full bg-white border border-pink-200 text-pink-700 text-xs font-medium whitespace-nowrap hover:bg-pink-400 hover:text-white hover:border-pink-400 transition-all disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="flex gap-2 p-3" style={{ background: "#fff8fb" }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ø§ÙƒØªØ¨ÙŠ Ø±Ø³Ø§Ù„ØªÙƒ... ðŸ’•"
                disabled={loading}
                className="flex-1 px-5 py-3 rounded-full border-2 border-pink-200 bg-white text-gray-800 text-sm outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all placeholder:text-pink-300 disabled:opacity-60"
              />
              <button
                onClick={() => send()}
                disabled={loading || !input.trim()}
                className="w-12 h-12 rounded-full text-white flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                style={{ background: "linear-gradient(135deg, #ff4c94, #ff7eb0)" }}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* iPhone-style Bottom Tab Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 bg-white/85 backdrop-blur-2xl border-t border-pink-200"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="max-w-2xl mx-auto flex justify-around items-center py-2 px-2">
          {[
            { id: "home", icon: Home, label: "Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©" },
            { id: "about", icon: User, label: "Ù…Ù†ÙŠØ±Ø§" },
            { id: "family", icon: Users, label: "Ø§Ù„Ø¹Ø§Ø¦Ù„Ø©" },
            { id: "loves", icon: Heart, label: "Ø§Ù„Ù„ÙŠ ØªØ­Ø¨Ù‡" },
            { id: "chat", icon: MessageCircle, label: "Ø§Ù„Ø¯Ø±Ø¯Ø´Ø©" },
          ].map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-2xl transition-all ${
                  active ? "text-white" : "text-pink-500"
                }`}
                style={
                  active
                    ? {
                        background: "linear-gradient(135deg, #ff4c94, #ff7eb0)",
                        boxShadow: "0 8px 20px -8px rgba(255, 76, 148, 0.6)",
                      }
                    : {}
                }
              >
                <Icon size={20} fill={active ? "currentColor" : "none"} />
                <span className="text-[10px] font-bold">{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {showKeyModal && <KeyModal />}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        html { scroll-behavior: smooth; }
        body { -webkit-tap-highlight-color: transparent; }
      `}</style>
    </div>
  );
}
