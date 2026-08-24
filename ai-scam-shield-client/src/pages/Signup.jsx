import { useState } from "react";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("https://ai-scam-shield-upkl.onrender.com/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Account created successfully!");

      console.log("User:", data.user);
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Unable to connect to server");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5ed] text-slate-800 flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6 items-stretch">

        {/* BRAND / SECURITY PANEL */}
        <div className="hidden lg:flex bg-[#214d3a] rounded-[2rem] p-10 text-white flex-col justify-between shadow-sm overflow-hidden relative">
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-3xl">
              🛡️
            </div>

            <p className="mt-8 text-sm font-semibold text-green-100">
              AI SCAM SHIELD
            </p>

            <h1 className="text-4xl font-bold leading-tight mt-3">
              Build a safer digital experience.
            </h1>

            <p className="text-green-50/75 mt-5 leading-relaxed max-w-md">
              Create your account and scan suspicious links, images and QR
              codes before you trust them.
            </p>
          </div>

          <div className="relative z-10 space-y-3 mt-10">
            <div className="flex items-center gap-3 bg-white/10 rounded-2xl p-4 border border-white/10">
              <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                🔗
              </span>
              <span className="text-sm">URL threat detection</span>
            </div>

            <div className="flex items-center gap-3 bg-white/10 rounded-2xl p-4 border border-white/10">
              <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                🖼️
              </span>
              <span className="text-sm">AI image analysis</span>
            </div>

            <div className="flex items-center gap-3 bg-white/10 rounded-2xl p-4 border border-white/10">
              <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                ▦
              </span>
              <span className="text-sm">QR code security scan</span>
            </div>
          </div>

          <div className="absolute -right-24 -bottom-24 w-72 h-72 rounded-full border border-white/10" />
          <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full border border-white/10" />
        </div>

        {/* SIGNUP CARD */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-7 sm:p-10 flex flex-col justify-center">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-2xl">
              🛡️
            </div>

            <div>
              <h1 className="font-bold text-lg">AI Scam Shield</h1>
              <p className="text-xs text-slate-500">
                Don't trust it. Scan it.
              </p>
            </div>
          </div>

          <div className="mb-7">
            <p className="text-sm font-semibold text-green-700">
              GET STARTED
            </p>

            <h2 className="text-3xl font-bold mt-2">
              Create your account
            </h2>

            <p className="text-slate-500 mt-2">
              Join AI Scam Shield and make safer decisions online.
            </p>
          </div>

          {/* NAME */}
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Full Name
            </label>

            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#fbfaf5] px-4 focus-within:border-green-700/30 focus-within:ring-4 focus-within:ring-green-100/60 transition">
              <span className="text-slate-400">👤</span>

              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent py-3.5 outline-none text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="mt-5">
            <label className="text-sm font-semibold text-slate-700">
              Email Address
            </label>

            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#fbfaf5] px-4 focus-within:border-green-700/30 focus-within:ring-4 focus-within:ring-green-100/60 transition">
              <span className="text-slate-400">✉️</span>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent py-3.5 outline-none text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="mt-5">
            <label className="text-sm font-semibold text-slate-700">
              Password
            </label>

            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#fbfaf5] px-4 focus-within:border-green-700/30 focus-within:ring-4 focus-within:ring-green-100/60 transition">
              <span className="text-slate-400">🔒</span>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent py-3.5 outline-none text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* SIGN UP */}
          <button
            onClick={handleSignup}
            className="w-full mt-7 bg-[#214d3a] hover:bg-[#183d2d] text-white py-4 rounded-2xl font-semibold shadow-sm transition flex items-center justify-center gap-2"
          >
            Create Account
            <span>→</span>
          </button>

          <div className="mt-6 flex items-center gap-3 text-xs text-slate-400">
            <div className="h-px bg-slate-200 flex-1" />
            <span>SECURE SIGNUP</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-500">
            <span>🛡️</span>
            <span>Your security is our priority.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;