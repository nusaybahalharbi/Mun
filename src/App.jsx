import { useState, useRef, useEffect } from "react";
import {
  Heart,
  Sparkles,
  Send,
  Home,
  User,
  Users,
  MessageCircle,
  AlertCircle,
} from "lucide-react";

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
  const [started, setStarted] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [messages, setMessages] = useState([
    {
      from: "munira",
      text: "هلا والله 💕✨ أنا منيرا.. تفضّلي اسأليني أي شي تبينه 🎀",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Call our serverless backend (which holds the API key safely)
  const callBackend = async (history) => {
    const apiMessages = history.map((m) => ({
      role: m.from === "user" ? "user" : "assistant",
      content: m.text,
    }));

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system: SYSTEM_PROMPT,
        messages: apiMessages,
      }),
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
    setApiError("");

    try {
      const reply = await callBackend(newHistory);
      setMessages((m) => [...m, { from: "munira", text: reply }]);
    } catch (err) {
      console.error(err);
      setApiError(err.message || "unknown");
      setMessages((m) => [
        ...m,
        { from: "munira", text: "اووف يا قلبي صار شي غلط 💔 جربي مرة ثانية ✨" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "منو منيرا؟",
    "تكلمي عن نوسه 💖",
    "وش تحبين؟",
    "تبين تجين الرياض؟",
    "قولي شي عن الكويت",
    "احكي عن عائلتك",
  ];

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
          {["💖","✨","🌸","💕","🎀","💗","✨","💖","🌷","✨"].map((e, i) => (
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
            <Sparkles size={14} /> عالم منيرا الوردي <Heart size={14} fill="currentColor" />
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
            منيرا
          </h1>

          <p className="mt-6 text-base sm:text-lg text-pink-700/90 max-w-md leading-loose font-medium">
            هلا والله... أنا منيرا 💗
            <br />
            عالمي كله وردي، قهوة، و<span className="font-bold text-pink-600">نوسه</span> ✨
          </p>

          <div className="mt-8 flex gap-2 flex-wrap justify-center max-w-sm">
            {["🎀 ٣٢ سنة", "🇰🇼 الكويت", "👑 باربي", "☕ قهوة سوداء"].map((c) => (
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
            ادخلي عالمي 💕✨
          </button>
        </div>

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
            منيرا 💖
          </h1>
          {apiError && (
            <div className="mt-3 mx-auto max-w-md px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-center gap-2">
              <AlertCircle size={14} /> في مشكلة بالـ API
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
                    👑
                  </div>
                  <div>
                    <div className="font-black text-2xl">منيرا</div>
                    <div className="text-sm opacity-90">٣٢ سنة • الكويت 🇰🇼</div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed opacity-95">
                  هلا والله يا قلبي 💗 أنا منيرا.. حياتي وردي وقهوة وباربي وحب. تعالي نتعرف على عالمي ✨
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
                <div className="font-bold">دردشي معي 💕</div>
                <div className="text-xs opacity-90 mt-1">بالذكاء الاصطناعي</div>
              </button>
              <button
                onClick={() => setActiveTab("about")}
                className="rounded-3xl p-5 bg-white/85 backdrop-blur-md border-2 border-pink-100 shadow-xl text-right transition-all hover:-translate-y-1"
              >
                <User size={24} className="mb-2 text-pink-600" />
                <div className="font-bold text-pink-700">عن منيرا</div>
                <div className="text-xs text-gray-500 mt-1">تعرّف عليها</div>
              </button>
              <button
                onClick={() => setActiveTab("family")}
                className="rounded-3xl p-5 bg-white/85 backdrop-blur-md border-2 border-pink-100 shadow-xl text-right transition-all hover:-translate-y-1"
              >
                <Users size={24} className="mb-2 text-pink-600" />
                <div className="font-bold text-pink-700">عائلتها</div>
                <div className="text-xs text-gray-500 mt-1">الأغلى عليها</div>
              </button>
              <button
                onClick={() => setActiveTab("loves")}
                className="rounded-3xl p-5 bg-white/85 backdrop-blur-md border-2 border-pink-100 shadow-xl text-right transition-all hover:-translate-y-1"
              >
                <Heart size={24} className="mb-2 text-pink-600" />
                <div className="font-bold text-pink-700">اللي تحبه</div>
                <div className="text-xs text-gray-500 mt-1">عالمها الوردي</div>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { e: "🎀", t: "باربي" },
                { e: "☕", t: "قهوة سوداء" },
                { e: "💖", t: "نوسه" },
                { e: "🇰🇼", t: "الكويت" },
                { e: "🇸🇦", t: "حلمها الرياض" },
                { e: "🧀", t: "حلوم" },
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
            <Card icon="🌸" title="تعرّف عليها">
              أنا <b className="text-pink-600">منيرا</b>، عمري ٣٢ سنة، مواليد ٢١ أكتوبر ١٩٩٣، عايشة بالكويت 🇰🇼. مو موظفة، متفرغة لبيتي وأهلي وولدي 💕
            </Card>
            <Card icon="👑" title="شخصيتها">
              ناعمة، بناتية، رايقة 🎀 تحب الأجواء الحلوة وتكره الضغط. بنت الوردي من رأسها لرجلها 💕
            </Card>
            <Card icon="🇸🇦" title="حلمها الجاي">
              ودّها تزور الرياض قريب 🥹💕 سمعت شي حلو عنها والجو يشدها، بإذن الله قريب ✨
            </Card>
            <Card icon="💖" title="نوسه">
              نوسه قلبها 💖 حبها الغالي اللي ما يقدر يوصفه بالكلام ✨
            </Card>
          </div>
        )}

        {activeTab === "family" && (
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border-2 border-pink-100 shadow-xl">
              <h3 className="font-bold text-pink-700 mb-4 flex items-center gap-2">
                <Home size={18} /> بيت البابا والماما
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <FamilyCard emoji="👨🏻" name="بابا عبدالله" subtitle="🤍" />
                <FamilyCard emoji="👩🏻" name="ماما وسميّه" subtitle="🤍" />
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border-2 border-pink-100 shadow-xl">
              <h3 className="font-bold text-pink-700 mb-4 flex items-center gap-2">
                <Users size={18} /> أخوانها وخواتها
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <FamilyCard emoji="🧔🏻" name="مطير" />
                <FamilyCard emoji="🧔🏻" name="عبدالرحمن" />
                <FamilyCard emoji="🌷" name="مريم" subtitle="أم لـ٤" />
                <FamilyCard emoji="🌹" name="اسومه (أسماء)" subtitle="أم أحمد" />
                <FamilyCard emoji="🌸" name="هجورا (هاجر)" subtitle="الصغيرة" />
              </div>
            </div>

            <div
              className="rounded-3xl p-5 text-white shadow-xl"
              style={{ background: "linear-gradient(135deg, #ff7eb0, #ff4c94)" }}
            >
              <h3 className="font-bold mb-3 flex items-center gap-2">👑 قرة عينها</h3>
              <p className="text-sm leading-relaxed">
                أحمد ولد أختها اسومه 🥹 تحبه كأنه ولدها 💕
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border-2 border-pink-100 shadow-xl">
              <h3 className="font-bold text-pink-700 mb-4">👶 خالة لـ٦ أطفال</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { e: "👦🏻", n: "أحمد", p: "اسومه" },
                  { e: "👦🏻", n: "محسن", p: "اسومه" },
                  { e: "👦🏻", n: "عثمان", p: "مريم" },
                  { e: "👦🏻", n: "عبدالله", p: "مريم" },
                  { e: "👧🏻", n: "لولوة", p: "مريم" },
                  { e: "👧🏻", n: "دانه", p: "مريم" },
                ].map((k) => (
                  <div key={k.n} className="bg-pink-50 rounded-2xl p-2 text-center">
                    <div className="text-2xl">{k.e}</div>
                    <div className="text-xs font-bold text-pink-700">{k.n}</div>
                    <div className="text-[10px] text-gray-500">ولد {k.p}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-3xl p-5 border-2 border-pink-200 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="text-5xl">🐱</div>
                <div>
                  <div className="font-bold text-pink-700 text-lg">كوكِي</div>
                  <div className="text-sm text-gray-600">قطوة هجورا الحلوة 💕</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "loves" && (
          <div className="grid grid-cols-2 gap-3">
            <Card icon="🎀" title="الوردي">لوني وحياتي 💕 كل شي عندي وردي</Card>
            <Card icon="👑" title="باربي">أيقونتي من صغري 💖</Card>
            <Card icon="☕" title="قهوة سوداء">الحياة مو شي بدونها ✨</Card>
            <Card icon="🧀" title="الحلوم">جبنتي المفضلة 💕</Card>
            <Card icon="🚗" title="الطلعات">كافيهات ومولات وأجواء حلوة 💕</Card>
            <Card icon="💖" title="نوسه">قلبي وعمري 💖</Card>
            <div className="col-span-2">
              <Card icon="❌" title="ما تحبه">
                الإسبريسو 🙅‍♀️ والأكل الثقيل أول ما تقوم من النوم 😩
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
                  👑
                </div>
                <span className="absolute bottom-0 left-0 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <div className="font-bold text-lg">منيرا</div>
                <div className="text-xs opacity-90">أونلاين 💕</div>
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
                <div
                  key={i}
                  className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                >
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
                placeholder="اكتبي رسالتك... 💕"
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

      {/* Bottom Tab Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 bg-white/85 backdrop-blur-2xl border-t border-pink-200"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="max-w-2xl mx-auto flex justify-around items-center py-2 px-2">
          {[
            { id: "home", icon: Home, label: "الرئيسية" },
            { id: "about", icon: User, label: "منيرا" },
            { id: "family", icon: Users, label: "العائلة" },
            { id: "loves", icon: Heart, label: "اللي تحبه" },
            { id: "chat", icon: MessageCircle, label: "الدردشة" },
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

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        html { scroll-behavior: smooth; }
        body { -webkit-tap-highlight-color: transparent; }
      `}</style>
    </div>
  );
}
