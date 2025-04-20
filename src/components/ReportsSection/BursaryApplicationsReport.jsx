import { useEffect, useState } from "react";

function BursaryApplicationsReport({ setFilteredData }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      const user = JSON.parse(sessionStorage.getItem("user"));

      try {
        let url = "";

        if (user?.role === "ROLE_ADMIN") {
          url = "https://localhost:7094/api/Bursary/all";
        } else if (user?.role === "ROLE_STUDENT") {
          
          url = `https://localhost:7094/api/Bursary/get-bursary-applications-by-phone/${user.phone}`;
        } else {
          throw new Error("Unauthorized role");
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setApplications(data);
        setFilteredData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [setFilteredData]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Bursary Applications Report</h2>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="border p-2">Full Name</th>
              <th className="border p-2">Admission No</th>
              <th className="border p-2">School</th>
              <th className="border p-2">Department</th>
              <th className="border p-2">Course</th>
              <th className="border p-2">Year</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Application Date</th>
              <th className="border p-2">Amount Applied</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr key={index} className="border">
                <td className="p-2">{app.applicantFullName}</td>
                <td className="p-2">{app.admissionNumber}</td>
                <td className="p-2">{app.schoolName}</td>
                <td className="p-2">{app.departmentName}</td>
                <td className="p-2">{app.enrolledCourse}</td>
                <td className="p-2">{app.yearOfStudy}</td>
                <td
                  className={`p-2 font-semibold ${
                    app.applicationStatus === "Approved"
                      ? "text-green-500"
                      : app.applicationStatus === "Rejected"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                >
                  {app.applicationStatus}
                </td>
                <td className="p-2">
                  {new Date(app.applicationDate).toLocaleDateString()}
                </td>
                <td className="p-2">
                  {app.amountAppliedFor.currency}{" "}
                  {app.amountAppliedFor.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BursaryApplicationsReport;
