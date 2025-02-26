import { useState } from "react";

function Notification() {
  const [activeTab, setActiveTab] = useState("SMS");
  const notifications = {
    SMS: [
      { id: 1, text: "Your balance is low", unread: true },
      { id: 2, text: "Payment received: $500", unread: false },
    ],
    Email: [
      { id: 1, text: "Your statement is ready", unread: true },
      { id: 2, text: "New security alert", unread: false },
    ],
  };

  return (
    <div className="relative">
      <button className="relative text-xl focus:outline-none">
        🔔
        {(notifications.SMS.some((n) => n.unread) || notifications.Email.some((n) => n.unread)) && (
          <span className="absolute top-0 right-0 bg-red-500 w-3 h-3 rounded-full"></span>
        )}
      </button>

      <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 animate-slideInRight">
        <div className="flex border-b pb-2">
          {["SMS", "Email"].map((type) => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`flex-1 text-center py-2 ${
                activeTab === type ? "border-b-2 border-blue-600 font-bold" : "text-gray-500"
              } transition`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="mt-3">
          {notifications[activeTab].map((item) => (
            <div key={item.id} className="flex justify-between items-center py-2">
              <span>{item.text}</span>
              {item.unread && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Notification;
