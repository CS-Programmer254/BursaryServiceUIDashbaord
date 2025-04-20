import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BursaryApprovalDetailsModal from "./BursaryApprovalDetailsModal";

function BursaryApplicationsTable() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApps, setSelectedApps] = useState([]);
  const [isApproving, setIsApproving] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState("Approved");
  const [amountAllocated, setAmountAllocated] = useState({ amount: 0, currency: "KES" });
  const [remark, setRemark] = useState("");
  const [batchNumber, setBatchNumber] = useState("");

  const itemsPerPage = 1;
  const user = JSON.parse(sessionStorage.getItem("user"));
  const isAdmin = user?.role === "ROLE_STUDENT";

  const playSuccessSound = () => {
    const audio = new Audio('/success.wav');
    audio.play().catch(e => console.log("Audio play failed:", e));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = "";
        
        if (isAdmin) {

          url = "https://localhost:7094/api/Bursary/all";

        } else if (user?.role === "ROLE_STUDENT" && user?.phone) {
          
          const encodedPhone = encodeURIComponent(user.phone);
          url = `https://localhost:7094/api/Bursary/get-bursary-applications-by-phone/${encodedPhone}`;
        } else {
          throw new Error("Unauthorized access or missing phone number");
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin, user?.role, user?.phone]);

  const openModal = (application) => setSelectedApplication(application);
  const closeModal = () => setSelectedApplication(null);

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedApps(paginatedApps
        .filter(app => app.applicationStatus === "Pending")
        .map(app => app.bursaryApplicationId)
      );
    } else {
      setSelectedApps([]);
    }
  };
   
  const handleUpdateSuccess = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = isAdmin
        ? "https://localhost:7094/api/Bursary/all"
        : `https://localhost:7094/api/Bursary/get-bursary-applications-by-phone/${encodeURIComponent(user.phone)}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setApplications(data);
      toast.success("Application updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      setError("Failed to refresh data after update.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectApp = (appId) => {
    const app = applications.find(a => a.bursaryApplicationId === appId);
    if (app.applicationStatus !== "Rejected") {
      setSelectedApps(prev => 
        prev.includes(appId) 
          ? prev.filter(id => id !== appId) 
          : [...prev, appId]
      );
    }
  };

  const filteredApps = applications.filter((app) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      app.applicantFullName?.toLowerCase().includes(searchLower) ||
      app.admissionNumber?.toLowerCase().includes(searchLower) ||
      app.schoolName?.toLowerCase().includes(searchLower) ||
      app.enrolledCourse?.toLowerCase().includes(searchLower) ||
      app.yearOfStudy?.toLowerCase().includes(searchLower) ||
      app.applicationStatus?.toLowerCase().includes(searchLower) ||
      app.amountAppliedFor?.amount?.toString().includes(searchLower) ||
      app.batchNumber?.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);
  const paginatedApps = filteredApps.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedApps([]);
  };

  const approveSelectedApplications = async () => {
    if (!selectedApps.length) return;
    
    setIsApproving(true);
    setError(null);
    
    try {
      const results = [];
      const errors = [];
      
      for (const appId of selectedApps) {
        const application = applications.find(a => a.bursaryApplicationId === appId);
        
        if (!application) {
          errors.push(`Application ${appId} not found`);
          continue;
        }

        if (application.applicationStatus !== "Pending") {
          errors.push(`Application ${appId} has already been processed`);
          continue;
        }

        const isRejected = approvalStatus === "Rejected";
        const payload = {
          approverFullName: user.username,
          approverNationalIdentificationNumber: user.nationalId,
          approverPhoneNumber: user.phone,
          approverEmailAddress: user.email,
          bursaryApplicationId: appId,
          approvalStatus: approvalStatus,
          assignedBatchNumber: isRejected ? "Not assigned" : (batchNumber || `BATCH-${new Date().getTime()}`),
          amountAppliedFor: application.amountAppliedFor,
          amountAllocated: {
            amount: isRejected ? 0 : (Number(amountAllocated.amount) || application.amountAppliedFor.amount),
            currency: isRejected ? "KES" : (amountAllocated.currency || application.amountAppliedFor.currency)
          },
          remark: remark || `${approvalStatus} by ${user.username}`,
          approvedDate: new Date().toISOString()
        };

        try {
          const response = await fetch("https://localhost:7094/api/Bursary/approve-reject-bursary-application", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          const responseData = await response.json();
          
          if (!response.ok || !responseData.success) {
            throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
          }

          results.push({ id: appId, success: true });
        } catch (error) {
          if (error.message.includes("UNIQUE constraint failed")) {
            errors.push(`Application ${appId} has already been processed`);
          } else {
            errors.push(`Application ${appId}: ${error.message}`);
          }
          results.push({ id: appId, success: false, error: error.message });
        }
      }

      try {
        let refreshUrl = isAdmin 
          ? "https://localhost:7094/api/Bursary/all" 
          : `https://localhost:7094/api/Bursary/get-bursary-applications-by-phone/${encodeURIComponent(user.phone)}`;
        
        const refreshResponse = await fetch(refreshUrl);
        const newData = await refreshResponse.json();
        setApplications(newData);
        
        const successCount = results.filter(r => r.success).length;
        if (errors.length > 0) {
          setError(`Completed with ${successCount} success(es) and ${errors.length} error(s):\n${errors.join('\n')}`);
        } else {
          playSuccessSound();
          const successMessage = approvalStatus === "Approved" 
            ? `${successCount} application(s) approved successfully!`
            : `${successCount} application(s) rejected successfully!`;
            
          toast.success(successMessage, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            style: {
              backgroundColor: approvalStatus === "Approved" ? '#10B981' : '#EF4444',
              color: '#FFFFFF',
              fontSize: '14px',
              borderRadius: '8px',
              boxShadow: approvalStatus === "Approved" 
                ? '0 4px 12px rgba(16, 185, 129, 0.3)'
                : '0 4px 12px rgba(239, 68, 68, 0.3)'
            }
          });
        }
        
        setSelectedApps([]);
      } catch (refreshError) {
        console.error("Error refreshing data:", refreshError);
        setError("Processing completed but failed to refresh data. Please reload the page.");
      }
    } catch (error) {
      console.error("Error in approval process:", error);
      setError(error.message);
    } finally {
      setIsApproving(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white shadow-sm p-4 rounded-lg mt-4">
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
      <h2 className="text-base font-semibold text-gray-700 mb-3">
        Bursary Applications
      </h2>

      <div className="flex flex-col md:flex-row justify-between gap-3 mb-3">
        <input
          type="text"
          placeholder="Search applications..."
          className="w-full md:w-1/2 p-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {isAdmin && (
          <div className="text-xs text-gray-500 self-center">
            {filteredApps.length} application(s) found
          </div>
        )}
      </div>

      {error && (
        <div className="mb-3 p-2 text-xs bg-red-50 text-red-600 rounded border border-red-100 whitespace-pre-line">
          {error}
          <button 
            onClick={() => setError(null)}
            className="float-right text-xs text-red-400 hover:text-red-600"
          >
            Dismiss
          </button>
        </div>
      )}

      {isAdmin && selectedApps.length > 0 && (
        <div className="mb-3 p-3 bg-blue-50 rounded border border-blue-100">
          <h3 className="font-medium mb-2 text-xs text-blue-700">
            {approvalStatus === "Approved" ? "Approve" : "Reject"} Selected ({selectedApps.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select
                className="w-full p-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
                value={approvalStatus}
                onChange={(e) => {
                  setApprovalStatus(e.target.value);
                  if (e.target.value === "Rejected") {
                    setAmountAllocated({ amount: 0, currency: "KES" });
                    setBatchNumber("Not assigned");
                  }
                }}
                required
              >
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Amount</label>
              <div className="flex">
                <select
                  className="p-1 text-xs border rounded-l focus:outline-none focus:ring-1 focus:ring-blue-300"
                  value={amountAllocated.currency}
                  onChange={(e) => setAmountAllocated({...amountAllocated, currency: e.target.value})}
                  disabled={approvalStatus === "Rejected"}
                >
                  <option value="KES">KES</option>
                  <option value="USD">USD</option>
                </select>
                <input
                  type="number"
                  className="p-1 text-xs border rounded-r w-full focus:outline-none focus:ring-1 focus:ring-blue-300 disabled:bg-gray-100"
                  value={amountAllocated.amount}
                  onChange={(e) => setAmountAllocated({
                    ...amountAllocated, 
                    amount: parseFloat(e.target.value) || 0
                  })}
                  min="0"
                  step="100"
                  placeholder="Amount"
                  disabled={approvalStatus === "Rejected"}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Batch</label>
              <input
                type="text"
                className="w-full p-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-300 disabled:bg-gray-100"
                value={approvalStatus === "Rejected" ? "Not assigned" : batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder={approvalStatus === "Rejected" ? "" : "Auto-generate if empty"}
                disabled={approvalStatus === "Rejected"}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Remark</label>
              <input
                type="text"
                className="w-full p-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder={`${approvalStatus} by ${user.fullName || "Admin"}`}
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <button
              onClick={() => setSelectedApps([])}
              className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
            >
              Clear selection
            </button>
            <button
              onClick={approveSelectedApplications}
              disabled={isApproving}
              className={`px-3 py-1 text-xs text-white rounded hover:opacity-90 disabled:bg-gray-300 flex items-center transition-colors ${
                approvalStatus === "Approved" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {isApproving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : approvalStatus === "Approved" ? "Approve Selected" : "Reject Selected"}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="text-center py-6 text-xs text-gray-400">
          {searchQuery ? "No matching applications found" : "No applications available"}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-gray-100 rounded shadow-xs">
              <thead>
                <tr className="bg-blue-600 text-white uppercase">
                  {isAdmin && (
                    <th className="p-2 w-8">
                      <input 
                        type="checkbox" 
                        onChange={toggleSelectAll}
                        checked={
                          selectedApps.length > 0 && 
                          selectedApps.length === paginatedApps
                            .filter(app => app.applicationStatus === "Pending")
                            .length
                        }
                        className="transform scale-90"
                      />
                    </th>
                  )}
                  <th className="p-2">Applicant</th>
                  <th className="p-2">Admission</th>
                  <th className="p-2">School/Dept</th>
                  <th className="p-2">Course</th>
                  <th className="p-2">Year</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {paginatedApps.map((app) => (
                  <tr 
                    key={app.bursaryApplicationId} 
                    className={`border-b hover:bg-gray-50 ${
                      selectedApps.includes(app.bursaryApplicationId) ? "bg-blue-50" : ""
                    } ${
                      app.applicationStatus !== "Pending" ? "opacity-80" : ""
                    }`}
                  >
                    {isAdmin && (
                      <td className="p-2">
                        <input
                          type="checkbox"
                          checked={selectedApps.includes(app.bursaryApplicationId)}
                          onChange={() => toggleSelectApp(app.bursaryApplicationId)}
                          className="transform scale-90"
                          disabled={app.applicationStatus !== "Pending"}
                        />
                      </td>
                    )}
                    <td className="p-2">
                      <div className="font-medium">{app.applicantFullName}</div>
                      <div className="text-2xs text-gray-400">{app.applicantPhoneNumber}</div>
                    </td>
                    <td className="p-2">{app.admissionNumber}</td>
                    <td className="p-2">
                      <div>{app.schoolName}</div>
                      <div className="text-2xs text-gray-400">{app.departmentName}</div>
                    </td>
                    <td className="p-2">{app.enrolledCourse}</td>
                    <td className="p-2">{app.yearOfStudy}</td>
                    <td className="p-2 font-medium">
                      {app.amountAppliedFor?.currency}{" "}
                      {app.amountAppliedFor?.amount?.toLocaleString()}
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-1.5 py-0.5 text-2xs font-medium rounded-full ${
                          app.applicationStatus === "Approved"
                            ? "bg-green-50 text-green-700 border border-green-100"
                            : app.applicationStatus === "Rejected"
                            ? "bg-red-50 text-red-700 border border-red-100"
                            : "bg-yellow-50 text-yellow-700 border border-yellow-100"
                        }`}
                      >
                        {app.applicationStatus}
                        {app.applicationStatus === "Approved" && (
                          <span className="ml-1">✓</span>
                        )}
                      </span>
                      {app.batchNumber && app.batchNumber !== "Not assigned" && (
                        <div className="text-2xs mt-0.5 text-gray-400">Batch: {app.batchNumber}</div>
                      )}
                    </td>
                    <td className="p-2">
                      {formatDate(app.applicationDate)}
                    </td>
                   <td className="p-2">
                      <button
                        className="px-2 py-1 text-xs font-normal bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        onClick={() => openModal(app)}
                      >
                        {isAdmin ? "View/Update" : "View"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredApps.length > itemsPerPage && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-3 gap-2">
              <div className="text-2xs text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredApps.length)} of{" "}
                {filteredApps.length}
              </div>
              <div className="flex space-x-1">
                <button
                  className={`px-2 py-1 text-xs rounded ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  First
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <span className="px-2 py-1 text-xs bg-gray-100 rounded">
                  {currentPage}/{totalPages}
                </span>
                <button
                  className={`px-2 py-1 text-xs rounded ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                  onChange={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </button>
              </div>
            </div>
          )}
        </>
      )}

     {selectedApplication && (
       <BursaryApprovalDetailsModal
        application={selectedApplication}
        onClose={closeModal}
        onUpdateSuccess={handleUpdateSuccess}
  />
)}
      
    </div>
  );
}

export default BursaryApplicationsTable;