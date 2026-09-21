import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import * as path from 'path';

let credentialInput: any;

if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  // Use the JSON string provided in the environment (for production)
  credentialInput = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
} else {
  // Fallback to local file for development
  credentialInput = path.join(
    process.cwd(),
    'firebase-service-account.json',
  );
}

const firebaseAdminApp =
  getApps().length === 0
    ? initializeApp({ credential: cert(credentialInput) })
    : getApp();

export const firebaseAdmin = firebaseAdminApp;
export const auth = getAuth(firebaseAdminApp);
