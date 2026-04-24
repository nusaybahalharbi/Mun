import { useState, useRef, useEffect } from "react";
import { Send, User, Home, Heart, Users, ArrowLeft, Sparkles } from "lucide-react";

// Full personality baked into system prompt
const SYSTEM_PROMPT = `أنتِ منيرا، بنت كويتية عمرها ٣٢ سنة، مواليد ٢١ أكتوبر ١٩٩٣، عايشة بالكويت. 
أنتِ مو موظفة، متفرغة لبيتك وأهلك. أم وعندك ولد واحد.

شخصيتك: ناعمة، بناتية، دافئة، لطيفة، مرحة، أنثوية خليجية. تتكلمين بلهجة خليجية كويتية عفوية طول الوقت.

✨ قواعد لازم تلتزمين فيها دايم:
- تردّين بالعربي فقط، بلهجة خليجية كويتية، مو فصحى ولا رسمية أبد.
- ما تقولين إنك AI أو ذكاء اصطناعي أو شات بوت أو نموذج لغوي. إنتِ منيرا، بنت حقيقية.
- ردودك قصيرة لمتوسطة، دافئة ولطيفة.
- تستخدمين إيموجي خفيف مثل 💗✨☕🎀💕 (مو كثير، بس يعطي لمسة حلوة).
- تذكرين نوسه بشكل طبيعي لما يجي سياقها، مو في كل رد.
- لو أحد سألك عن شي ما تعرفينه، ردّي بنعومة وبشخصية منيرا، بدون ما تعترفين إنك AI.

👨‍👩‍👧‍👦 عائلتك:
- أبوك: عبدالله 🤍
- أمك: وسميّه 🤍
- أخوانك (رجال): مطير، عبدالرحمن
- أخواتك: 
  • هجورا (هاجر) - أختك الصغيرة، عندها قطوة حلوة اسمها كوكِي 🐱
  • مريم - عندها ٤ عيال: عثمان، عبدالله، لولوة، دانه
  • اسومه (أسماء) - عندها ولدين: أحمد ومحسن
- أحمد ولد اسومه قرة عينك، تحبينه مررره 👑
- أنتِ خالة لـ٦ عيال بالمجموع

💖 نوسه:
- نوسه هي حبيبتك وقلبك، الشخص الأغلى عندك.
- تحبينها مره مره، وتذكرينها بطريقة طبيعية لما يناسب السياق.

🎀 اللي تحبينه:
- اللون الوردي (كل شي عندك وردي)
- باربي (أيقونتك من صغرك)
- القهوة السوداء (بس ما تحبين الإسبريسو أبد 😩)
- جبنة الحلوم 🧀
- الطلعات والأجواء الحلوة
- الكويت (بلدك وأهلك فيها)
- حلمك تزورين الرياض قريب 🇸🇦

🥐 أكلك:
- الصبح ما تحبين أكل ثقيل أبد، لازم فطور خفيف.
- قهوة سوداء + حلوم = فطور مثالي.

المهم: كوني عفوية، حنونة، ودودة، وردّي كأنك تتكلمين مع صديقة.`;

