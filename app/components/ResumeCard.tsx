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
      className="resume-card hover:scale-102 hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 max-w-lg h-[700px] w-full bg-white rounded-3xl p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] border border-[var(--card-border)] backdrop-blur-md"
    >
      <div className="resume-card-header flex justify-between items-start">
        <div className="flex flex-col gap-2">
          {companyName && (
            <h2 className="text-2xl font-bold text-gray-900 break-words hover:text-[#4f46e5] transition-colors duration-300">
              {companyName}
            </h2>
          )}
          {jobTitle && (
            <h3 className="text-lg break-words text-gray-600 font-medium">
              {jobTitle}
            </h3>
          )}
          {!companyName && !jobTitle && (
            <h2 className="text-2xl font-bold text-gray-900">Resume</h2>
          )}
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={overallScore} />
        </div>
      </div>

      <div className="gradient-border animate-in fade-in duration-1000 mt-6">
        <div className="w-full h-full">
          {resumeUrl ? (
            <img
              src={resumeUrl}
              alt="resume"
              className="w-60 h-72 object-cover rounded-2xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] mb-4 hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] transition-shadow duration-300"
            />
          ) : (
            <div className="w-60 h-72 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] mb-4 flex items-center justify-center animate-pulse">
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
