import { Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import Navbar from "./components/Navbar";
import { useUserStore } from "./store/useUserStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import AdminPage from "./pages/AdminPage";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth) return <LoadingSpinner />;
  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
          </div>
        </div>

        <div className="relative z-50 pt-20">
          <Navbar></Navbar>
          <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route
              path="/signup"
              element={!user ? <SignUpPage /> : <Navigate to="/"></Navigate>}
            ></Route>
            <Route
              path="/login"
              element={!user ? <LoginPage /> : <Navigate to="/"></Navigate>}
            ></Route>
            <Route
              path="/secret-dashboard"
              element={
                user?.role === "admin" ? (
                  <AdminPage />
                ) : (
                  <Navigate to="login/"></Navigate>
                )
              }
            ></Route>
            <Route
              path="/category/:category"
              element={<CategoryPage />}
            ></Route>
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;