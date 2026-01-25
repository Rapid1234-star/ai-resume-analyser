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
    <main className="bg-gradient-to-b from-white via-blue-50/80 to-indigo-50/60 min-h-screen flex items-center justify-center">
      <ProperNavbar />
      <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl p-8">
        <section className="flex flex-col gap-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Welcome</h1>
            <h2 className="text-lg md:text-xl text-gray-700">Log In To Continue Your Job Journey</h2>
          </div>
          <div className="flex justify-center">
            {isLoading ? (
              <button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg animate-pulse">
                <p>Signing you in...</p>
              </button>
            ) : (
              <>
                {authStore.isAuthenticated ? (
                  <button
                    className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                    onClick={async () => {
                      await authStore.signOut();
                      navigate('/hero');
                    }}
                  >
                    <p>Log Out</p>
                  </button>
                ) : (
                  <button
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                    onClick={authStore.signIn}
                  >
                    <p>Log In</p>
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
