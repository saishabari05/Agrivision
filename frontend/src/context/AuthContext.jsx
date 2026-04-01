import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  forgotPassword as forgotPasswordService,
  loginWithEmail,
  logoutUser,
  registerWithEmail,
  updateProfile as updateProfileService,
} from '../services/authService';
import { createFarm as createFarmApi, deleteFarm as deleteFarmApi, deleteReport as deleteReportApi, fetchFarms, fetchProfile, fetchReports, fetchUploads, updateFarm as updateFarmApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [splashComplete, setSplashComplete] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [reports, setReports] = useState([]);
  const [farms, setFarms] = useState([]);

  useEffect(() => {
    const splashTimer = window.setTimeout(() => setSplashComplete(true), 2200);
    const storedUser = window.localStorage.getItem('agrivision_user');

    if (storedUser) setUser(JSON.parse(storedUser));

    Promise.allSettled([fetchProfile(), fetchUploads(), fetchReports(), fetchFarms()]).then((results) => {
      const [profileResult, uploadsResult, reportsResult, farmsResult] = results;

      if (profileResult.status === 'fulfilled') {
        setProfile(profileResult.value);
      }
      if (uploadsResult.status === 'fulfilled') {
        setUploads(Array.isArray(uploadsResult.value?.items) ? uploadsResult.value.items : []);
      }
      if (reportsResult.status === 'fulfilled') {
        setReports(Array.isArray(reportsResult.value?.items) ? reportsResult.value.items : []);
      }
      if (farmsResult.status === 'fulfilled') {
        setFarms(Array.isArray(farmsResult.value?.items) ? farmsResult.value.items : []);
      }
    });

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

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const loggedInUser = await registerWithEmail(name, email, password);
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
    const nextProfile = await updateProfileService({ ...(profile ?? {}), ...updates });
    setProfile(nextProfile);
    if (user) {
      const nextUser = { ...user, ...nextProfile };
      persistUser(nextUser);
    }
  };

  const addUploadResult = (payload) => {
    setUploads((current) => [payload, ...current]);
  };

  const addReport = (report) => {
    setReports((current) => [report, ...current]);
  };

  const createFarm = async (payload) => {
    const farm = await createFarmApi(payload);
    setFarms((current) => [farm, ...current]);
    return farm;
  };

  const updateFarm = async (farmId, payload) => {
    const farm = await updateFarmApi(farmId, payload);
    setFarms((current) => current.map((item) => (item.id === farmId ? farm : item)));
    return farm;
  };

  const deleteFarm = async (farmId) => {
    await deleteFarmApi(farmId);
    setFarms((current) => current.filter((farm) => farm.id !== farmId));
  };

  const deleteReport = async (reportId) => {
    await deleteReportApi(reportId);
    setReports((current) => current.filter((report) => report.id !== reportId));
  };

  const value = useMemo(
    () => ({
      user,
      previewProfile: profile ?? user,
      isAuthenticated: Boolean(user),
      loading,
      splashComplete,
      uploads,
      reports,
      farms,
      login,
      register,
      logout,
      forgotPassword,
      updateProfile,
      addUploadResult,
      addReport,
      createFarm,
      updateFarm,
      deleteFarm,
      deleteReport,
      setReports,
      setFarms,
    }),
    [user, profile, loading, splashComplete, uploads, reports, farms],
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
