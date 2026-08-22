import { Link } from "react-router-dom";

function Home() {
  const scanOptions = [
    {
      title: "Image / Screenshot",
      description: "Upload an image for AI analysis",
      icon: "🖼️",
      path: "/image-scanner",
    },
    {
      title: "URL / Website",
      description: "Check suspicious links",
      icon: "🔗",
      path: "/url-scanner",
    },
    {
      title: "QR Code",
      description: "Scan QR codes for threats",
      icon: "▦",
      path: "/qr-scanner",
    },
    {
      title: "Email",
      description: "Analyze suspicious emails",
      icon: "✉️",
      path: "/email-scanner",
    },
    {
      title: "WhatsApp / SMS",
      description: "Analyze chat messages",
      icon: "💬",
      path: "/whatsapp-scanner",
    },
    {
      title: "Payment Screenshot",
      description: "Verify payment screenshots",
      icon: "💳",
      path: "/payment-scanner",
    },
  ];

  const features = [
    {
      icon: "🤖",
      title: "AI-Powered Analysis",
      description: "Advanced AI detects scam indicators in seconds.",
    },
    {
      icon: "🛡️",
      title: "Multi-Format Support",
      description: "Analyze images, links, emails, chats and QR codes.",
    },
    {
      icon: "🔒",
      title: "Privacy First",
      description: "Your security and privacy stay protected.",
    },
    {
      icon: "⚡",
      title: "Stay Alert, Stay Safe",
      description: "Get instant risk analysis and safety recommendations.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f5ed] text-slate-800">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">

        {/* Background decoration */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-green-200/30 blur-3xl" />
        <div className="absolute top-40 right-10 w-40 h-40 rounded-full bg-emerald-200/30 blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 py-14">

          {/* Header inside home */}
          <div className="flex items-center justify-between mb-16">

            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-green-900/10 flex items-center justify-center">
                <span className="text-3xl">
                  🛡️
                </span>
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  AI Scam Shield
                </h1>

                <p className="text-xs text-slate-500">
                  Don't trust it. Scan it.
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-3">

              <Link
                to="/chatbot"
                className="hidden sm:flex w-11 h-11 rounded-xl bg-white border border-slate-200 items-center justify-center hover:bg-green-50 transition"
              >
                🤖
              </Link>

              <Link
                to="/profile"
                className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-green-50 transition"
              >
                👤
              </Link>

            </div>

          </div>


          {/* MAIN HERO */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* LEFT */}
            <div>

              <p className="text-green-700 font-semibold mb-4">
                🛡️ AI-POWERED SCAM PROTECTION
              </p>

              <h2 className="text-5xl md:text-6xl font-bold leading-tight text-slate-800">
                Stay Alert.
                <br />

                <span className="text-green-700">
                  Stay Safe.
                </span>
              </h2>

              <p className="mt-6 text-lg text-slate-500 max-w-xl leading-relaxed">
                Protect yourself from phishing, fake payments,
                malicious links, scam messages and social engineering
                with AI-powered security analysis.
              </p>


              {/* Main CTA */}
              <div className="flex flex-wrap gap-4 mt-8">

                <Link
                  to="/scanner"
                  className="px-7 py-4 rounded-2xl bg-[#214d3a] text-white font-semibold shadow-lg hover:bg-[#183d2d] transition flex items-center gap-3"
                >
                  🛡️ Scan Something
                  <span>→</span>
                </Link>

                <Link
                  to="/chatbot"
                  className="px-7 py-4 rounded-2xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-green-50 transition"
                >
                  🤖 Ask AI Assistant
                </Link>

              </div>

            </div>


            {/* RIGHT SHIELD */}
            <div className="flex justify-center">

              <div className="relative">

                {/* Glow */}
                <div className="absolute inset-0 bg-green-300/30 blur-3xl rounded-full" />

                <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full border border-green-900/10 bg-white/60 flex items-center justify-center shadow-xl">

                  <div className="absolute inset-8 rounded-full border border-green-700/10" />

                  <div className="absolute inset-16 rounded-full border border-green-700/10" />

                  <div className="w-48 h-56 md:w-60 md:h-68 bg-gradient-to-b from-green-700 to-[#214d3a] rounded-[45%] flex items-center justify-center shadow-2xl">

                    <div className="text-7xl md:text-8xl">
                      🛡️
                    </div>

                  </div>

                  <div className="absolute top-10 right-16 text-green-600">
                    ✦
                  </div>

                  <div className="absolute bottom-16 left-10 text-green-500">
                    ✦
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* SCAN ANYTHING */}
      <section className="max-w-7xl mx-auto px-6 py-12">

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-7">

            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Scan Anything Suspicious
              </h2>

              <p className="text-slate-500 mt-1">
                Choose what you want to analyze for possible threats.
              </p>
            </div>

            <Link
              to="/scanner"
              className="text-green-700 font-semibold hover:underline"
            >
              Open Scanner →
            </Link>

          </div>


          {/* OPTIONS */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

            {scanOptions.map((option) => (

              <Link
                key={option.path}
                to={option.path}
                className="group rounded-2xl border border-slate-200 p-5 hover:border-green-300 hover:bg-green-50/50 transition"
              >

                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                  {option.icon}
                </div>

                <h3 className="font-semibold text-sm text-slate-800">
                  {option.title}
                </h3>

                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {option.description}
                </p>

              </Link>

            ))}

          </div>

        </div>

      </section>


      {/* QUICK FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-8">

        <div className="grid md:grid-cols-3 gap-5">

          {/* AI ASSISTANT */}
          <Link
            to="/chatbot"
            className="bg-[#214d3a] text-white rounded-3xl p-7 hover:scale-[1.01] transition"
          >

            <div className="text-4xl mb-5">
              🤖
            </div>

            <h3 className="text-xl font-bold">
              AI Assistant
            </h3>

            <p className="text-green-100 mt-2 leading-relaxed">
              Ask questions about suspicious messages,
              websites, payments and scams.
            </p>

            <div className="mt-6 font-semibold">
              Talk to AI →
            </div>

          </Link>


          {/* KNOWLEDGE BASE */}
          <Link
            to="/knowledge-base"
            className="bg-white rounded-3xl border border-slate-200 p-7 hover:border-green-300 transition"
          >

            <div className="text-4xl mb-5">
              📚
            </div>

            <h3 className="text-xl font-bold">
              Scam Knowledge Base
            </h3>

            <p className="text-slate-500 mt-2 leading-relaxed">
              Learn about phishing, OTP fraud, fake payments,
              investment scams and more.
            </p>

            <div className="mt-6 font-semibold text-green-700">
              Learn More →
            </div>

          </Link>


          {/* REPORT */}
          <Link
            to="/report"
            className="bg-white rounded-3xl border border-slate-200 p-7 hover:border-red-200 transition"
          >

            <div className="text-4xl mb-5">
              🚨
            </div>

            <h3 className="text-xl font-bold">
              Report Scam
            </h3>

            <p className="text-slate-500 mt-2 leading-relaxed">
              Report suspicious activity and help improve
              scam awareness.
            </p>

            <div className="mt-6 font-semibold text-red-600">
              Report Now →
            </div>

          </Link>

        </div>

      </section>


      {/* RECENT SCANS */}
      <section className="max-w-7xl mx-auto px-6 py-12">

        <div className="flex items-center justify-between mb-5">

          <div>
            <h2 className="text-2xl font-bold">
              Recent Scans
            </h2>

            <p className="text-slate-500 mt-1">
              Quickly access your latest security checks.
            </p>
          </div>

          <Link
            to="/history"
            className="text-green-700 font-semibold hover:underline"
          >
            View All →
          </Link>

        </div>


        <div className="bg-white border border-slate-200 rounded-3xl p-6">

          <div className="flex flex-col md:flex-row items-center justify-between gap-5">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-2xl">
                ⚠️
              </div>

              <div>
                <h3 className="font-semibold">
                  Your scan history
                </h3>

                <p className="text-sm text-slate-500">
                  View detailed results of your previous scans.
                </p>
              </div>

            </div>

            <Link
              to="/history"
              className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-green-50 text-slate-700 font-semibold transition"
            >
              Open History
            </Link>

          </div>

        </div>

      </section>


      {/* WHY AI SCAM SHIELD */}
      <section className="bg-[#edf3eb] border-y border-green-900/5">

        <div className="max-w-7xl mx-auto px-6 py-14">

          <div className="text-center mb-10">

            <p className="text-green-700 font-semibold">
              YOUR DIGITAL SAFETY PARTNER
            </p>

            <h2 className="text-3xl font-bold mt-2">
              Why AI Scam Shield?
            </h2>

          </div>


          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

            {features.map((feature) => (

              <div
                key={feature.title}
                className="bg-white rounded-2xl p-6 border border-slate-200"
              >

                <div className="text-3xl mb-4">
                  {feature.icon}
                </div>

                <h3 className="font-bold">
                  {feature.title}
                </h3>

                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  {feature.description}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="bg-[#214d3a] text-white">

        <div className="max-w-7xl mx-auto px-6 py-10">

          <div className="flex flex-col md:flex-row justify-between gap-8">

            <div>

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                  🛡️
                </div>

                <div>
                  <h2 className="font-bold text-lg">
                    AI Scam Shield
                  </h2>

                  <p className="text-xs text-green-100">
                    Smart. Secure. Shielded.
                  </p>
                </div>

              </div>

              <p className="text-green-100 text-sm mt-4 max-w-md">
                AI-powered protection against scams, phishing,
                malicious links and digital fraud.
              </p>

            </div>


            <div className="flex flex-wrap gap-6 text-sm text-green-100">

              <Link
                to="/scanner"
                className="hover:text-white"
              >
                Scanner
              </Link>

              <Link
                to="/chatbot"
                className="hover:text-white"
              >
                AI Assistant
              </Link>

              <Link
                to="/knowledge-base"
                className="hover:text-white"
              >
                Knowledge Base
              </Link>

              <Link
                to="/report"
                className="hover:text-white"
              >
                Report Scam
              </Link>

            </div>

          </div>


          <div className="border-t border-white/10 mt-8 pt-6 text-sm text-green-100">
            © 2026 AI Scam Shield. Stay Alert • Stay Safe.
          </div>

        </div>

      </footer>

    </div>
  );
}

export default Home;