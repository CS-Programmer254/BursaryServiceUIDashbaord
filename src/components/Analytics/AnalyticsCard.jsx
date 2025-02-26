function AnalyticsCard({ title, value }) {
  return (
    <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-4 md:p-6 text-center 
      transform transition duration-500 ease-out hover:scale-105 animate-fadeIn">
      <h3 className="text-md md:text-md font-medium text-gray-600">{title}</h3>
      <p className="text-2xl md:text-3xl font-bold text-blue-600 mt-2">{value}</p>
    </div>
  );
}

export default AnalyticsCard;
