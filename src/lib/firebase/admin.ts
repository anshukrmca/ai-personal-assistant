import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import path from 'path';
import fs from 'fs';

function getAdminApp(): App {
  if (getApps().length) {
    return getApps()[0];
  }

  // Try loading from JSON file first (most reliable)
  const jsonPath = path.join(process.cwd(), 'firebase-service-account.json');

  if (fs.existsSync(jsonPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    console.log('Firebase Admin: Loaded from service account JSON file');
    return initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });
  }

  // Fallback to env vars
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKeyRaw) {
    throw new Error(
      'Firebase Admin SDK not configured. Place firebase-service-account.json in project root OR set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env.local'
    );
  }

  const privateKey = privateKeyRaw.replace(/\\n/g, '\n');
  console.log('Firebase Admin: Loaded from env vars, projectId:', projectId);

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    projectId,
  });
}

export const adminAuth = getAuth(getAdminApp());
