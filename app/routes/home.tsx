import type { Route } from "./+types/home";
import ProperNavbar from "../components/ProperNavbar";
import ResumeCard from "~/components/ResumeCard";
import AuthGuard from "~/components/AuthGuard";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart Feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResume, setLoadingResume] = useState(false);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResume(true);
      const resumes = (await kv.list("resume:*", true)) as KVItem[];

      const parsedResumes = resumes?.map(
        (resume) => JSON.parse(resume.value) as Resume
      );

      console.log("Parsed resumes: ", parsedResumes);
      setResumes(parsedResumes || []);
      setLoadingResume(false);
    };
    loadResumes();
  }, []);

  return (
    <AuthGuard requireAuth={true}>
      <main className="bg-gradient-to-b from-white via-blue-50/80 to-indigo-50/60">
        <ProperNavbar />
        <section className="main-section">
          <div className="page-heading py-16">
            <h1>Track Your Applications & Resume Ratings</h1>
            {!loadingResume && resumes.length === 0 ? (
              <h2>No resumes found. Upload your first resume to get feedback</h2>
            ) : (
              <h2>Review your submissions and check AI-powered feedbacks</h2>
            )}
          </div>
          {loadingResume && (
            <div className="flex flex-col items-center justify-center">
              <img src="/images/resume-scan-2.gif" className="w-[200]px" />
            </div>
          )}

          {!loadingResume && resumes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto px-8 py-12">
              {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
              ))}
            </div>
          )}
          {!loadingResume && resumes.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-10 gap-4">
              <Link
                to="/upload"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Upload Resume
              </Link>
              <Link
                to="/hero"
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-6 rounded-full text-base transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Back to Home
              </Link>
            </div>
          )}
        </section>
      </main>
    </AuthGuard>
  );
}
