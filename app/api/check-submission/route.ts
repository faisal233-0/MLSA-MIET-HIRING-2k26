import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";

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
    
    console.log("✅ Firebase Admin SDK initialized successfully in check-submission.");
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

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const userEmail = session.user.email;
    const submissionRef = db.collection("submissions").doc(userEmail);
    const docSnap = await submissionRef.get();

    return NextResponse.json({ hasSubmitted: docSnap.exists });
  } catch (error) {
    console.error("Error checking submission status:", error);
    return NextResponse.json(
      { error: "Failed to check submission status." },
      { status: 500 }
    );
  }
}