import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const { language, changeLanguage, t } = useLanguage();

  const token = localStorage.getItem("token");

  const navItems = [
    { name: t.home, path: "/" },
    { name: t.dashboard, path: "/dashboard" },
    { name: t.scanner, path: "/scanner" },
   { name: t.payment, path: "/payment-scanner" },
{ name: t.whatsapp, path: "/whatsapp-scanner" },
{ name: t.aiAssistant, path: "/chatbot" },
{ name: t.knowledgeBase, path: "/knowledge-base" },
    { name: t.report, path: "/report-scam" },
    //{ name: t.report, path: "/deepfake" },
    
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#f7f5ed]/95 backdrop-blur-xl border-b border-slate-200">

      <div className="max-w-7xl mx-auto px-5 py-3">

        <div className="flex items-center justify-between gap-5">

          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-3 shrink-0"
          >
            <div className="w-11 h-11 rounded-xl bg-[#214d3a] flex items-center justify-center shadow-sm">
              <span className="text-2xl">
                🛡️
              </span>
            </div>

            <div className="hidden sm:block">
              <h1 className="font-bold text-lg text-slate-800">
                AI Scam Shield
              </h1>

              <p className="text-[10px] uppercase tracking-widest text-slate-500">
                Stay Safe
              </p>
            </div>
          </Link>


          {/* DESKTOP NAVIGATION */}
          <div className="hidden xl:flex items-center gap-1">

            {navItems.map((item) => {

              const isActive =
                location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-[#214d3a] text-white shadow-sm"
                      : "text-slate-600 hover:bg-white hover:text-[#214d3a]"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

          </div>


          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2">

            {/* LANGUAGE SELECTOR */}
            <div className="flex items-center gap-1">

              <span className="hidden lg:block text-sm">
                🌐
              </span>

              <select
                value={language}
                onChange={(e) =>
                  changeLanguage(e.target.value)
                }
                className="
                  bg-white
                  border
                  border-slate-200
                  rounded-lg
                  px-2
                  py-2
                  text-sm
                  text-slate-700
                  font-medium
                  outline-none
                  cursor-pointer
                  hover:border-[#214d3a]
                  focus:border-[#214d3a]
                "
              >
                <option value="en">
                  English
                </option>

                <option value="hi">
                  हिंदी
                </option>
              </select>

            </div>


            {/* MOBILE SCANNER */}
            <Link
              to="/scanner"
              className="hidden md:flex xl:hidden px-4 py-2 rounded-lg bg-[#214d3a] text-white text-sm font-semibold"
            >
              🛡️ {t.scanner}
            </Link>


            {/* PROFILE */}
            {token && (
              <Link
                to="/profile"
                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition ${
                  location.pathname === "/profile"
                    ? "bg-green-50 border-green-300"
                    : "bg-white border-slate-200 hover:bg-green-50"
                }`}
              >
                👤
              </Link>
            )}


            {/* LOGIN / LOGOUT */}
            {token ? (

              <button
                onClick={handleLogout}
                className="hidden sm:block px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition text-sm font-semibold"
              >
                {t.logout}
              </button>

            ) : (

              <Link
                to="/login"
                className="px-5 py-2 rounded-lg bg-[#214d3a] text-white hover:bg-[#183d2d] transition text-sm font-semibold"
              >
                {t.login}
              </Link>

            )}

          </div>

        </div>


        {/* MOBILE NAVIGATION */}
        <div className="xl:hidden flex gap-2 overflow-x-auto mt-3 pb-1">

          {navItems.map((item) => {

            const isActive =
              location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`whitespace-nowrap px-3 py-2 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? "bg-[#214d3a] text-white"
                    : "bg-white text-slate-600 border border-slate-200"
                }`}
              >
                {item.name}
              </Link>
            );
          })}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;