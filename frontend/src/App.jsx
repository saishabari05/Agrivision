import { AnimatePresence } from 'framer-motion';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import Alerts from './pages/Alerts';
import Chat from './pages/Chat';
import Dashboard from './pages/Dashboard';
import Farms from './pages/Farms';
import Heatmap from './pages/Heatmap';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Overview from './pages/Overview';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Reports from './pages/Reports';
import Splash from './pages/Splash';
import Upload from './pages/Upload';

function App() {
  const location = useLocation();
  const { isAuthenticated, splashComplete } = useAuth();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            splashComplete ? (
              isAuthenticated ? (
                <Navigate to="/overview" replace />
              ) : (
                <Landing />
              )
            ) : (
              <Splash />
            )
          }
        />
        <Route path="/splash" element={<Splash />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/overview" replace /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/overview" replace /> : <Register />} />
        <Route
          path="/overview"
          element={
            <ProtectedRoute>
              <Overview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farms"
          element={
            <ProtectedRoute>
              <Farms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/heatmap"
          element={
            <ProtectedRoute>
              <Heatmap />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <Alerts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route path="/chatbot" element={<Navigate to="/chat" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