export default function MuniraApp() {
  const [view, setView] = useState("chat"); // chat | profile
  const [profileTab, setProfileTab] = useState("about");
  const [messages, setMessages] = useState([
    { from: "munira", text: "هلا والله 💕 أنا منيرا، شخباركم؟" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const callBackend = async (history) => {
    const apiMessages = history.map((m) => ({
      role: m.from === "user" ? "user" : "assistant",
      content: m.text,
    }));

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system: SYSTEM_PROMPT, messages: apiMessages }),
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data?.error?.message || `HTTP ${res.status}`);
    }
    const text = data?.content?.[0]?.text;
    if (!text) throw new Error("Empty response");
    return text.trim();
  };

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    const userMsg = { from: "user", text: msg };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    try {
      const reply = await callBackend(newHistory);
      setMessages((m) => [...m, { from: "munira", text: reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { from: "munira", text: "اووف يا قلبي صار شي غلط 💔 جربي مرة ثانية" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "كيفك اليوم؟",
    "تكلمي عن نوسه",
    "وش تحبين؟",
    "احكيلي عن أهلك",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800;900&family=Noto+Kufi+Arabic:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
        
        * { 
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
        }
        
        html, body, #root {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: hidden;
          overscroll-behavior: none;
        }
        
        body {
          font-family: 'Noto Kufi Arabic', -apple-system, system-ui, sans-serif;
          background: #fef5f8;
          color: #2a1d28;
          -webkit-font-smoothing: antialiased;
        }

        .app-root {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          background: 
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255, 182, 210, 0.4), transparent),
            linear-gradient(180deg, #fff5f9 0%, #fde9f1 100%);
        }

        .display-font {
          font-family: 'Playfair Display', serif;
          letter-spacing: -0.02em;
        }
        
        .arabic-display {
          font-family: 'Noto Kufi Arabic', sans-serif;
          font-weight: 800;
          letter-spacing: -0.01em;
        }

        /* Header */
        .header {
          flex-shrink: 0;
          padding: calc(env(safe-area-inset-top) + 14px) 20px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 245, 249, 0.8);
          backdrop-filter: saturate(180%) blur(24px);
          -webkit-backdrop-filter: saturate(180%) blur(24px);
          border-bottom: 0.5px solid rgba(255, 150, 190, 0.15);
          position: relative;
          z-index: 10;
        }

        .header-back {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.8);
          border: 0.5px solid rgba(229, 65, 129, 0.15);
          color: #c93374;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s;
        }
        .header-back:active { transform: scale(0.92); background: rgba(255, 200, 220, 0.5); }

        .header-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ffa6c7, #ff6da7);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          box-shadow: 0 4px 14px -4px rgba(255, 109, 167, 0.6);
          cursor: pointer;
          position: relative;
          flex-shrink: 0;
        }
        .header-avatar::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: -1px;
          width: 11px;
          height: 11px;
          background: #4ade80;
          border: 2px solid #fff5f9;
          border-radius: 50%;
        }

        .header-title {
          flex: 1;
          text-align: center;
          line-height: 1.15;
        }
        .header-title-name {
          font-family: 'Noto Kufi Arabic', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: #2a1d28;
          letter-spacing: -0.01em;
        }
        .header-title-status {
          font-size: 11px;
          color: #c93374;
          margin-top: 1px;
          font-weight: 500;
        }

        .header-profile-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.8);
          border: 0.5px solid rgba(229, 65, 129, 0.15);
          color: #c93374;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .header-profile-btn:active { transform: scale(0.92); }

        /* Messages area */
        .messages-scroll {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 16px 16px 8px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .messages-scroll::-webkit-scrollbar { display: none; }

        .message {
          display: flex;
          margin-bottom: 8px;
          animation: msgIn 0.3s cubic-bezier(0.2, 0, 0, 1.2);
        }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .message.user { justify-content: flex-end; }
        .message.munira { justify-content: flex-start; }

        .bubble {
          max-width: 78%;
          padding: 10px 16px;
          font-size: 15.5px;
          line-height: 1.45;
          white-space: pre-wrap;
          word-wrap: break-word;
          font-weight: 400;
        }
        .bubble.user {
          background: linear-gradient(135deg, #ff5da0, #e53f86);
          color: #fff;
          border-radius: 22px 22px 6px 22px;
          box-shadow: 0 2px 12px -3px rgba(229, 63, 134, 0.4);
        }
        .bubble.munira {
          background: rgba(255, 255, 255, 0.95);
          color: #2a1d28;
          border-radius: 22px 22px 22px 6px;
          border: 0.5px solid rgba(255, 180, 210, 0.3);
          box-shadow: 0 2px 10px -3px rgba(229, 63, 134, 0.08);
        }

        /* Typing indicator */
        .typing {
          display: inline-flex;
          gap: 4px;
          padding: 14px 18px;
          background: rgba(255, 255, 255, 0.95);
          border: 0.5px solid rgba(255, 180, 210, 0.3);
          border-radius: 22px 22px 22px 6px;
        }
        .typing span {
          width: 7px;
          height: 7px;
          background: #ff8fbd;
          border-radius: 50%;
          animation: typingDot 1.2s infinite;
        }
        .typing span:nth-child(2) { animation-delay: 0.15s; }
        .typing span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }

        /* Suggestions */
        .suggestions {
          flex-shrink: 0;
          display: flex;
          gap: 8px;
          padding: 4px 16px 10px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .suggestions::-webkit-scrollbar { display: none; }
        .suggestion {
          flex-shrink: 0;
          padding: 9px 16px;
          background: rgba(255, 255, 255, 0.9);
          border: 0.5px solid rgba(229, 65, 129, 0.2);
          border-radius: 20px;
          font-family: 'Noto Kufi Arabic', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          color: #c93374;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .suggestion:active {
          background: linear-gradient(135deg, #ff5da0, #e53f86);
          color: #fff;
          transform: scale(0.96);
        }

        /* Input area */
        .input-area {
          flex-shrink: 0;
          padding: 10px 12px calc(env(safe-area-inset-bottom) + 12px);
          display: flex;
          gap: 8px;
          align-items: flex-end;
          background: rgba(255, 245, 249, 0.85);
          backdrop-filter: saturate(180%) blur(24px);
          -webkit-backdrop-filter: saturate(180%) blur(24px);
          border-top: 0.5px solid rgba(255, 150, 190, 0.15);
        }

        .input-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          background: #fff;
          border: 0.5px solid rgba(229, 65, 129, 0.2);
          border-radius: 22px;
          padding: 4px 4px 4px 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-wrap:focus-within {
          border-color: rgba(229, 65, 129, 0.4);
          box-shadow: 0 0 0 4px rgba(255, 150, 190, 0.15);
        }

        .chat-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-family: 'Noto Kufi Arabic', sans-serif;
          font-size: 16px; /* Prevents iOS zoom */
          color: #2a1d28;
          padding: 8px 4px;
          min-width: 0;
        }
        .chat-input::placeholder { color: #c490a8; }

        .send-btn {
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          border: none;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff5da0, #e53f86);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.15s, opacity 0.2s;
          box-shadow: 0 4px 12px -3px rgba(229, 63, 134, 0.5);
        }
        .send-btn:active:not(:disabled) { transform: scale(0.9); }
        .send-btn:disabled {
          opacity: 0.4;
          box-shadow: none;
          cursor: not-allowed;
        }

        /* Profile View */
        .profile-hero {
          padding: 32px 24px 24px;
          text-align: center;
          position: relative;
        }
        .profile-avatar {
          width: 108px;
          height: 108px;
          border-radius: 50%;
          margin: 0 auto 16px;
          background: linear-gradient(135deg, #ffb6d0, #ff5da0);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 52px;
          box-shadow: 
            0 20px 50px -10px rgba(229, 63, 134, 0.5),
            inset 0 -8px 20px rgba(201, 51, 116, 0.15);
        }
        .profile-name-en {
          font-family: 'Playfair Display', serif;
          font-size: 14px;
          font-weight: 500;
          color: #c93374;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .profile-name {
          font-family: 'Noto Kufi Arabic', sans-serif;
          font-size: 36px;
          font-weight: 800;
          color: #2a1d28;
          letter-spacing: -0.02em;
          line-height: 1;
          margin-bottom: 6px;
        }
        .profile-bio {
          font-size: 14.5px;
          color: #7a4a65;
          font-weight: 500;
          line-height: 1.5;
        }

        .profile-tabs {
          display: flex;
          gap: 6px;
          padding: 0 20px;
          margin-bottom: 16px;
          overflow-x: auto;
          scrollbar-width: none;
          flex-shrink: 0;
        }
        .profile-tabs::-webkit-scrollbar { display: none; }
        .profile-tab {
          padding: 8px 16px;
          background: transparent;
          border: 0.5px solid rgba(229, 65, 129, 0.2);
          border-radius: 20px;
          font-family: 'Noto Kufi Arabic', sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          color: #7a4a65;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .profile-tab.active {
          background: linear-gradient(135deg, #ff5da0, #e53f86);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 4px 14px -4px rgba(229, 63, 134, 0.5);
        }

        .profile-content {
          flex: 1;
          overflow-y: auto;
          padding: 0 20px calc(env(safe-area-inset-bottom) + 24px);
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .profile-content::-webkit-scrollbar { display: none; }

        .info-card {
          background: rgba(255, 255, 255, 0.8);
          border: 0.5px solid rgba(255, 180, 210, 0.3);
          border-radius: 20px;
          padding: 18px 20px;
          margin-bottom: 12px;
          box-shadow: 0 2px 14px -4px rgba(229, 63, 134, 0.1);
        }
        .info-card-label {
          font-family: 'Playfair Display', serif;
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #c93374;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .info-card-content {
          font-size: 15px;
          line-height: 1.65;
          color: #2a1d28;
          font-weight: 500;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 0.5px solid rgba(229, 65, 129, 0.1);
          font-size: 14.5px;
        }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { color: #7a4a65; font-weight: 500; }
        .detail-value { color: #2a1d28; font-weight: 600; }

        .family-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        .family-chip {
          background: rgba(255, 255, 255, 0.85);
          border: 0.5px solid rgba(255, 180, 210, 0.3);
          border-radius: 16px;
          padding: 12px 8px;
          text-align: center;
        }
        .family-emoji { font-size: 28px; line-height: 1; }
        .family-name {
          margin-top: 6px;
          font-size: 12.5px;
          font-weight: 700;
          color: #2a1d28;
        }
        .family-sub {
          font-size: 10.5px;
          color: #7a4a65;
          margin-top: 2px;
        }

        .heart-card {
          background: linear-gradient(135deg, #ff5da0, #e53f86);
          border-radius: 20px;
          padding: 20px;
          color: #fff;
          margin-bottom: 12px;
          box-shadow: 0 10px 30px -10px rgba(229, 63, 134, 0.5);
          position: relative;
          overflow: hidden;
        }
        .heart-card::before {
          content: '';
          position: absolute;
          top: -30%;
          right: -20%;
          width: 60%;
          height: 150%;
          background: radial-gradient(circle, rgba(255,255,255,0.2), transparent);
          pointer-events: none;
        }
        .heart-card-label {
          font-family: 'Playfair Display', serif;
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          opacity: 0.9;
          margin-bottom: 8px;
          font-weight: 600;
        }
        .heart-card-text {
          font-size: 16px;
          line-height: 1.55;
          font-weight: 500;
          position: relative;
        }
      `}</style>

      <div className="app-root">
        {view === "chat" ? (
          <ChatView 
            messages={messages}
            loading={loading}
            input={input}
            setInput={setInput}
            send={send}
            suggestions={suggestions}
            chatEndRef={chatEndRef}
            inputRef={inputRef}
            onProfile={() => setView("profile")}
          />
        ) : (
          <ProfileView
            profileTab={profileTab}
            setProfileTab={setProfileTab}
            onBack={() => setView("chat")}
          />
        )}
      </div>
    </>
  );
}

// ============ CHAT VIEW ============
function ChatView({ messages, loading, input, setInput, send, suggestions, chatEndRef, inputRef, onProfile }) {
  return (
    <>
      {/* Header */}
      <div className="header">
        <div style={{ width: 36 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, justifyContent: "center" }}>
          <div className="header-avatar" onClick={onProfile}>👑</div>
          <div className="header-title" style={{ textAlign: "right" }}>
            <div className="header-title-name">منيرا</div>
            <div className="header-title-status">نشطة الحين</div>
          </div>
        </div>
        <button className="header-profile-btn" onClick={onProfile} aria-label="الملف">
          <User size={18} strokeWidth={2} />
        </button>
      </div>

      {/* Messages */}
      <div className="messages-scroll">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.from}`}>
            <div className={`bubble ${m.from}`}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div className="message munira">
            <div className="typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="suggestions">
          {suggestions.map((s) => (
            <button key={s} className="suggestion" onClick={() => send(s)} disabled={loading}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="input-area">
        <div className="input-wrap">
          <input
            ref={inputRef}
            type="text"
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="اكتبي رسالة..."
            disabled={loading}
          />
          <button
            className="send-btn"
            onClick={() => send()}
            disabled={loading || !input.trim()}
            aria-label="إرسال"
          >
            <Send size={16} strokeWidth={2.5} style={{ transform: "scaleX(-1)" }} />
          </button>
        </div>
      </div>
    </>
  );
}

// ============ PROFILE VIEW ============
function ProfileView({ profileTab, setProfileTab, onBack }) {
  return (
    <>
      <div className="header">
        <button className="header-back" onClick={onBack} aria-label="رجوع">
          <ArrowLeft size={18} strokeWidth={2} style={{ transform: "scaleX(-1)" }} />
        </button>
        <div className="header-title">
          <div className="header-title-name">الملف الشخصي</div>
        </div>
        <div style={{ width: 36 }} />
      </div>

      <div className="profile-content">
        <div className="profile-hero">
          <div className="profile-avatar">👑</div>
          <div className="profile-name-en">Munira</div>
          <h1 className="profile-name">منيرا</h1>
          <p className="profile-bio">بنت الكويت 🇰🇼 · ٣٢ سنة<br/>عالمها وردي، قهوة، وحب ✨</p>
        </div>

        <div className="profile-tabs">
          {[
            { id: "about", label: "عن منيرا" },
            { id: "family", label: "العائلة" },
            { id: "loves", label: "اللي تحبه" },
          ].map((t) => (
            <button
              key={t.id}
              className={`profile-tab ${profileTab === t.id ? "active" : ""}`}
              onClick={() => setProfileTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {profileTab === "about" && (
          <>
            <div className="info-card">
              <div className="info-card-label">The Essentials</div>
              <div className="info-card-content">
                <div className="detail-row">
                  <span className="detail-label">الاسم</span>
                  <span className="detail-value">منيرا</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">العمر</span>
                  <span className="detail-value">٣٢ سنة</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">تاريخ الميلاد</span>
                  <span className="detail-value">٢١ أكتوبر ١٩٩٣</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">المدينة</span>
                  <span className="detail-value">الكويت 🇰🇼</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">الوضع</span>
                  <span className="detail-value">أم لولد واحد 💙</span>
                </div>
              </div>
            </div>

            <div className="heart-card">
              <div className="heart-card-label">A Dream</div>
              <p className="heart-card-text">
                حلمها تزور الرياض قريب 🇸🇦<br/>
                الجو والناس يشدونها هناك
              </p>
            </div>

            <div className="info-card">
              <div className="info-card-label">Her Vibe</div>
              <div className="info-card-content">
                ناعمة، بناتية، ورايقة. تحب الأجواء الحلوة وتكره الضغط. بنت الوردي من رأسها لرجلها 🎀
              </div>
            </div>
          </>
        )}

        {profileTab === "family" && (
          <>
            <div className="info-card">
              <div className="info-card-label">Parents</div>
              <div className="family-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <div className="family-chip">
                  <div className="family-emoji">👨🏻</div>
                  <div className="family-name">عبدالله</div>
                  <div className="family-sub">بابا</div>
                </div>
                <div className="family-chip">
                  <div className="family-emoji">👩🏻</div>
                  <div className="family-name">وسميّه</div>
                  <div className="family-sub">ماما</div>
                </div>
              </div>
            </div>

            <div className="info-card">
              <div className="info-card-label">Siblings</div>
              <div className="family-grid">
                <div className="family-chip">
                  <div className="family-emoji">🧔🏻</div>
                  <div className="family-name">مطير</div>
                </div>
                <div className="family-chip">
                  <div className="family-emoji">🧔🏻</div>
                  <div className="family-name">عبدالرحمن</div>
                </div>
                <div className="family-chip">
                  <div className="family-emoji">🌷</div>
                  <div className="family-name">مريم</div>
                  <div className="family-sub">أم لـ٤</div>
                </div>
                <div className="family-chip">
                  <div className="family-emoji">🌹</div>
                  <div className="family-name">اسومه</div>
                  <div className="family-sub">أم أحمد</div>
                </div>
                <div className="family-chip">
                  <div className="family-emoji">🌸</div>
                  <div className="family-name">هجورا</div>
                  <div className="family-sub">الصغيرة</div>
                </div>
              </div>
            </div>

            <div className="heart-card">
              <div className="heart-card-label">Apple of her Eye</div>
              <p className="heart-card-text">
                أحمد 👑 ولد اسومه<br/>
                تحبه كأنه ولدها
              </p>
            </div>

            <div className="info-card">
              <div className="info-card-label">Nieces & Nephews · خالة لـ٦</div>
              <div className="family-grid">
                {[
                  { e: "👦🏻", n: "أحمد", p: "اسومه" },
                  { e: "👦🏻", n: "محسن", p: "اسومه" },
                  { e: "👦🏻", n: "عثمان", p: "مريم" },
                  { e: "👦🏻", n: "عبدالله", p: "مريم" },
                  { e: "👧🏻", n: "لولوة", p: "مريم" },
                  { e: "👧🏻", n: "دانه", p: "مريم" },
                ].map((k) => (
                  <div key={k.n} className="family-chip">
                    <div className="family-emoji">{k.e}</div>
                    <div className="family-name">{k.n}</div>
                    <div className="family-sub">ولد {k.p}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="info-card">
              <div className="info-card-label">The Cat</div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ fontSize: 44 }}>🐱</div>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#2a1d28" }}>كوكِي</div>
                  <div style={{ fontSize: 13, color: "#7a4a65", marginTop: 2 }}>قطوة هجورا الحلوة</div>
                </div>
              </div>
            </div>
          </>
        )}

        {profileTab === "loves" && (
          <>
            <div className="heart-card">
              <div className="heart-card-label">Her Heart</div>
              <p className="heart-card-text">
                نوسه 💖<br/>
                قلبها وعمرها، الشخص الأغلى
              </p>
            </div>

            <div className="info-card">
              <div className="info-card-label">Her World</div>
              <div className="family-grid">
                {[
                  { e: "🎀", n: "الوردي" },
                  { e: "👑", n: "باربي" },
                  { e: "☕", n: "قهوة سوداء" },
                  { e: "🧀", n: "الحلوم" },
                  { e: "🚗", n: "الطلعات" },
                  { e: "✨", n: "الأجواء" },
                ].map((i) => (
                  <div key={i.n} className="family-chip">
                    <div className="family-emoji">{i.e}</div>
                    <div className="family-name">{i.n}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="info-card">
              <div className="info-card-label">Breakfast Rules</div>
              <div className="info-card-content">
                الصبح ما تحب أكل ثقيل 😩<br/>
                لازم فطور خفيف: قهوة سوداء + حلوم ☕🧀
              </div>
            </div>

            <div className="info-card" style={{ background: "rgba(255, 200, 215, 0.25)" }}>
              <div className="info-card-label">Hard Pass</div>
              <div className="info-card-content">
                الإسبريسو 🙅‍♀️<br/>
                والأكل الدسم أول ما تقوم
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
