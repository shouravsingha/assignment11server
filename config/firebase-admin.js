import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("✅ Firebase Admin initialized successfully");
    } catch (error) {
        console.error("❌ Firebase Admin initialization failed:", error.message);
        console.warn("Please check your FIREBASE_PRIVATE_KEY in the .env file.");
    }
} else {
    console.warn('Firebase Admin not initialized. Missing environment variables.');
}

export default admin;
