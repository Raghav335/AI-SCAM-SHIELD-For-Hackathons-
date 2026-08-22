import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function KnowledgeBase() {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedScam, setSelectedScam] = useState(null);
  const [search, setSearch] = useState("");

  const scams = [
    {
      id: 1,
      title: "Phishing Scam",
      category: "Phishing",
      risk: "High Risk",
      icon: "🎣",
      color: "green",
      description:
        "Fake emails, websites and messages designed to steal your credentials.",
      details:
        "Scammers use fake emails, websites and messages to steal sensitive information like passwords, bank details and OTPs.",
      protection: [
        "Check the sender and website URL carefully.",
        "Never click on suspicious links.",
        "Do not share passwords or OTPs.",
        "Verify directly from the official website or app.",
        "Report suspicious emails and messages.",
      ],
      flags: [
        "Suspicious sender address",
        "Urgent or threatening language",
        "Requests for sensitive information",
        "Unverified links or attachments",
      ],
    },

    {
      id: 2,
      title: "Payment / UPI Scam",
      category: "Payment",
      risk: "High Risk",
      icon: "💳",
      color: "green",
      description:
        "Frauds involving fake payments, QR codes and UPI transactions.",
      details:
        "Fraudsters may send fake payment requests, QR codes or screenshots to trick users into sending money.",
      protection: [
        "Verify the receiver before paying.",
        "Never scan an unknown QR code.",
        "Check your banking app for actual transactions.",
        "Never trust payment screenshots alone.",
        "Do not share UPI PIN.",
      ],
      flags: [
        "Fake payment screenshot",
        "Unknown QR code",
        "Urgent payment request",
        "Fake transaction confirmation",
      ],
    },

    {
      id: 3,
      title: "OTP Fraud",
      category: "OTP",
      risk: "Critical",
      icon: "🔐",
      color: "orange",
      description:
        "Scammers try to obtain OTPs to access accounts or complete frauds.",
      details:
        "OTP fraud happens when attackers convince victims to reveal authentication codes or approve fraudulent transactions.",
      protection: [
        "Never share an OTP with anyone.",
        "Do not approve unknown login requests.",
        "Verify unexpected calls independently.",
        "Enable additional account security.",
      ],
      flags: [
        "OTP request",
        "Unknown caller",
        "Urgent verification request",
        "Suspicious login alert",
      ],
    },

    {
      id: 4,
      title: "WhatsApp Scam",
      category: "WhatsApp",
      risk: "High Risk",
      icon: "💬",
      color: "green",
      description:
        "Suspicious messages, impersonation and fake offers on WhatsApp.",
      details:
        "Attackers may impersonate friends, companies or authorities and use WhatsApp messages to request money or sensitive information.",
      protection: [
        "Verify the identity of the sender.",
        "Do not send money based on urgent messages.",
        "Avoid suspicious links.",
        "Enable WhatsApp two-step verification.",
      ],
      flags: [
        "Unknown WhatsApp number",
        "Urgent money request",
        "Fake identity",
        "Suspicious links",
      ],
    },

    {
      id: 5,
      title: "Job Scam",
      category: "Job",
      risk: "Medium Risk",
      icon: "💼",
      color: "blue",
      description:
        "Fake jobs and offers asking for money or personal information.",
      details:
        "Fake recruiters may promise high salaries and then ask for registration fees, deposits or sensitive information.",
      protection: [
        "Verify the company independently.",
        "Never pay for a job opportunity.",
        "Check the official company careers page.",
        "Avoid sharing unnecessary documents.",
      ],
      flags: [
        "Guaranteed job",
        "Registration fee",
        "Unprofessional email",
        "Very high salary promise",
      ],
    },

    {
      id: 6,
      title: "Investment Scam",
      category: "Investment",
      risk: "Critical",
      icon: "📈",
      color: "green",
      description:
        "Fake investments promising unrealistic or guaranteed returns.",
      details:
        "Investment scammers often promise quick and guaranteed profits and may create fake dashboards showing fabricated returns.",
      protection: [
        "Never trust guaranteed returns.",
        "Verify investment platforms.",
        "Check regulatory information.",
        "Do not transfer money to unknown accounts.",
      ],
      flags: [
        "Guaranteed profit",
        "Limited-time investment",
        "Unknown investment platform",
        "Pressure to deposit money",
      ],
    },

    {
      id: 7,
      title: "Lottery / Prize Scam",
      category: "Lottery",
      risk: "High Risk",
      icon: "🎁",
      color: "purple",
      description:
        "Fake lotteries or prizes asking for fees or personal details.",
      details:
        "Victims are told that they have won a prize and must pay taxes, processing fees or provide sensitive information.",
      protection: [
        "Do not pay to claim an unexpected prize.",
        "Verify the contest independently.",
        "Never share banking credentials.",
        "Ignore unsolicited prize messages.",
      ],
      flags: [
        "You won a prize",
        "Processing fee",
        "Unknown lottery",
        "Request for bank details",
      ],
    },

    {
      id: 8,
      title: "Fake Customer Support",
      category: "Customer Support",
      risk: "High Risk",
      icon: "🎧",
      color: "blue",
      description:
        "Impersonation of support agents to steal sensitive information.",
      details:
        "Scammers impersonate customer support representatives and may ask users to install remote-access applications or share OTPs.",
      protection: [
        "Use only official support channels.",
        "Never install unknown remote-access software.",
        "Never share OTPs.",
        "Do not give remote access to your device.",
      ],
      flags: [
        "Fake support number",
        "Remote-access request",
        "OTP request",
        "Urgent account issue",
      ],
    },

    {
      id: 9,
      title: "KYC / Account Scam",
      category: "KYC",
      risk: "High Risk",
      icon: "🪪",
      color: "orange",
      description:
        "Fake KYC or account verification messages used to steal data.",
      details:
        "Attackers may pretend to represent banks or services and ask users to update KYC through malicious links.",
      protection: [
        "Use the official banking application.",
        "Never update KYC through unknown links.",
        "Do not share OTPs.",
        "Verify directly with the bank.",
      ],
      flags: [
        "KYC expiration threat",
        "Unknown verification link",
        "OTP request",
        "Account blocking threat",
      ],
    },
  ];

  const categories = [
    { name: "All Categories", icon: "▦" },
    { name: "Phishing Scam", icon: "🎣", filter: "Phishing" },
    { name: "Payment / UPI Scam", icon: "💳", filter: "Payment" },
    { name: "OTP Fraud", icon: "🔐", filter: "OTP" },
    { name: "WhatsApp Scam", icon: "💬", filter: "WhatsApp" },
    { name: "Job Scam", icon: "💼", filter: "Job" },
    { name: "Investment Scam", icon: "📈", filter: "Investment" },
    { name: "Lottery / Prize Scam", icon: "🎁", filter: "Lottery" },
    { name: "Fake Customer Support", icon: "🎧", filter: "Customer Support" },
    { name: "KYC / Account Scam", icon: "🪪", filter: "KYC" },
  ];

  const filteredScams = useMemo(() => {
    return scams.filter((scam) => {
      const matchesCategory =
        selectedCategory === "All Categories" ||
        scam.category === selectedCategory;

      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        scam.title.toLowerCase().includes(query) ||
        scam.description.toLowerCase().includes(query) ||
        scam.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, search]);

  const getRiskClass = (risk) => {
    if (risk === "Critical") {
      return "bg-red-50 text-red-500 border-red-100";
    }

    if (risk === "High Risk") {
      return "bg-red-50 text-red-500 border-red-100";
    }

    return "bg-orange-50 text-orange-500 border-orange-100";
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);

    const found = categories.find(
      (item) => item.name === category
    );

    if (found?.filter) {
      setSelectedCategory(found.filter);
    }
  };

  const activeCategory = selectedCategory;

  return (
    <div className="min-h-screen bg-[#f7f5ec] text-[#173b29]">

      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#dcebd8] rounded-full blur-3xl opacity-40" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-[#e8ead7] rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-[#d8e9dc] rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative max-w-[1500px] mx-auto p-4 md:p-6">

        <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr_390px] gap-5">

          {/* ================================================= */}
          {/* LEFT SIDEBAR */}
          {/* ================================================= */}

          <aside className="bg-[#fffdf7] border border-[#e6e3d7] rounded-[28px] p-5 shadow-sm">

            {/* Logo */}
            <div className="flex items-center gap-3 mb-7">

              <div className="w-12 h-12 rounded-2xl bg-[#edf5e9] flex items-center justify-center border border-[#dcebd7]">
                <span className="text-3xl">🛡️</span>
              </div>

              <div>
                <h1 className="font-bold text-xl">
                  AI Scam Shield
                </h1>

                <p className="text-xs text-gray-500">
                  Don't trust it. Scan it.
                </p>
              </div>

              <div className="ml-auto text-xl">
                🔔
              </div>

            </div>

            {/* Greeting */}
            <div className="rounded-3xl bg-gradient-to-br from-[#f4f6e8] to-[#edf5e9] p-5 mb-5 border border-[#e1e8d8]">

              <h2 className="text-xl font-bold">
                Hello, there 👋
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Stay alert, Stay safe.
              </p>

              <div className="flex justify-center mt-4">
                <div className="text-7xl">
                  🛡️
                </div>
              </div>

            </div>

            {/* Current Page */}
            <div className="rounded-2xl bg-[#216b43] text-white p-5 mb-6 shadow-lg shadow-green-900/10">

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-2xl">
                  📖
                </div>

                <div className="flex-1">

                  <h3 className="font-bold">
                    Knowledge Base
                  </h3>

                  <p className="text-xs text-white/70 mt-1">
                    Learn about scams and protect yourself better.
                  </p>

                </div>

                <div className="w-10 h-10 bg-white text-[#216b43] rounded-full flex items-center justify-center text-xl">
                  →
                </div>

              </div>

            </div>

            {/* Categories */}
            <div>

              <h3 className="font-bold text-lg mb-3">
                Categories
              </h3>

              <div className="space-y-1">

                {categories.map((category) => {

                  const isActive =
                    activeCategory === category.name ||
                    activeCategory === category.filter;

                  return (
                    <button
                      key={category.name}
                      onClick={() =>
                        selectCategory(category.name)
                      }
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left text-sm transition ${
                        isActive
                          ? "bg-[#eef5e8] text-[#216b43] font-semibold"
                          : "text-gray-600 hover:bg-[#f4f4eb]"
                      }`}
                    >

                      <span className="w-7 text-center">
                        {category.icon}
                      </span>

                      <span>
                        {category.name}
                      </span>

                    </button>
                  );
                })}

              </div>

            </div>

            {/* Help */}
            <div className="mt-6 rounded-3xl border border-[#e5dfcf] bg-[#fffaf0] p-5">

              <div className="flex gap-3">

                <div className="text-3xl">
                  🎧
                </div>

                <div>
                  <h3 className="font-bold">
                    Need Help?
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Ask our AI Assistant anything about scams.
                  </p>
                </div>

              </div>

              <button
                onClick={() => navigate("/chatbot")}
                className="mt-4 w-full rounded-xl bg-[#216b43] text-white py-3 text-sm font-semibold hover:bg-[#195a37] transition"
              >
                Chat with AI Assistant →
              </button>

            </div>

            {/* Bottom navigation */}
            <div className="grid grid-cols-4 gap-2 mt-6 pt-5 border-t border-[#ebe8de]">

              <button
                onClick={() => navigate("/")}
                className="text-center text-xs text-gray-500 hover:text-[#216b43]"
              >
                <div className="text-xl mb-1">⌂</div>
                Home
              </button>

              <button
                onClick={() => navigate("/history")}
                className="text-center text-xs text-gray-500 hover:text-[#216b43]"
              >
                <div className="text-xl mb-1">◷</div>
                History
              </button>

              <button
                onClick={() => navigate("/ai-chatbot")}
                className="text-center text-xs text-gray-500 hover:text-[#216b43]"
              >
                <div className="text-xl mb-1">◇</div>
                AI Assistant
              </button>

              <button
                onClick={() => navigate("/profile")}
                className="text-center text-xs text-gray-500 hover:text-[#216b43]"
              >
                <div className="text-xl mb-1">♙</div>
                Profile
              </button>

            </div>

          </aside>


          {/* ================================================= */}
          {/* CENTER CONTENT */}
          {/* ================================================= */}

          <main className="bg-[#fffdf8] border border-[#e6e3d7] rounded-[28px] p-5 md:p-7 shadow-sm">

            {/* Header */}
            <div className="mb-6">

              <div className="flex flex-wrap items-center justify-between gap-4">

                <div>

                  <h1 className="text-3xl md:text-4xl font-bold text-[#185b38]">
                    Scam Knowledge Base
                  </h1>

                  <p className="text-gray-500 mt-2">
                    Learn how scams work and stay protected
                  </p>

                </div>

                <div className="flex items-center gap-2">

                  <div className="px-4 py-2 rounded-full bg-[#edf5e9] text-[#216b43] text-xs font-semibold">
                    🛡️ AI Powered
                  </div>

                </div>

              </div>

            </div>

            {/* Search + filters */}
            <div className="flex flex-col lg:flex-row gap-3 mb-7">

              <div className="relative flex-1">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search scam types, keywords..."
                  className="w-full bg-white border border-[#deddd2] rounded-xl pl-11 pr-4 py-3 outline-none focus:border-[#216b43] transition"
                />

              </div>

              <div className="flex gap-2 overflow-x-auto">

                {[
                  "All",
                  "High Risk",
                  "Medium Risk",
                  "Low Risk",
                ].map((filter) => (

                  <button
                    key={filter}
                    className={`px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap border ${
                      filter === "All"
                        ? "bg-[#216b43] text-white border-[#216b43]"
                        : "bg-white text-gray-600 border-[#deddd2] hover:bg-[#f3f6ee]"
                    }`}
                  >
                    {filter}
                  </button>

                ))}

              </div>

            </div>

            {/* Scam cards */}
            {filteredScams.length > 0 ? (

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">

                {filteredScams.map((scam) => (

                  <button
                    key={scam.id}
                    onClick={() => setSelectedScam(scam)}
                    className={`text-left bg-white border rounded-2xl p-5 transition-all hover:-translate-y-1 hover:shadow-lg ${
                      selectedScam?.id === scam.id
                        ? "border-[#6aa37b] shadow-md"
                        : "border-[#e3e1d8]"
                    }`}
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex items-center gap-3">

                        <div className="w-12 h-12 rounded-full bg-[#edf5e9] flex items-center justify-center text-2xl">
                          {scam.icon}
                        </div>

                        <div>

                          <h3 className="font-bold text-[16px]">
                            {scam.title}
                          </h3>

                          <span
                            className={`inline-block mt-2 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${getRiskClass(
                              scam.risk
                            )}`}
                          >
                            {scam.risk}
                          </span>

                        </div>

                      </div>

                    </div>

                    <p className="text-sm text-gray-500 leading-relaxed mt-5 min-h-[65px]">
                      {scam.description}
                    </p>

                    <div className="flex justify-end mt-3">

                      <span className="w-9 h-9 rounded-full bg-[#f0f5e9] text-[#216b43] flex items-center justify-center text-lg">
                        →
                      </span>

                    </div>

                  </button>

                ))}

              </div>

            ) : (

              <div className="py-20 text-center">

                <div className="text-6xl mb-4">
                  🔎
                </div>

                <h3 className="text-xl font-bold">
                  No scam found
                </h3>

                <p className="text-gray-500 mt-2">
                  Try another search keyword.
                </p>

              </div>

            )}

            {/* Bottom feature strip */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-7 p-4 rounded-2xl bg-[#f0f5e9] border border-[#dfe9d9]">

              <div className="flex gap-3">
                <span className="text-2xl">🧠</span>
                <div>
                  <p className="font-semibold text-sm">
                    AI-Powered Insights
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Detects and explains scam patterns.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-2xl">📄</span>
                <div>
                  <p className="font-semibold text-sm">
                    Multi-Format Support
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Messages, links, emails and images.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-2xl">🛡️</span>
                <div>
                  <p className="font-semibold text-sm">
                    Privacy First
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Your data stays protected.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-2xl">🔔</span>
                <div>
                  <p className="font-semibold text-sm">
                    Stay Alert, Stay Safe
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Your security companion.
                  </p>
                </div>
              </div>

            </div>

          </main>


          {/* ================================================= */}
          {/* RIGHT DETAILS */}
          {/* ================================================= */}

          <aside className="bg-[#fffdf8] border border-[#e6e3d7] rounded-[28px] p-5 shadow-sm">

            {selectedScam ? (

              <>

                <div className="flex items-center gap-3 mb-6">

                  <button
                    onClick={() => setSelectedScam(null)}
                    className="text-2xl hover:text-[#216b43]"
                  >
                    ←
                  </button>

                  <h2 className="font-bold text-lg">
                    Knowledge Details
                  </h2>

                </div>

                <div className="rounded-3xl bg-[#f0f5e9] p-8 flex justify-center mb-5">

                  <span className="text-7xl">
                    {selectedScam.icon}
                  </span>

                </div>

                <div className="flex items-center gap-3">

                  <h2 className="text-2xl font-bold">
                    {selectedScam.title}
                  </h2>

                  <span
                    className={`px-2.5 py-1 rounded-full border text-xs font-semibold ${getRiskClass(
                      selectedScam.risk
                    )}`}
                  >
                    {selectedScam.risk}
                  </span>

                </div>

                <p className="text-gray-500 leading-relaxed mt-4">
                  {selectedScam.details}
                </p>

                {/* Protection */}
                <div className="mt-6 rounded-2xl border border-[#e3e1d8] p-5">

                  <h3 className="font-bold text-[#216b43]">
                    How to Protect Yourself
                  </h3>

                  <div className="space-y-3 mt-4">

                    {selectedScam.protection.map(
                      (item, index) => (

                        <div
                          key={index}
                          className="flex gap-3 items-start"
                        >

                          <span className="w-5 h-5 rounded-full bg-[#dcebd8] text-[#216b43] flex items-center justify-center text-xs flex-shrink-0">
                            ✓
                          </span>

                          <p className="text-sm text-gray-600">
                            {item}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                </div>

                {/* AI recommendation */}
                <div className="mt-4 rounded-2xl bg-[#f0f5e9] border border-[#dcebd8] p-5">

                  <div className="flex gap-3">

                    <div className="text-2xl">
                      🛡️
                    </div>

                    <div>

                      <h3 className="font-bold text-[#216b43]">
                        AI Recommendation
                      </h3>

                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                        Always be cautious of urgent messages
                        asking for quick action or sensitive
                        information.
                      </p>

                    </div>

                  </div>

                </div>

                {/* Red flags */}
                <div className="mt-4 rounded-2xl bg-[#fff3f0] border border-[#f4d5cf] p-5">

                  <h3 className="font-bold text-red-500 flex items-center gap-2">
                    ⚠️ Typical Red Flags
                  </h3>

                  <div className="space-y-3 mt-4">

                    {selectedScam.flags.map(
                      (flag, index) => (

                        <div
                          key={index}
                          className="flex gap-3 items-center"
                        >

                          <span className="w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xs">
                            !
                          </span>

                          <span className="text-sm text-gray-600">
                            {flag}
                          </span>

                        </div>

                      )
                    )}

                  </div>

                </div>

                <button
                  onClick={() => setSelectedScam(null)}
                  className="w-full mt-5 rounded-xl bg-[#216b43] text-white py-4 font-bold hover:bg-[#195a37] transition"
                >
                  Got it, Stay Safe! 🛡️
                </button>

              </>

            ) : (

              <>

                <div className="flex items-center justify-between mb-6">

                  <h2 className="text-xl font-bold">
                    Knowledge Details
                  </h2>

                  <span className="text-xl">
                    ⋮
                  </span>

                </div>

                <div className="rounded-3xl bg-[#f0f5e9] p-10 flex justify-center">

                  <span className="text-8xl">
                    🛡️
                  </span>

                </div>

                <h2 className="text-2xl font-bold mt-6">
                  Learn & Stay Protected
                </h2>

                <p className="text-gray-500 mt-3 leading-relaxed">
                  Select any scam category to understand how
                  it works, identify warning signs and learn
                  how to protect yourself.
                </p>

                <div className="mt-6 rounded-2xl bg-[#f0f5e9] p-5">

                  <h3 className="font-bold text-[#216b43]">
                    🤖 AI Security Tip
                  </h3>

                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    If a message creates urgency, asks for
                    sensitive information or promises something
                    unrealistic, stop and verify before acting.
                  </p>

                </div>

                <button
                  onClick={() => navigate("/chatbot")}
                  className="w-full mt-5 rounded-xl bg-[#216b43] text-white py-4 font-bold hover:bg-[#195a37] transition"
                >
                  Ask AI Assistant →
                </button>

              </>

            )}

          </aside>

        </div>

      </div>

    </div>
  );
}

export default KnowledgeBase;