import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";

// Submission type definition
type Submission = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  year: string;
  branch: string;
  firstChoice: string;
  secondChoice: string;
  motivation: string;
  contribution: string;
  additionalInfo?: string;
  submittedAt?: {
    seconds: number;
    nanoseconds: number;
  } | null;
};

// Function to initialize Firebase Admin SDK
const initializeFirebaseAdmin = () => {
  try {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!serviceAccountString) {
      throw new Error("The FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set.");
    }
    
    const serviceAccount = JSON.parse(serviceAccountString);

    if (!getApps().length) {
      initializeApp({
        credential: cert(serviceAccount),
      });
    }
    
    console.log("✅ Firebase Admin SDK initialized successfully in get-submissions.");
    return getFirestore();
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Firebase Admin SDK Initialization Error:", error.message);
    } else {
      console.error("❌ Unknown error initializing Firebase Admin SDK:", error);
    }
    return null; // Return null on failure
  }
};

const db = initializeFirebaseAdmin();

export async function GET() {
  // Crucial Check: If DB initialization failed, return an error.
  if (!db) {
    return NextResponse.json(
      { error: "Server configuration error. Please try again later." },
      { status: 500 }
    );
  }

  const session = await getServerSession(authOptions);
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",") || [];

  // Security check — must be logged in AND an admin
  if (!session || !session.user?.email || !adminEmails.includes(session.user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const submissionsRef = db.collection("submissions");
    const snapshot = await submissionsRef.get();

    if (snapshot.empty) {
      return NextResponse.json([]);
    }

    const submissions: Submission[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        submittedAt:
          data.submittedAt && data.submittedAt.seconds
            ? {
                seconds: data.submittedAt.seconds,
                nanoseconds: data.submittedAt.nanoseconds,
              }
            : null,
      } as Submission;
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions." },
      { status: 500 }
    );
  }
}