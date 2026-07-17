"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    grecaptcha?: {
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
    };
  }
}

// Define the structure of form data and errors for better type safety
type FormData = {
  fullName: string;
  email: string;
  phoneNumber: string;
  year: string;
  branch: string;
  firstChoice: string;
  secondChoice: string;
  motivation: string;
  contribution: string;
  additionalInfo: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;


export default function JoinForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [submissionStatus, setSubmissionStatus] = useState<
    "loading" | "submitted" | "not_submitted"
  >("loading");
  
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    year: "",
    branch: "",
    firstChoice: "",
    secondChoice: "",
    motivation: "",
    contribution: "",
    additionalInfo: "",
  });

  // State to hold validation errors
  const [errors, setErrors] = useState<FormErrors>({});
  
  const domainOptions = [
    "Event Planning and Coordination",
    "Public Relation and Outreach",
    "Graphic Design and Visual Content",
    "Photography and Media Coverage",
    "Content Writing and Editorial",
    "Web Dev and Management",
    "Video Production and Editing",
    "Social Media Strategy and Management",
    "Workflow Management",
  ];

  const isAdmin = useCallback(() => {
    if (!session || !session.user?.email) return false;
    const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",") || [];
    return adminEmails.includes(session.user.email);
  }, [session]);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (isAdmin()) {
        router.push("/admin");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        email: session.user.email || "",
        fullName: session.user.name || "",
      }));

      const checkStatus = async () => {
        try {
          const res = await fetch("/api/check-submission");
          if (!res.ok) throw new Error("Failed to check status");
          const data = await res.json();
          setSubmissionStatus(
            data.hasSubmitted ? "submitted" : "not_submitted"
          );
        } catch (error) {
          console.error("Failed to check submission status:", error);
          setSubmissionStatus("not_submitted");
        }
      };
      checkStatus();
    }
  }, [session, status, router, isAdmin]);

  // Central validation function
  const validateField = (name: keyof FormData, value: string, currentFormData: FormData): string => {
    switch (name) {
      case "phoneNumber":
        return /^[0-9]{10}$/.test(value) ? "" : "Phone number must be exactly 10 digits.";
      case "secondChoice":
        return currentFormData.firstChoice && value === currentFormData.firstChoice
          ? "Second choice must be different from the first."
          : "";
      default:
        return ""; // No validation for other fields
    }
  };


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target as { name: keyof FormData, value: string };
    
    // Update form data first
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    // Validate the changed field and update its error status
    const error = validateField(name, value, updatedFormData);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields before submitting
    const validationErrors = Object.keys(formData).reduce((acc, key) => {
        const fieldName = key as keyof FormData;
        const error = validateField(fieldName, formData[fieldName], formData);
        if (error) {
            acc[fieldName] = error;
        }
        return acc;
    }, {} as FormErrors);


    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      alert("Please correct the errors before submitting.");
      return;
    }
    
    // Clear errors on successful validation before proceeding
    setErrors({});

    try {
      // Get reCAPTCHA token
      const token = await window.grecaptcha?.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
        { action: "submit" }
      );

      if (!token) throw new Error("reCAPTCHA token not available");

      const response = await fetch("/api/submit-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, recaptchaToken: token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Network response was not ok");
      }
      
      setSubmissionStatus("submitted");
    } catch (error) {
      console.error("Failed to submit form:", error);
      alert(
        `There was an error submitting your application: ${error instanceof Error ? error.message : String(error)}. Please try again.`
      );
    }
  };

  if (status === "loading" || submissionStatus === "loading") {
    return <p className="text-center text-slate-400">Loading...</p>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        <p className="text-xl text-slate-400 mb-8">
          You must be signed in to view this page.
        </p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/join" })}
          className="bg-blue-600 text-white font-bold text-lg px-8 py-3 rounded-lg hover:bg-blue-700"
        >
          Sign In with Google
        </button>
      </div>
    );
  }

  if (submissionStatus === "submitted") {
    return (
      <div className="text-center flex flex-col items-center justify-center p-8">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-16 h-16 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Application Submitted!
        </h1>
        <p className="text-slate-300 mt-4 text-lg">
          Thank you for applying. Good luck! :)
        </p>
        <Link
          href="/"
          className="inline-block mt-10 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/40 hover:scale-105 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
        >
          &larr; Go back to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold">Join Our Community</h1>
        <p className="text-slate-400 mt-2">
          Fill out the form to start your journey with us.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Full Name & Email */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-2">
              1. Full Name
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              2. Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              disabled
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-300 mb-2">
            3. Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            maxLength={10}
            pattern="[0-9]{10}"
            className={`w-full bg-slate-900/50 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.phoneNumber ? 'border-red-500' : 'border-slate-700'}`}
          />
            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
        </div>

        {/* Year & Branch */}
        <div className="grid md:grid-cols-2 gap-6">
            <div>
                 <label htmlFor="year" className="block text-sm font-medium text-slate-300 mb-2">
                    4. Year of Study
                </label>
                <select
                    name="year"
                    id="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                </select>
            </div>
            <div>
                 <label htmlFor="branch" className="block text-sm font-medium text-slate-300 mb-2">
                    5. Branch
                </label>
                <input
                    type="text"
                    name="branch"
                    id="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>
        </div>

        {/* Domain Choices */}
        <div className="grid md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="firstChoice" className="block text-sm font-medium text-slate-300 mb-2">
                    6. First Choice - Which domain you want to join?
                </label>
                <select
                    name="firstChoice"
                    id="firstChoice"
                    value={formData.firstChoice}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                    <option value="">Select Domain</option>
                    {domainOptions.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                </select>
            </div>
            <div>
                <label htmlFor="secondChoice" className="block text-sm font-medium text-slate-300 mb-2">
                    7. Second Choice - Which domain you want to join?
                </label>
                <select
                    name="secondChoice"
                    id="secondChoice"
                    value={formData.secondChoice}
                    onChange={handleChange}
                    required
                    className={`w-full bg-slate-900/50 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.secondChoice ? 'border-red-500' : 'border-slate-700'}`}
                >
                    <option value="">Select Domain</option>
                    {domainOptions.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                </select>
                {errors.secondChoice && <p className="text-red-500 text-sm mt-1">{errors.secondChoice}</p>}
            </div>
        </div>
        
        {/* ... Rest of your form fields ... */}
        {/* Motivation Textarea */}
        <div>
            <label htmlFor="motivation" className="block text-sm font-medium text-slate-300 mb-2">
                8. What motivated you to volunteer...?
            </label>
            <textarea
                name="motivation"
                id="motivation"
                rows={4}
                value={formData.motivation}
                onChange={handleChange}
                required
                // MODIFIED: Added conditional styling for the border
                className={`w-full bg-slate-900/50 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.motivation ? 'border-red-500' : 'border-slate-700'}`}
            ></textarea>
            {errors.motivation && <p className="text-red-500 text-sm mt-1">{errors.motivation}</p>}
        </div>
  {/* Contribution Textarea */}
        <div>
            <label htmlFor="contribution" className="block text-sm font-medium text-slate-300 mb-2">
                9. In what ways do you see yourself contributing...?
            </label>
            <textarea
                name="contribution"
                id="contribution"
                rows={4}
                value={formData.contribution}
                onChange={handleChange}
                required
                // MODIFIED: Added conditional styling for the border
                className={`w-full bg-slate-900/50 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.contribution ? 'border-red-500' : 'border-slate-700'}`}
            ></textarea>

            {/* ADD THIS LINE: To display the error message */}
            {errors.contribution && <p className="text-red-500 text-sm mt-1">{errors.contribution}</p>}
        </div>

        {/* Additional Info Textarea */}
        <div>
            <label htmlFor="additionalInfo" className="block text-sm font-medium text-slate-300 mb-2">
                10. Any additional information you would like to share.
            </label>
            <textarea
                name="additionalInfo"
                id="additionalInfo"
                rows={4}
                value={formData.additionalInfo}
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            ></textarea>
             <h2 className="text-sm text-slate-400 text-left italic mt-2">
                 Note: Feel free to share your resume, portfolio, project links, designs or any other work samples that can help us assess your skills and suitability for the domain you have selected.
             </h2>
        </div>

        <div className="text-center pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white font-bold text-lg px-10 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.7)]"
          >
            Submit Application
          </button>
        </div>
      </form>
    </>
  );
}