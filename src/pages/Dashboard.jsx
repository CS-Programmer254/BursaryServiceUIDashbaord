import { useEffect, useState } from "react";
import QuickSearch from "../components/Search/QuickSearch";
import RecentApplicationCard from "../components/RecentApplicationCard/RecentApplicationCard";
import AnalyticsSection from "../components/Analytics/AnalyticsSection";
import BursaryApplications from "../components/ApplicationTable/BursaryApplicationsTable";
import PageWrapper from "../components/Animation/PageWrapper";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  return (
    <PageWrapper>
      <div className="space-y-6">
        {user?.role !== "ROLE_ADMIN" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <QuickSearch />
            <RecentApplicationCard />
          </div>
        )}

        <AnalyticsSection />
        <BursaryApplications />
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
