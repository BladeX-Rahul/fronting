import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Cars from "./pages/Cars";
import CarDetail from "./pages/CarDetail";
import { Login, Register } from "./pages/Auth";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import { AdminDashboard, AdminCars, AdminBookings, AdminUsers } from "./pages/Admin";
import "./styles/globals.css";

/* ── Route Guards ── */
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return null;
  if (!user)    return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/" replace />;
}

/* ── Layout wrapper — shows Navbar + Footer for non-admin pages ── */
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: "calc(100vh - var(--nav-h))" }}>{children}</div>
      <Footer />
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/cars" element={<PublicLayout><Cars /></PublicLayout>} />
      <Route path="/cars/:id" element={<PublicLayout><CarDetail /></PublicLayout>} />

      {/* Guest only */}
      <Route path="/login"    element={<GuestRoute><PublicLayout><Login /></PublicLayout></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><PublicLayout><Register /></PublicLayout></GuestRoute>} />

      {/* Protected user routes */}
      <Route path="/my-bookings" element={<PrivateRoute><PublicLayout><MyBookings /></PublicLayout></PrivateRoute>} />
      <Route path="/profile"     element={<PrivateRoute><PublicLayout><Profile /></PublicLayout></PrivateRoute>} />

      {/* Admin routes — no footer */}
      <Route path="/admin"          element={<AdminRoute><><Navbar /><AdminDashboard /></></AdminRoute>} />
      <Route path="/admin/cars"     element={<AdminRoute><><Navbar /><AdminCars /></></AdminRoute>} />
      <Route path="/admin/bookings" element={<AdminRoute><><Navbar /><AdminBookings /></></AdminRoute>} />
      <Route path="/admin/users"    element={<AdminRoute><><Navbar /><AdminUsers /></></AdminRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
