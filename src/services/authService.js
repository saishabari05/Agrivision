import { mockProfile } from './mockData';

const wait = (ms = 600) => new Promise((resolve) => window.setTimeout(resolve, ms));

export async function loginWithEmail(email, password) {
  await wait();

  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  return {
    ...mockProfile,
    email,
    name: email.split('@')[0].replace(/\./g, ' '),
  };
}

export async function loginWithGoogle() {
  await wait();
  return mockProfile;
}

export async function forgotPassword(email) {
  await wait(400);

  if (!email) {
    throw new Error('Enter an email address to receive a reset link.');
  }

  return { success: true };
}

export async function updateProfile(profile) {
  await wait(350);
  return profile;
}

export async function logoutUser() {
  await wait(200);
}

