import { useEffect, useState, useMemo } from "react";

function DisbursmentReport({ setFilteredData }) {
  const [data, setData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/disbursement");
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching disbursement data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return statusFilter === "All" ? data : data.filter((item) => item.status === statusFilter);
  }, [data, statusFilter]);

  useEffect(() => {
    setFilteredData(filteredData);
  }, [filteredData, setFilteredData]);

  return (
    <div className="p-6 bg-gray-100 rounded-lg mt-4">
      <h2 className="text-lg font-semibold">Disbursement Report</h2>

      {/* Status Filter */}
      <label className="block font-medium text-gray-700 mt-4">Filter by Status:</label>
      <select
        className="border p-2 rounded-lg w-full mt-2"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Disbursed">Disbursed</option>
        <option value="Withheld">Withheld</option>
        <option value="In Progress">In Progress</option>
      </select>

      {/* Display Data */}
      {filteredData.length > 0 ? (
        <table className="w-full mt-4 border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Student</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="text-center">
                <td className="border p-2">{item.id}</td>
                <td className="border p-2">{item.student}</td>
                <td className="border p-2">{item.status}</td>
                <td className="border p-2">${item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600 mt-4">No records found.</p>
      )}
    </div>
  );
}

export default DisbursmentReport;
