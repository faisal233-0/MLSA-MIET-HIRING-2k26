import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import rateLimit from "@/lib/rateLimit";
import { z } from "zod";

import { getHiringState } from "@/lib/timeline";

// Rate limiter: max 5 requests per IP + email per minute
const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

// Initialize Firebase Admin SDK
const initializeFirebaseAdmin = () => {
  try {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!serviceAccountString)
      throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON not set");

    const serviceAccount = JSON.parse(serviceAccountString);
    if (!getApps().length) initializeApp({ credential: cert(serviceAccount) });

    return getFirestore();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Firebase Admin SDK Initialization Error:", error.message);
    } else {
      console.error("Firebase Admin SDK Initialization Error:", error);
    }
    return null;
  }
};

const db = initializeFirebaseAdmin();

// Server-side gibberish detection (mirrors client-side logic)
function isGibberish(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 20) return false;

  if (/(.)\1{4,}/.test(trimmed)) return true;

  if (/[bcdfghjklmnpqrstvwxyz]{5,}/i.test(trimmed)) return true;

  return false;
}

// Zod schema for validation
const applicationSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phoneNumber: z.string().regex(/^[0-9]{10}$/),
  year: z.enum(["1", "2", "3", "4"]),
  branch: z.string().min(2),
  firstChoice: z.string().min(1),
  secondChoice: z.string().min(1),
  motivation: z
    .string()
    .min(20)
    .refine(val => !isGibberish(val), "Please write a genuine, meaningful response"),
  contribution: z
    .string()
    .min(20)
    .refine(val => !isGibberish(val), "Please write a genuine, meaningful response"),
  additionalInfo: z
    .string()
    .optional(),
  recaptchaToken: z.string().min(1),
});

export async function POST(request: Request) {
  if (!db) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    // Get session (app directory)
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
      });
    }

    const userEmail = session.user.email;

    // Validate hiring timeline (server-side check)
    const hiringState = getHiringState();
    if (hiringState === 'upcoming') {
      return NextResponse.json({ error: "Hiring has not started yet" }, { status: 400 });
    } else if (hiringState === 'closed') {
      return NextResponse.json({ error: "Registrations have closed" }, { status: 400 });
    }

    // Rate limiting by IP + user email
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "127.0.0.1";
    const limiterKey = `${ip}:${userEmail}`;
    try {
      await limiter.check(limiterKey, 5);
    } catch {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    // Parse request body
    const body = await request.json();

    // ✅ Zod validation
    const parsed = applicationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { recaptchaToken, ...formData } = parsed.data;

    // Verify reCAPTCHA
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    const verifyRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${secret}&response=${recaptchaToken}`,
      }
    );
    const verifyData = await verifyRes.json();
    if (!verifyData.success || verifyData.score < 0.5) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed" },
        { status: 400 }
      );
    }

    // Firestore submission check
    const submissionRef = db.collection("submissions").doc(userEmail);
    const existingSubmission = await submissionRef.get();
    if (existingSubmission.exists) {
      return NextResponse.json({ error: "Already submitted" }, { status: 400 });
    }

    // Save submission
    await submissionRef.set({
      ...formData,
      submittedAt: Timestamp.now(),
      userEmail,
    });

    return NextResponse.json(
      { message: "Application submitted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("POST /api/submit error:", error.message);
    } else {
      console.error("POST /api/submit unknown error:", error);
    }
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
