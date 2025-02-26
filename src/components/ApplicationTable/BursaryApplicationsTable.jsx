import { useEffect, useState } from "react";

function BursaryApplicationsTable() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const applicationsPerPage = 2; // Number of items per page

  useEffect(() => {
    fetch("https://localhost:7094/api/Bursary/all")
      .then((response) => response.json())
      .then((data) => {
        setApplications(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  // Filter applications
  const filteredApplications =
    filter === "All"
      ? applications
      : applications.filter((app) => app.applicationStatus === filter);

  // Pagination logic
  const indexOfLastApplication = currentPage * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = filteredApplications.slice(
    indexOfFirstApplication,
    indexOfLastApplication
  );

  const totalPages = Math.ceil(filteredApplications.length / applicationsPerPage);

  return (
    <div className="bg-white shadow-lg p-4 md:p-6 rounded-lg mt-6 animate-fadeIn">
      {/* Header with Filter */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm md:text-lg font-semibold text-gray-800">
          Bursary Applications
        </h2>
        <select
          className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setCurrentPage(1); // Reset to first page when filter changes
          }}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading applications...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border border-gray-200 rounded-lg shadow-md">
              <thead>
                <tr className="bg-blue-500 text-white text-xs md:text-sm uppercase rounded-t-lg">
                  <th className="p-3 first:rounded-tl-lg last:rounded-tr-lg">
                    Applicant
                  </th>
                  <th className="p-3">Admission</th>
                  <th className="p-3">School</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Course</th>
                  <th className="p-3">Year</th>
                  <th className="p-3">Date Applied</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {currentApplications.map((app, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition duration-150"
                  >
                    <td className="p-3">{app.applicantFullName}</td>
                    <td className="p-3">{app.admissionNumber}</td>
                    <td className="p-3">{app.schoolName}</td>
                    <td className="p-3">{app.departmentName}</td>
                    <td className="p-3">{app.enrolledCourse}</td>
                    <td className="p-3">{app.yearOfStudy}</td>
                    <td className="p-3">
                      {new Date(app.applicationDate).toLocaleDateString()}
                    </td>
                    <td className="p-3 font-semibold">
                      {app.amountAppliedFor.currency}{" "}
                      {app.amountAppliedFor.amount.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-xs md:text-sm font-medium rounded-lg ${
                          app.applicationStatus === "Pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : app.applicationStatus === "Approved"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {app.applicationStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Buttons */}
          {filteredApplications.length > applicationsPerPage && (
            <div className="flex justify-center items-center mt-4 space-x-2">
              <button
                className={`px-4 py-2 text-sm font-semibold rounded-lg ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <span className="text-gray-700 text-sm">
                Page {currentPage} of {totalPages}
              </span>

              <button
                className={`px-4 py-2 text-sm font-semibold rounded-lg ${
                  currentPage === totalPages
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BursaryApplicationsTable;
