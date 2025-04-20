import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import BatchPayout from "./pages/BatchPayout";
import Payments from "./pages/Payments";
import Reports from "./pages/Reports";
import BursaryApplications from "./pages/BursaryApplications";
import Login from "./pages/Login";

function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setAuthChecked(true);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  const PrivateRoute = ({ children }) => {
    if (!authChecked) return null; 
    return user ? children : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      {user ? (
        <div className="flex h-screen bg-gray-100 text-gray-900">
          <div className="fixed md:static z-50">
            <Sidebar />
          </div>
          
          <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
            <Header onLogout={handleLogout} user={user} />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                  <Route path="/applications" element={<PrivateRoute><BursaryApplications /></PrivateRoute>} />
                  <Route path="/payments" element={<PrivateRoute><Payments /></PrivateRoute>} />
                  <Route path="/payments/batch" element={<PrivateRoute><BatchPayout /></PrivateRoute>} />
                  <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
                  <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AnimatePresence>
            </main>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;