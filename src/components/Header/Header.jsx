import { HiOutlineBell } from "react-icons/hi";
import { useState } from "react";

function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const lastLogin = "Feb 22, 2025 at 10:45 AM"; // Replace dynamically if needed

  return (
    <div className="bg-white shadow-md border border-gray-300 p-4 lg:p-6">
      {/* Top Section: Bursary Portal Title */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
          Bursary Portal
        </h1>

        {/* Right Section: Notifications & Profile */}
        <div className="flex items-center space-x-4">
          {/* Notification Icon */}
          <button
            className="relative focus:outline-none"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <HiOutlineBell size={24} className="text-gray-600 cursor-pointer hover:text-blue-600 transition" />
            <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full"></span>
          </button>

          {/* User Profile */}
          <img
            src="https://via.placeholder.com/40"
            alt="User"
            className="rounded-full w-10 h-10 border border-gray-300 shadow-sm"
          />
        </div>
      </div>
      
      {/* Bottom Section: Welcome Message */}
      <div className="mt-2">
        <h2 className="text-lg lg:text-xl font-semibold text-gray-700">
          Welcome Back, <span className="text-blue-600">Stanley</span> 👋
        </h2>
        <p className="text-sm text-gray-500">Last login: {lastLogin}</p>
      </div>


      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="absolute right-4 top-14 w-64 bg-white shadow-lg border border-gray-300 p-4">
          <p className="text-sm text-gray-600">No new notifications</p>
        </div>
      )}
    </div>
  );
}

export default Header;
