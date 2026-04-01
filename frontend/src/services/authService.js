import { loginWithEmailApi, registerWithEmailApi, updateProfile as updateProfileApi } from './api';

export async function loginWithEmail(email, password) {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  const response = await loginWithEmailApi({ email, password });
  if (!response?.user) {
    throw new Error('Invalid login response from backend.');
  }
  return { ...response.user, token: response.access_token };
}

export async function registerWithEmail(name, email, password) {
  if (!name || !email || !password) {
    throw new Error('Name, email, and password are required.');
  }

  const response = await registerWithEmailApi({ name, email, password });
  if (!response?.user) {
    throw new Error('Registration failed.');
  }
  return { ...response.user, token: response.access_token };
}

export async function forgotPassword(email) {
  if (!email) {
    throw new Error('Enter an email address to receive a reset link.');
  }

  return { success: true, message: 'Password reset is not implemented in backend yet.' };
}

export async function updateProfile(profile) {
  return updateProfileApi(profile);
}

export async function logoutUser() {
  return Promise.resolve();
}

