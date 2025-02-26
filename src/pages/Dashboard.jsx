import QuickSearch from "../components/Search/QuickSearch";
import RecentApplicationCard from "../components/RecentApplicationCard/RecentApplicationCard";
import AnalyticsSection from "../components/Analytics/AnalyticsSection";
import BursaryApplications from "../components/ApplicationTable/BursaryApplicationsTable";
import PageWrapper from "../components/Animation/PageWrapper";

function Dashboard() {
  return (
    <PageWrapper>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-6">
        <QuickSearch />
        <RecentApplicationCard />
      </div>
      <AnalyticsSection />
      <BursaryApplications />
    </PageWrapper>
  );
}

export default Dashboard;
