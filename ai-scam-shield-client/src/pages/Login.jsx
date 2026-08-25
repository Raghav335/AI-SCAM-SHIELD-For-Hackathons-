import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://ai-scam-shield-upkl.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password.");
        setLoading(false);
        return;
      }

      login(data.token);

      console.log("Logged in user:", data.user);

      navigate("/");
    } catch (error) {
      console.error("Login Error:", error);

      setError("Unable to connect to server. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5ed] text-slate-800 flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6 items-stretch">

        {/* LEFT BRAND PANEL */}
        <div className="hidden lg:flex bg-[#214d3a] rounded-[2rem] p-10 text-white flex-col justify-between shadow-sm overflow-hidden relative">

          <div className="relative z-10">

            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-3xl">
              🛡️
            </div>

            <p className="mt-8 text-sm font-semibold text-green-100">
              AI SCAM SHIELD
            </p>

            <h1 className="text-4xl font-bold leading-tight mt-3">
              Stay one step ahead of online scams.
            </h1>

            <p className="text-green-50/75 mt-5 leading-relaxed max-w-md">
              Scan suspicious links, images and QR codes before you trust
              them.
            </p>

          </div>

          {/* FEATURES */}
          <div className="relative z-10 space-y-3 mt-10">

            <div className="flex items-center gap-3 bg-white/10 rounded-2xl p-4 border border-white/10">
              <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                🔗
              </span>

              <span className="text-sm">
                URL threat detection
              </span>
            </div>

            <div className="flex items-center gap-3 bg-white/10 rounded-2xl p-4 border border-white/10">
              <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                🖼️
              </span>

              <span className="text-sm">
                AI image analysis
              </span>
            </div>

            <div className="flex items-center gap-3 bg-white/10 rounded-2xl p-4 border border-white/10">
              <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                ▦
              </span>

              <span className="text-sm">
                QR code security scan
              </span>
            </div>

          </div>

          {/* DECORATION */}
          <div className="absolute -right-24 -bottom-24 w-72 h-72 rounded-full border border-white/10" />

          <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full border border-white/10" />

        </div>

        {/* LOGIN CARD */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-7 sm:p-10 flex flex-col justify-center">

          {/* MOBILE LOGO */}
          <div className="lg:hidden flex items-center gap-3 mb-8">

            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-2xl">
              🛡️
            </div>

            <div>

              <h1 className="font-bold text-lg">
                AI Scam Shield
              </h1>

              <p className="text-xs text-slate-500">
                Don't trust it. Scan it.
              </p>

            </div>

          </div>

          {/* TITLE */}
          <div className="mb-7">

            <p className="text-sm font-semibold text-green-700">
              WELCOME BACK
            </p>

            <h2 className="text-3xl font-bold mt-2">
              Login to your account
            </h2>

            <p className="text-slate-500 mt-2">
              Continue protecting yourself from suspicious online activity.
            </p>

          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-4 flex items-start gap-3">

              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0">
                ⚠️
              </div>

              <div>

                <p className="font-semibold text-red-700">
                  Login Failed
                </p>

                <p className="text-sm text-red-600 mt-1">
                  {error}
                </p>

              </div>

            </div>
          )}

          {/* EMAIL */}
          <div>

            <label className="text-sm font-semibold text-slate-700">
              Email Address
            </label>

            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#fbfaf5] px-4 focus-within:border-green-700/30 focus-within:ring-4 focus-within:ring-green-100/60 transition">

              <span className="text-slate-400">
                ✉️
              </span>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent py-3.5 outline-none text-slate-800 placeholder:text-slate-400 disabled:opacity-60"
              />

            </div>

          </div>

          {/* PASSWORD */}
          <div className="mt-5">

            <label className="text-sm font-semibold text-slate-700">
              Password
            </label>

            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#fbfaf5] px-4 focus-within:border-green-700/30 focus-within:ring-4 focus-within:ring-green-100/60 transition">

              <span className="text-slate-400">
                🔒
              </span>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    handleLogin();
                  }
                }}
                className="w-full bg-transparent py-3.5 outline-none text-slate-800 placeholder:text-slate-400 disabled:opacity-60"
              />

            </div>

          </div>

          {/* LOGIN BUTTON */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full mt-7 text-white py-4 rounded-2xl font-semibold shadow-sm transition flex items-center justify-center gap-3 ${
              loading
                ? "bg-[#183d2d] cursor-not-allowed"
                : "bg-[#214d3a] hover:bg-[#183d2d]"
            }`}
          >

            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>

                <span>
                  Signing in...
                </span>
              </>
            ) : (
              <>
                <span>
                  Login
                </span>

                <span>
                  →
                </span>
              </>
            )}

          </button>

          {/* SIGNUP OPTION */}
          <div className="mt-6 text-center">

            <p className="text-sm text-slate-500">
              Don't have an account?{" "}

              <Link
                to="/signup"
                className="font-semibold text-green-700 hover:text-green-800 transition"
              >
                Sign Up
              </Link>

            </p>

          </div>

          {/* DIVIDER */}
          <div className="mt-6 flex items-center gap-3 text-xs text-slate-400">

            <div className="h-px bg-slate-200 flex-1" />

            <span>
              SECURE ACCESS
            </span>

            <div className="h-px bg-slate-200 flex-1" />

          </div>

          {/* SECURITY MESSAGE */}
          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-500">

            <span>
              🛡️
            </span>

            <span>
              Your account is protected by AI Scam Shield.
            </span>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;