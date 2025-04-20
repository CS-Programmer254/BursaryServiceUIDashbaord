import { useState, useEffect } from "react";
import { FaPhoneAlt } from "react-icons/fa";

function RecentApplicationCard() {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  // Retrieve the user object from session storage
  const user = JSON.parse(sessionStorage.getItem("user"));

  const apiUrl = `https://localhost:7094/api/Bursary/get-bursary-applications-by-phone/${user.phone}`;

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("No recent applications found");
        }
        const data = await response.json();

        const sortedApplications = data.sort(
          (a, b) => new Date(b.applicationDate) - new Date(a.applicationDate)
        );
        setApplication(sortedApplications[0]);
      } catch (error) {
        console.error("Error fetching application:", error);
        setApplication(null);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="bg-white shadow-md p-4 md:p-6 rounded-lg col-span-1 text-center animate-pulse">
        <p className="text-gray-600">Checking for recent applications...</p>
      </div>
    );
  }

  // No application found
  if (!application) {
    return (
      <div className="bg-white shadow-md p-6 rounded-lg col-span-1 border-r-4 border-blue-600 animate-fadeIn text-center">
        <h2 className="text-xl font-bold text-gray-800">No Recent Applications</h2>
        <p className="text-sm text-gray-600 mt-2">
          Applying for bursary has never been easier! Get financial support now.
        </p>

        <div className="mt-4 flex items-center justify-center p-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg shadow-md">
          <FaPhoneAlt className="mr-2 text-lg text-yellow-300" />
          <p className="text-lg font-semibold">
            Dial <span className="font-bold text-yellow-300">*642*188#</span> now
          </p>
        </div>

        <p className="text-sm text-gray-500 mt-4 italic">Don’t miss out on your opportunity!</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md p-4 md:p-6 rounded-lg col-span-1 border-r-4 border-green-600 animate-fadeIn">
      <h2 className="text-lg font-medium text-gray-700">Recent Bursary Application</h2>
      <p className="text-sm text-gray-500">{new Date(application.applicationDate).toDateString()}</p>

      <p className="text-3xl font-bold mt-3 text-green-700">
        {application.amountAppliedFor.currency} {application.amountAppliedFor.amount.toLocaleString()}
      </p>

      <p
        className={`mt-2 text-sm font-semibold px-3 py-1 rounded-md w-fit ${
          application.applicationStatus === "Approved"
            ? "bg-green-100 text-green-700 border border-green-600"
            : application.applicationStatus === "Rejected"
            ? "bg-red-100 text-red-700 border border-red-600"
            : "bg-yellow-100 text-yellow-700 border border-yellow-600"
        }`}
      >
        {application.applicationStatus}
      </p>

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="mt-3 text-blue-600 font-medium hover:underline focus:outline-none"
      >
        {showDetails ? "Hide Details" : "View Details"}
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          showDetails ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mt-3 text-gray-700 text-sm">
          <p><strong>Applicant:</strong> {application.applicantFullName}</p>
          <p><strong>Admission No.:</strong> {application.admissionNumber}</p>
          <p><strong>School:</strong> {application.schoolName}</p>
          <p><strong>Department:</strong> {application.departmentName}</p>
          <p><strong>Course:</strong> {application.enrolledCourse} ({application.yearOfStudy} Year)</p>
          <p><strong>Application Date:</strong> {new Date(application.applicationDate).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

export default RecentApplicationCard;
