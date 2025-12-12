import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  type GenerateRegistrationOptionsOpts,
  type GenerateAuthenticationOptionsOpts,
} from '@simplewebauthn/server';

const rpID = process.env.NODE_ENV === 'production' 
  ? process.env.FRONTEND_DOMAIN || 'localhost'
  : 'localhost';

const rpName = 'Computerestic Student Academic System';

const expectedOrigin = process.env.NODE_ENV === 'production'
  ? process.env.FRONTEND_URL || 'http://localhost:5173'
  : 'http://localhost:5173';

// Minimal in-memory challenge store (for demo)
const pendingChallenges: Record<string, string> = {};

export function startRegister(studentId: string) {
  const options: GenerateRegistrationOptionsOpts = {
    rpID,
    rpName,
    userName: studentId,
    userID: studentId,
    attestationType: 'none',
    authenticatorSelection: { userVerification: 'required', authenticatorAttachment: 'platform' },
  } as any;
  const opts = generateRegistrationOptions(options);
  pendingChallenges[`reg:${studentId}`] = (opts as any).challenge;
  return opts;
}

export async function finishRegister(studentId: string, response: any) {
  const challenge = pendingChallenges[`reg:${studentId}`];
  if (!challenge) throw new Error('No registration in progress');
  const { verified } = await verifyRegistrationResponse({
    response,
    expectedChallenge: challenge,
    expectedOrigin,
    expectedRPID: rpID,
  } as any);
  if (!verified) throw new Error('Registration failed');
  delete pendingChallenges[`reg:${studentId}`];
  return true;
}

export function startAuth(studentId: string) {
  const options: GenerateAuthenticationOptionsOpts = {
    rpID,
    userVerification: 'required',
  } as any;
  const opts = generateAuthenticationOptions(options);
  pendingChallenges[`auth:${studentId}`] = (opts as any).challenge;
  return opts;
}

export async function finishAuth(studentId: string, response: any) {
  const challenge = pendingChallenges[`auth:${studentId}`];
  if (!challenge) throw new Error('No auth in progress');
  const { verified } = await verifyAuthenticationResponse({
    response,
    expectedChallenge: challenge,
    expectedOrigin,
    expectedRPID: rpID,
  } as any);
  if (!verified) throw new Error('Auth failed');
  delete pendingChallenges[`auth:${studentId}`];
  return true;
}
