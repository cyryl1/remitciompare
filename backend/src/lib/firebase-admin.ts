import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import * as path from 'path';

const credentialPath = path.join(
  process.cwd(),
  'firebase-service-account.json',
);

const firebaseAdminApp =
  getApps().length === 0
    ? initializeApp({ credential: cert(credentialPath) })
    : getApp();

export const firebaseAdmin = firebaseAdminApp;
export const auth = getAuth(firebaseAdminApp);
