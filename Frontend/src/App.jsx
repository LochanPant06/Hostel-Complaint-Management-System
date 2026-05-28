import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth.js";
import { AuthLayout, MainLayout } from "./layouts/index.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ComplaintDetail from "./pages/ComplaintDetail.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import SubmitComplaint from "./pages/SubmitComplaint.jsx";

function App() {
  const { isAuthenticated, user } = useAuth();
  const homePath = user?.role === "student" ? "/dashboard" : "/admin";
  const isStudent = user?.role === "student";

  return (
    <Router>
      <Routes>
        {isAuthenticated ? (
          <>
            {isStudent ? (
              <>
                <Route path="/student" element={<Navigate to="/dashboard" replace />} />
                <Route path="/submit" element={<Navigate to="/submit-complaint" replace />} />
                <Route
                  path="/dashboard"
                  element={
                    <MainLayout>
                      <StudentDashboard />
                    </MainLayout>
                  }
                />
                <Route
                  path="/submit-complaint"
                  element={
                    <MainLayout>
                      <SubmitComplaint />
                    </MainLayout>
                  }
                />
              </>
            ) : (
              <Route
                path="/admin"
                element={
                  <MainLayout>
                    <AdminDashboard />
                  </MainLayout>
                }
              />
            )}

            <Route
              path="/complaints/:id"
              element={
                <MainLayout>
                  <ComplaintDetail />
                </MainLayout>
              }
            />

            <Route path="/login" element={<Navigate to={homePath} replace />} />
            <Route path="/register" element={<Navigate to={homePath} replace />} />
            <Route path="/" element={<Navigate to={homePath} replace />} />
          </>
        ) : (
          <>
            <Route
              path="/login"
              element={
                <AuthLayout>
                  <Login />
                </AuthLayout>
              }
            />
            <Route
              path="/register"
              element={
                <AuthLayout>
                  <Register />
                </AuthLayout>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </>
        )}

        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? homePath : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
