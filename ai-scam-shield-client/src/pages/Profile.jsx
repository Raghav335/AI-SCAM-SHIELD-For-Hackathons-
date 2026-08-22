import { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/auth/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        setUser(data.user);
      } catch (error) {
        console.error("Profile Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5ed] flex items-center justify-center">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm px-8 py-7 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-green-50 flex items-center justify-center text-2xl animate-pulse">
            🛡️
          </div>

          <p className="text-[#214d3a] text-lg font-semibold mt-4">
            Loading profile...
          </p>

          <p className="text-slate-400 text-sm mt-1">
            Please wait a moment
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5ed] text-slate-800">

      {/* HEADER */}
      <header className="border-b border-green-900/10 bg-[#f7f5ed]/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-5 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-white border border-green-900/10 shadow-sm flex items-center justify-center text-2xl">
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

          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
            👤
          </div>

        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-10">

        {/* TITLE */}
        <div className="mb-7">

          <p className="text-sm font-semibold text-green-700">
            ACCOUNT
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold mt-2">
            My Profile
          </h2>

          <p className="text-slate-500 mt-2">
            Manage and view your AI Scam Shield account information.
          </p>

        </div>

        {user ? (

          <div className="grid lg:grid-cols-[280px_1fr] gap-6">

            {/* PROFILE CARD */}
            <div className="bg-[#214d3a] rounded-3xl p-7 text-white shadow-sm">

              <div className="w-24 h-24 mx-auto rounded-full bg-white/10 border-4 border-white/15 flex items-center justify-center text-4xl">
                👤
              </div>

              <h3 className="text-xl font-bold text-center mt-5 break-words">
                {user.name}
              </h3>

              <p className="text-green-50/70 text-sm text-center mt-2 break-all">
                {user.email}
              </p>

              <div className="mt-7 pt-6 border-t border-white/10">

                <div className="flex items-center justify-center gap-2 text-sm text-green-50/80">
                  <span>🛡️</span>
                  <span>Protected Account</span>
                </div>

              </div>

            </div>

            {/* INFORMATION CARD */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">

              <div className="flex items-center gap-3 mb-7">

                <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-xl">
                  👤
                </div>

                <div>
                  <h3 className="text-xl font-bold">
                    Personal Information
                  </h3>

                  <p className="text-sm text-slate-500">
                    Your registered account details
                  </p>
                </div>

              </div>

              {/* NAME */}
              <div className="rounded-2xl bg-[#fbfaf5] border border-slate-100 p-5">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                    👤
                  </div>

                  <div className="min-w-0">

                    <p className="text-xs text-slate-400 uppercase tracking-wide">
                      Name
                    </p>

                    <p className="text-lg font-semibold text-slate-800 mt-1 break-words">
                      {user.name}
                    </p>

                  </div>

                </div>

              </div>

              {/* EMAIL */}
              <div className="rounded-2xl bg-[#fbfaf5] border border-slate-100 p-5 mt-4">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                    ✉️
                  </div>

                  <div className="min-w-0">

                    <p className="text-xs text-slate-400 uppercase tracking-wide">
                      Email Address
                    </p>

                    <p className="text-lg font-semibold text-slate-800 mt-1 break-all">
                      {user.email}
                    </p>

                  </div>

                </div>

              </div>

              {/* SECURITY */}
              <div className="mt-6 bg-[#edf3eb] border border-green-900/5 rounded-2xl p-5">

                <div className="flex items-start gap-3">

                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                    🛡️
                  </div>

                  <div>

                    <p className="font-bold text-slate-800">
                      AI Scam Shield Protection
                    </p>

                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Your account gives you access to scam detection tools
                      for suspicious URLs, images and QR codes.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        ) : (

          /* ERROR */
          <div className="bg-white border border-red-100 rounded-3xl shadow-sm p-8 text-center">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 flex items-center justify-center text-3xl">
              ⚠️
            </div>

            <h3 className="text-xl font-bold text-slate-800 mt-5">
              Unable to load profile
            </h3>

            <p className="text-slate-500 mt-2">
              Please try again later or login again.
            </p>

          </div>

        )}

      </main>
    </div>
  );
}

export default Profile;