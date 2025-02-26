import { Link } from "react-router-dom";
import { HiOutlineHome, HiOutlineDocumentText, HiOutlineCurrencyDollar, HiOutlineChartBar, HiOutlineCog, HiX } from "react-icons/hi";
import { useState } from "react";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="lg:hidden p-3 fixed top-4 left-4 z-50 bg-blue-600 text-white rounded-md shadow-md"
      >
        ☰
      </button>

      <aside 
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg border border-gray-300 p-5 transition-transform duration-300 ease-in-out 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:relative z-50`}
      >
        <button 
          onClick={() => setIsOpen(false)} 
          className="lg:hidden absolute top-4 right-4 text-blue-600 hover:text-red-600"
        >
          <HiX size={24} />
        </button>

        <h2 className="text-xl font-semibold mb-5">Rattansi Bursary</h2>

        <nav>
          <ul className="space-y-4">
            <li className="p-2 hover:bg-gray-200 rounded-lg">
              <Link to="/" className="flex items-center space-x-3">
                <HiOutlineHome size={20} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="p-2 hover:bg-gray-200 rounded-lg">
              <Link to="/applications" className="flex items-center space-x-3">
                <HiOutlineDocumentText size={20} />
                <span>Applications</span>
              </Link>
            </li>
            <li className="p-2 hover:bg-gray-200 rounded-lg">
              <Link to="/payments" className="flex items-center space-x-3">
                <HiOutlineCurrencyDollar size={20} />
                <span>Payments</span>
              </Link>
            </li>
            <li className="p-2 hover:bg-gray-200 rounded-lg">
              <Link to="/reports" className="flex items-center space-x-3">
                <HiOutlineChartBar size={20} />
                <span>Reports</span>
              </Link>
            </li>
            <li className="p-2 hover:bg-gray-200 rounded-lg">
              <Link to="/settings" className="flex items-center space-x-3">
                <HiOutlineCog size={20} />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-40 lg:hidden z-40" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}

export default Sidebar;
