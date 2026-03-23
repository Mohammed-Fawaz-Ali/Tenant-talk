import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import AdminTickets from "./pages/AdminTickets";
import Payments from "./pages/Payments";
import AdminPayments from "./pages/AdminPayments";
import AdminProperties from "./pages/AdminProperties";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTenants from "./pages/AdminTenants";

// Components
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { getUser } from "./utils/getUser";



function App() {
  const user = getUser();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Tenant Routes */}
        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <Layout>
                {user?.role === "tenant" ? (
                  <Tickets />
                ) : (
                  <Navigate to="/dashboard" />
                )}
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/tickets"
          element={
            <ProtectedRoute>
              <Layout>
                {user?.role === "admin" ? (
                  <AdminTickets />
                ) : (
                  <Navigate to="/dashboard" />
                )}
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <Layout>
                {user?.role === "tenant" ? (
                  <Payments />
                ) : (
                  <Navigate to="/dashboard" />
                )}
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute>
              <Layout>
                {user?.role === "admin" ? (
                  <AdminPayments />
                ) : (
                  <Navigate to="/dashboard" />
                )}
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                {user?.role === "admin" ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/dashboard" />
                )}
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/properties"
          element={
            <ProtectedRoute>
              <Layout>
                {user?.role === "admin" ? (
                  <AdminProperties />
                ) : (
                  <Navigate to="/dashboard" />
                )}
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/tenants"
          element={
            <ProtectedRoute>
              <Layout>
                {user?.role === "admin" ? (
                  <AdminTenants />
                ) : (
                  <Navigate to="/dashboard" />
                )}
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;