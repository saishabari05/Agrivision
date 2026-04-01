import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  forgotPassword as forgotPasswordService,
  loginWithEmail,
  loginWithGoogle,
  logoutUser,
  updateProfile as updateProfileService,
} from '../services/authService';
import { mockProfile, mockReports, mockUploads } from '../services/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [splashComplete, setSplashComplete] = useState(false);
  const [uploads, setUploads] = useState(mockUploads);
  const [reports, setReports] = useState(mockReports);

  useEffect(() => {
    const splashTimer = window.setTimeout(() => setSplashComplete(true), 2200);
    const storedUser = window.localStorage.getItem('agrivision_user');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    return () => window.clearTimeout(splashTimer);
  }, []);

  const persistUser = (nextUser) => {
    setUser(nextUser);
    window.localStorage.setItem('agrivision_user', JSON.stringify(nextUser));
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const loggedInUser = await loginWithEmail(email, password);
      persistUser(loggedInUser);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const loggedInUser = await loginWithGoogle();
      persistUser(loggedInUser);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    window.localStorage.removeItem('agrivision_user');
  };

  const forgotPassword = async (email) => forgotPasswordService(email);

  const updateProfile = async (updates) => {
    if (!user) return;
    const nextUser = await updateProfileService({ ...user, ...updates });
    persistUser(nextUser);
  };

  const addUploadResult = (payload) => {
    setUploads((current) => [payload, ...current]);
  };

  const addReport = (report) => {
    setReports((current) => [report, ...current]);
  };

  const deleteReport = (reportId) => {
    setReports((current) => current.filter((report) => report.id !== reportId));
  };

  const value = useMemo(
    () => ({
      user,
      previewProfile: user ?? mockProfile,
      isAuthenticated: Boolean(user),
      loading,
      splashComplete,
      uploads,
      reports,
      login,
      signInWithGoogle,
      logout,
      forgotPassword,
      updateProfile,
      addUploadResult,
      addReport,
      deleteReport,
      setReports,
    }),
    [user, loading, splashComplete, uploads, reports],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
