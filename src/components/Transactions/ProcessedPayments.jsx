import { useState } from "react";

function ProcessedPayments() {
  // Mock Data
  const mockApplications = [
    {
      applicantFullName: "John Doe",
      admissionNumber: "ADM12345",
      schoolName: "School of ICT",
      departmentName: "Computer Science",
      enrolledCourse: "BSc Computer Science",
      yearOfStudy: "3",
      applicationDate: "2024-02-10T10:00:00Z",
      amountApproved: { currency: "KES", amount: 10000 },
      paymentDetails: {
        paymentDate: "2024-02-15T10:00:00Z",
        transactionId: "TXN56789",
      },
      applicationStatus: "Approved",
    },
    {
      applicantFullName: "Jane Smith",
      admissionNumber: "ADM67890",
      schoolName: "School of Business",
      departmentName: "Finance",
      enrolledCourse: "BBA Finance",
      yearOfStudy: "2",
      applicationDate: "2024-02-12T12:30:00Z",
      amountApproved: { currency: "KES", amount: 15000 },
      paymentDetails: {
        paymentDate: "2024-02-20T11:30:00Z",
        transactionId: "TXN98765",
      },
      applicationStatus: "Approved",
    },
    {
      applicantFullName: "Alice Johnson",
      admissionNumber: "ADM34567",
      schoolName: "School of Engineering",
      departmentName: "Mechanical Engineering",
      enrolledCourse: "BSc Mechanical Engineering",
      yearOfStudy: "4",
      applicationDate: "2024-01-25T09:15:00Z",
      amountApproved: { currency: "KES", amount: 12000 },
      paymentDetails: null, // Payment not yet processed
      applicationStatus: "Approved",
    },
  ];

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const applicationsPerPage = 5;
  const totalPages = Math.ceil(mockApplications.length / applicationsPerPage);

  // Paginated data
  const indexOfLastApplication = currentPage * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = mockApplications.slice(
    indexOfFirstApplication,
    indexOfLastApplication
  );

  return (
    <div className="bg-white shadow-lg p-4 md:p-6 rounded-lg mt-6 border-l-4 border-r-4 border-green-500 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Processed Bursary Payments
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-green-500 text-white text-xs md:text-sm uppercase rounded-t-lg">
              <th className="p-3 first:rounded-tl-lg">Applicant</th>
              <th className="p-3">Admission</th>
              <th className="p-3">School</th>
              <th className="p-3">Department</th>
              <th className="p-3">Course</th>
              <th className="p-3">Year</th>
              <th className="p-3">Date Applied</th>
              <th className="p-3">Amount Approved</th>
              <th className="p-3">Payment Date</th>
              <th className="p-3">Transaction ID</th>
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
                <td className="p-3 font-semibold text-green-700">
                  {app.amountApproved.currency}{" "}
                  {app.amountApproved.amount.toLocaleString()}
                </td>
                <td className="p-3">
                  {app.paymentDetails?.paymentDate
                    ? new Date(app.paymentDetails.paymentDate).toLocaleDateString()
                    : <span className="text-yellow-600 font-semibold">Pending</span>}
                </td>
                <td className="p-3">
                  {app.paymentDetails?.transactionId || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CTA Box (Only show if no payments are available) */}
      {mockApplications.length === 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold">No Processed Payments Yet</h3>
          <p className="text-sm text-gray-100 mt-2">
            Need financial support? Apply for a bursary today!
          </p>
          <button className="mt-3 px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded-md hover:bg-yellow-300 transition">
            Apply Now
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {mockApplications.length > applicationsPerPage && (
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
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ProcessedPayments;
