import { use, useEffect } from "react";
import { usePuterStore } from "~/lib/puter";
import { useLocation } from "react-router";
import { useNavigate } from "react-router";
import ProperNavbar from "~/components/ProperNavbar";

export const meta = () => [
  { title: "Resumind | Auth" },
  { name: "description", content: "Log into your account" },
];

const auth = () => {
    const { isLoading, auth: authStore } = usePuterStore();
    const location = useLocation();
    const next = location.search.split("next=")[1] || "/dashboard";
    const navigate = useNavigate();

    useEffect(() => {
        // Force fresh state check - if authenticated, go to hero
        if (authStore.isAuthenticated) {
            navigate('/hero', { replace: true });
        }
    }, [authStore.isAuthenticated, location.pathname]);

  return (
    <main className="bg-gradient-to-b from-white/80 via-blue-50/60 to-indigo-50/40 min-h-screen flex items-center justify-center backdrop-blur-sm">
      <ProperNavbar />
      <div className="bg-white/98 backdrop-blur-2xl shadow-3xl rounded-3xl p-12 max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out">
        <section className="flex flex-col gap-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Welcome
            </h1>
            <h2 className="text-xl md:text-2xl text-gray-700 font-medium">Log In To Continue Your Job Journey</h2>
          </div>
          <div className="flex justify-center">
            {isLoading ? (
              <button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-5 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg animate-pulse">
                <p className="text-lg">Signing you in...</p>
              </button>
            ) : (
              <>
                {authStore.isAuthenticated ? (
                  <button
                    className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-5 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                    onClick={async () => {
                      await authStore.signOut();
                      navigate('/hero');
                    }}
                  >
                    <p className="text-lg">Log Out</p>
                  </button>
                ) : (
                  <button
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-5 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                    onClick={authStore.signIn}
                  >
                    <p className="text-lg">Log In</p>
                  </button>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default auth;
