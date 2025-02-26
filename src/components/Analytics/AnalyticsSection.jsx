import AnalyticsCard from "./AnalyticsCard";

function AnalyticsSection() {
  const data = [
    { title: "Pending", value: 145 },
    { title: "Approved", value: 321 },
    { title: "Rejected", value: 80 },
    { title: "Completed", value: 812 }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-6 animate-fadeIn">
      {data.map((item, index) => (
        <AnalyticsCard key={index} title={item.title} value={item.value} />
      ))}
    </div>
  );
}

export default AnalyticsSection;
