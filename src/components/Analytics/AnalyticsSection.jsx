import { useEffect, useState } from "react";
import AnalyticsCard from "./AnalyticsCard";

function AnalyticsSection() {
  const [data, setData] = useState([
    { title: "Pending", value: 0 },
    { title: "Approved", value: 0 },
    { title: "Rejected", value: 0 },
    { title: "Completed", value: 0 }
  ]);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    const statuses = ["Pending", "Approved", "Rejected", "Completed"];

    const fetchStatusCounts = async () => {
      try {
        if (user?.role === "ROLE_ADMIN") {
          // Admin logic
          const results = await Promise.all(
            statuses.map((status) =>
              fetch(`https://localhost:7094/api/Bursary/get-all-bursary-by-application-status/${status}`)
                .then((res) => res.json())
                .then((items) => ({
                  title: status,
                  value: items.length
                }))
            )
          );
          setData(results);
        } else if (user?.role === "ROLE_STUDENT") {
          
          const response = await fetch(
            `https://localhost:7094/api/Bursary/get-bursary-applications-by-phone/${user.phone}`
          );
          const studentApps = await response.json();

          const counts = statuses.map((status) => ({
            title: status,
            value: studentApps.filter((app) => app.applicationStatus === status).length
          }));
          setData(counts);
        }
      } catch (error) {
        console.error("Error fetching status counts:", error);
      }
    };

    fetchStatusCounts();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-6 animate-fadeIn">
      {data.map((item, index) => (
        <AnalyticsCard key={index} title={item.title} value={item.value} />
      ))}
    </div>
  );
}

export default AnalyticsSection;
