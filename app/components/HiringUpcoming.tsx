import Link from "next/link";

export default function HiringUpcoming() {
  return (
    <div className="text-center flex flex-col items-center justify-center p-8">
      <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-16 h-16 text-blue-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-white">
        Hiring Opens Soon!
      </h1>
      <p className="text-slate-300 mt-4 text-lg">
        Volunteer hiring has not started yet. Applications open on August 17th, 2026.
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
