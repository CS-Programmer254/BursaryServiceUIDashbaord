import React, { useState } from "react";
import { HiOutlineBell, HiOutlineLogout } from "react-icons/hi";

const Header = ({ user, onLogout }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Left side - Welcome message */}
          <div>
            <h1 className="text-xl font-bold text-gray-800">Bursary Portal</h1>
            <p className="text-sm text-gray-600">
              Welcome back, <span className="font-medium text-blue-600">{user?.username}</span>
            </p>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <HiOutlineBell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Notifications dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b">
                    <h3 className="font-medium text-gray-800">Notifications</h3>
                  </div>
                  <div className="p-4 text-sm text-gray-600">
                    No new notifications
                  </div>
                </div>
              )}
            </div>

            {/* User profile */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                {user?.username?.charAt(0)}
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={onLogout}
              className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <HiOutlineLogout size={18} className="mr-1" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;