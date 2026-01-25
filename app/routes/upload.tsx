import React from "react";
import ProperNavbar from "~/components/ProperNavbar";
import AuthGuard from "~/components/AuthGuard";
import { useState } from "react";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate, Link } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2image";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "./../../constants/index";

const upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setIsProcessing(true);
    setStatusText("Uploading the file...");

    const uploadedFile = await fs.upload([file]);

    if (!uploadedFile) {
      setIsProcessing(false);
      return setStatusText("Error uploading file");
    }

    setStatusText("Converting to image and extracting text...");

    const conversionResult = await convertPdfToImage(file);

    if (!conversionResult || !conversionResult.file || !conversionResult.text) {
      setIsProcessing(false);
      return setStatusText("Error converting to image or extracting text");
    }

    const { file: imageFile, text: resumeText } = conversionResult;

    setStatusText("Uploading the image...");

    const uploadedImage = await fs.upload([imageFile]);

    if (!uploadedImage) {
      setIsProcessing(false);
      return setStatusText("Error uploading image");
    }

    setStatusText("Preparing data...");

    const uuid = generateUUID();

    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: {},
    };
    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setStatusText("Analyzing...");

    const feedback = await ai.feedback(
      resumeText,
      prepareInstructions({ jobTitle, jobDescription }),
    );
    if (!feedback) {
      return setStatusText("Error: Failed to analyze resume");
    }

    const feedbackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;

    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setStatusText("Analysis complete, redirecting...");
    console.log(data);
    navigate(`/resume/${uuid}`);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file) return;

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };
  return (
    <AuthGuard requireAuth={true}>
      <main className="bg-gradient-to-b from-white via-blue-50/80 to-indigo-50/60 min-h-screen">
        <ProperNavbar />
        <section className="w-full max-w-4xl mx-auto px-6 py-16">
          <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl p-12">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Smart Feedback For Your Dream Job
              </h1>
              {isProcessing ? (
                <>
                  <p className="text-lg text-gray-700 mb-6">{statusText}</p>
                  <div className="flex justify-center">
                    <img
                      src="/images/resume-scan.gif"
                      className="w-full max-w-md"
                      alt="Processing"
                    />
                  </div>
                </>
              ) : (
                <p className="text-lg text-gray-700 mb-6">
                  Drop your resume for ATS score and improvement tips
                </p>
              )}
            </div>

            {!isProcessing && (
              <form
                id="upload-form"
                onSubmit={handleSubmit}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="form-div">
                    <label
                      htmlFor="company-name"
                      className="block text-sm font-medium text-gray-700 mb-3"
                    >
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="company-name"
                      placeholder="Enter company name"
                      id="company-name"
                      className="w-full p-5 text-lg inset-shadow rounded-2xl focus:outline-none bg-white border border-gray-200 focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="form-div">
                    <label
                      htmlFor="job-title"
                      className="block text-sm font-medium text-gray-700 mb-3"
                    >
                      Job Title
                    </label>
                    <input
                      type="text"
                      name="job-title"
                      placeholder="Enter job title"
                      id="job-title"
                      className="w-full p-5 text-lg inset-shadow rounded-2xl focus:outline-none bg-white border border-gray-200 focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="form-div">
                  <label
                    htmlFor="job-description"
                    className="block text-sm font-medium text-gray-700 mb-3"
                  >
                    Job Description
                  </label>
                  <textarea
                    rows={6}
                    name="job-description"
                    placeholder="Paste the job description here..."
                    id="job-description"
                    className="w-full p-5 text-lg inset-shadow rounded-2xl focus:outline-none bg-white border border-gray-200 focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div className="form-div">
                  <label
                    htmlFor="uploader"
                    className="block text-sm font-medium text-gray-700 mb-3"
                  >
                    Upload Resume (PDF)
                  </label>
                  <FileUploader
                    onFileSelect={handleFileSelect}
                    selectedFile={file}
                  />
                </div>

                <div className="flex justify-center pt-4 space-x-4">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] hover:from-[#4338ca] hover:to-[#6b21a8] text-white font-semibold py-5 px-10 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)]"
                  >
                    Analyze Resume
                  </button>
                  <Link
                    to="/hero"
                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Back to Home
                  </Link>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>
    </AuthGuard>
  );
};

export default upload;
