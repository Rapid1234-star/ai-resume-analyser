import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: Resume;
}) => {
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    const loadResume = async () => {
      const blob = await fs.read(imagePath);
      if (!blob) return;
      let url = URL.createObjectURL(blob);
      setResumeUrl(url);
    };
    loadResume();
  }, [imagePath]);

  const overallScore = feedback?.overallScore || 0;
  const scoreColor =
    overallScore >= 80 ? "#22c55e" : overallScore >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card hover:scale-102 hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 max-w-xl h-[800px] w-full bg-white rounded-3xl p-10 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] border border-[var(--card-border)] backdrop-blur-md"
    >
      <div className="resume-card-header grid grid-cols-[1fr_auto] gap-4 min-h-[80px] items-start">
        <div className="flex flex-col gap-3">
          {companyName && (
            <h2 className="text-2xl font-extrabold text-gray-900 break-words hover:text-[#4f46e5] transition-colors duration-300">
              {companyName}
            </h2>
          )}
          {jobTitle && (
            <h3 className="text-lg font-semibold text-gray-700 break-words">
              {jobTitle}
            </h3>
          )}
          {!companyName && !jobTitle && (
            <h2 className="text-2xl font-extrabold text-gray-900">Resume</h2>
          )}
        </div>
        <div className="flex-shrink-0 self-start">
          <ScoreCircle score={overallScore} />
        </div>
      </div>

      <div className="gradient-border animate-in fade-in duration-1000 mt-8">
        <div className="w-full h-full">
          {resumeUrl ? (
            <img
              src={resumeUrl}
              alt="resume"
              className="w-80 h-96 object-cover rounded-2xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] mb-2 hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] transition-shadow duration-300"
            />
          ) : (
            <div className="w-80 h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] mb-2 flex items-center justify-center animate-pulse">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2"></div>
                <div className="w-24 h-4 bg-gray-300 rounded mx-auto"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ResumeCard;
