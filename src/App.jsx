import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Payments from "./pages/Payments";
import Reports from "./pages/Reports";
import BursaryApplications from "./pages/BursaryApplications";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/applications" element={<BursaryApplications />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="flex flex-col md:flex-row h-screen bg-gray-100 text-gray-900">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-auto">
          <Header />
          <div className="p-4 md:p-6 flex-1 overflow-y-auto">
            <AnimatedRoutes />
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
