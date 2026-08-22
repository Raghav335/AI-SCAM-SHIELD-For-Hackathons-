import { useState } from "react";

function AIChatbot() {
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("en");

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm AI Scam Shield Assistant. Ask me about any suspicious message, link, payment or scam.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Please login first.",
        },
      ]);
      return;
    }

    const userMessage = message;

    setMessage("");

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/chatbot",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: userMessage,
            language,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Chatbot failed"
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `⚠️ ${error.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f3e9] text-[#24352d] px-4 sm:px-6 py-6">

      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#dce9d8] rounded-full blur-3xl opacity-50" />

        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#e6ead8] rounded-full blur-3xl opacity-60" />

      </div>


      <div className="relative max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-6">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-[#e1eadc] border border-[#cbdac5] flex items-center justify-center text-2xl shadow-sm">
              ✦
            </div>

            <div>

              <div className="flex items-center gap-2">

                <h1 className="text-xl sm:text-2xl font-bold text-[#26372e]">
                  AI Assistant
                </h1>

                <span className="text-xs px-2 py-1 rounded-full bg-[#e5eee1] text-[#52705a] font-semibold">
                  AI
                </span>

              </div>

              <p className="text-sm text-[#78847c] mt-1">
                Your personal scam safety assistant
              </p>

            </div>

          </div>


          {/* ONLINE STATUS */}

          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-white/70 border border-[#dce0d5] shadow-sm">

            <span className="w-2.5 h-2.5 rounded-full bg-[#79a47e] animate-pulse" />

            <span className="text-xs font-semibold text-[#657268]">
              Online
            </span>

          </div>

        </div>


        {/* MAIN CHAT CARD */}

        <div className="grid lg:grid-cols-[280px_1fr] gap-5">


          {/* LEFT INFORMATION PANEL */}

          <div className="hidden lg:block">

            <div className="bg-[#fffdf7] border border-[#e2e1d8] rounded-3xl p-6 shadow-[0_8px_30px_rgba(70,80,60,0.06)]">

              {/* AI ICON */}

              <div className="w-16 h-16 rounded-2xl bg-[#e4eee0] border border-[#cedec8] flex items-center justify-center text-3xl mb-5">
                🛡️
              </div>

              <h2 className="text-lg font-bold text-[#26372e]">
                I'm here to help
              </h2>

              <p className="text-sm text-[#7b847c] leading-relaxed mt-2">
                Ask me about suspicious links, messages,
                payments, emails or possible scams.
              </p>


              {/* SUGGESTIONS */}

              <div className="mt-6 space-y-2">

                <p className="text-xs uppercase tracking-wider text-[#9a9f98] font-semibold mb-3">
                  Try asking
                </p>

                <div className="px-3 py-3 rounded-xl bg-[#f4f5ed] border border-[#e4e6dc] text-sm text-[#56635a]">
                  🔗 Is this website safe?
                </div>

                <div className="px-3 py-3 rounded-xl bg-[#f4f5ed] border border-[#e4e6dc] text-sm text-[#56635a]">
                  💳 Is this payment genuine?
                </div>

                <div className="px-3 py-3 rounded-xl bg-[#f4f5ed] border border-[#e4e6dc] text-sm text-[#56635a]">
                  📩 Is this message a scam?
                </div>

              </div>


              {/* PRIVACY */}

              <div className="mt-6 p-4 rounded-2xl bg-[#edf3e9] border border-[#dbe7d6]">

                <div className="flex gap-3">

                  <span className="text-lg">
                    🔒
                  </span>

                  <div>

                    <p className="text-xs font-bold text-[#4f6855]">
                      Privacy First
                    </p>

                    <p className="text-xs text-[#78847b] mt-1 leading-relaxed">
                      Stay alert and avoid sharing
                      passwords, OTPs or PINs.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* CHAT AREA */}

          <div className="bg-[#fffdf8] border border-[#e2e1d8] rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(70,80,60,0.08)]">


            {/* CHAT HEADER */}

            <div className="px-5 sm:px-6 py-4 border-b border-[#ebe9df] flex items-center justify-between bg-white/60">

              <div className="flex items-center gap-3">

                <div className="relative">

                  <div className="w-11 h-11 rounded-full bg-[#dce9d7] flex items-center justify-center text-xl">
                    🤖
                  </div>

                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#79a47e] border-2 border-white" />

                </div>

                <div>

                  <p className="font-bold text-[#2d3d33]">
                    AI Scam Shield
                  </p>

                  <p className="text-xs text-[#879087]">
                    AI safety assistant
                  </p>

                </div>

              </div>


              {/* LANGUAGE */}

              <select
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value)
                }
                className="bg-[#f4f4ec] border border-[#dedfd5] rounded-xl px-3 py-2 text-sm text-[#526057] outline-none focus:border-[#91a98f] cursor-pointer"
              >

                <option value="en">
                  English
                </option>

                <option value="hi">
                  हिंदी
                </option>

              </select>

            </div>


            {/* CHAT MESSAGES */}

            <div className="h-[520px] overflow-y-auto px-4 sm:px-6 py-6 space-y-5 bg-gradient-to-b from-[#fffdf8] to-[#faf9f2]">

              {messages.map((item, index) => (

                <div
                  key={index}
                  className={`flex items-end gap-2 ${
                    item.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  {/* AI AVATAR */}

                  {item.role === "assistant" && (

                    <div className="w-8 h-8 shrink-0 rounded-full bg-[#e3ecdf] flex items-center justify-center text-sm">
                      ✦
                    </div>

                  )}


                  {/* MESSAGE */}

                  <div
                    className={`max-w-[82%] sm:max-w-[70%] px-4 py-3.5 whitespace-pre-wrap leading-relaxed text-sm shadow-sm ${
                      item.role === "user"
                        ? "bg-[#dcebd7] text-[#304238] rounded-2xl rounded-br-md border border-[#cfe1c9]"
                        : "bg-white text-[#536057] rounded-2xl rounded-bl-md border border-[#e7e5dc]"
                    }`}
                  >

                    {item.text}

                  </div>


                  {/* USER AVATAR */}

                  {item.role === "user" && (

                    <div className="w-8 h-8 shrink-0 rounded-full bg-[#e9e6d9] flex items-center justify-center text-sm">
                      👤
                    </div>

                  )}

                </div>

              ))}


              {/* LOADING */}

              {loading && (

                <div className="flex items-end gap-2">

                  <div className="w-8 h-8 rounded-full bg-[#e3ecdf] flex items-center justify-center text-sm">
                    ✦
                  </div>

                  <div className="bg-white border border-[#e7e5dc] rounded-2xl rounded-bl-md px-5 py-3 shadow-sm">

                    <div className="flex items-center gap-1.5">

                      <span className="w-2 h-2 rounded-full bg-[#8da68e] animate-bounce" />

                      <span
                        className="w-2 h-2 rounded-full bg-[#8da68e] animate-bounce"
                        style={{ animationDelay: "0.15s" }}
                      />

                      <span
                        className="w-2 h-2 rounded-full bg-[#8da68e] animate-bounce"
                        style={{ animationDelay: "0.3s" }}
                      />

                      <span className="text-xs text-[#89938a] ml-2">
                        Analyzing
                      </span>

                    </div>

                  </div>

                </div>

              )}

            </div>


            {/* QUICK QUESTIONS */}

            <div className="px-4 sm:px-6 pt-4">

              <div className="flex gap-2 overflow-x-auto pb-2">

                <button
                  onClick={() =>
                    setMessage("Is this website safe?")
                  }
                  className="shrink-0 px-3 py-2 rounded-full bg-[#f3f4ed] border border-[#dedfd5] text-xs font-medium text-[#68746b] hover:bg-[#e8eee3] transition"
                >
                  🔗 Is this website safe?
                </button>

                <button
                  onClick={() =>
                    setMessage("Is this payment genuine?")
                  }
                  className="shrink-0 px-3 py-2 rounded-full bg-[#f3f4ed] border border-[#dedfd5] text-xs font-medium text-[#68746b] hover:bg-[#e8eee3] transition"
                >
                  💳 Payment check
                </button>

                <button
                  onClick={() =>
                    setMessage("Is this message a scam?")
                  }
                  className="shrink-0 px-3 py-2 rounded-full bg-[#f3f4ed] border border-[#dedfd5] text-xs font-medium text-[#68746b] hover:bg-[#e8eee3] transition"
                >
                  📩 Scam message
                </button>

              </div>

            </div>


            {/* INPUT */}

            <div className="p-4 sm:p-5">

              <div className="flex items-center gap-2 bg-[#f5f5ee] border border-[#dedfd5] rounded-2xl p-2 focus-within:border-[#9db39b] focus-within:ring-2 focus-within:ring-[#dce8d8] transition">

                <input
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessage();
                    }
                  }}
                  placeholder="Ask about a suspicious message..."
                  className="flex-1 bg-transparent px-3 py-3 outline-none text-sm text-[#34443a] placeholder:text-[#9aa19b]"
                />


                <button
                  onClick={sendMessage}
                  disabled={loading}
                  className="w-11 h-11 shrink-0 rounded-xl bg-[#52765d] hover:bg-[#45664f] text-white flex items-center justify-center font-bold transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  ➤
                </button>

              </div>

              <p className="text-[11px] text-center text-[#9a9f98] mt-3">
                AI can make mistakes. Never share OTP, PIN or password.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AIChatbot;