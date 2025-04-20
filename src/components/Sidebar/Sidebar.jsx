import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  HiOutlineHome, 
  HiOutlineDocumentText, 
  HiOutlineCurrencyDollar, 
  HiOutlineChartBar, 
  HiOutlineCog,
  HiX,
  HiMenu,
  HiChevronDown,
  HiChevronUp
} from "react-icons/hi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    setIsOpen(false);
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [location]);

  const navItems = [
    { path: "/", icon: HiOutlineHome, label: "Dashboard" },
    { path: "/applications", icon: HiOutlineDocumentText, label: "Applications" },
    { 
      path: "/payments", 
      icon: HiOutlineCurrencyDollar, 
      label: "Payments",
      subItems: [
        { path: "/payments", label: "Payment Status" },
        { path: "/payments/batch", label: "Batch Payout" }
      ]
    },
    { path: "/reports", icon: HiOutlineChartBar, label: "Reports" },
    { path: "/settings", icon: HiOutlineCog, label: "Settings" }
  ];

  const toggleSubmenu = (path) => {
    setOpenSubmenu(openSubmenu === path ? null : path);
  };

  const isActive = (path, subItems = []) => {
    return location.pathname === path || 
           subItems.some(subItem => location.pathname === subItem.path);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md shadow-lg"
      >
        <HiMenu size={24} />
      </button>

      <aside 
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="flex flex-col h-full p-4 border-r border-gray-200">
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden self-end p-2 text-gray-500 hover:text-gray-700"
          >
            <HiX size={24} />
          </button>

          <div className="px-4 py-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Rattansi Bursary</h2>
          </div>

          <nav className="flex-1 mt-6 overflow-y-auto">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <div className={`flex flex-col ${
                    isActive(item.path, item.subItems) ? "bg-blue-50" : ""
                  }`}>
                    <div className="flex items-center">
                      <Link
                        to={item.path}
                        className={`flex-1 flex items-center px-4 py-3 rounded-lg transition-colors ${
                          isActive(item.path, item.subItems)
                            ? "text-blue-600 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          setIsOpen(false);
                          if (!item.subItems) setOpenSubmenu(null);
                        }}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        <span>{item.label}</span>
                      </Link>
                      {item.subItems && (
                        <button
                          onClick={() => toggleSubmenu(item.path)}
                          className="p-2 text-gray-500 hover:text-gray-700"
                        >
                          {openSubmenu === item.path ? (
                            <HiChevronUp size={18} />
                          ) : (
                            <HiChevronDown size={18} />
                          )}
                        </button>
                      )}
                    </div>
                    
                    {item.subItems && openSubmenu === item.path && (
                      <div className="pl-12 py-1 space-y-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={`block px-3 py-2 text-sm rounded ${
                              location.pathname === subItem.path
                                ? "bg-blue-100 text-blue-600"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                            onClick={() => setIsOpen(false)}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;