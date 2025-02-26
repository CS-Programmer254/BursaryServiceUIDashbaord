import { useEffect, useState } from "react";

function NotificationReport({ setFilteredData }) {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Bursary applications are now open", date: "2024-02-10" },
    { id: 2, message: "Payment vouchers have been processed", date: "2024-02-18" },
  ]);

  useEffect(() => {
    setFilteredData(notifications);
  }, [notifications, setFilteredData]);

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Notification Report</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Message</th>
            <th className="border p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((notification) => (
            <tr key={notification.id} className="border">
              <td className="p-2">{notification.id}</td>
              <td className="p-2">{notification.message}</td>
              <td className="p-2">{notification.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NotificationReport;
