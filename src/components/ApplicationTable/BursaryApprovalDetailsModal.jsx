import { useEffect, useState } from "react";
import { FiX, FiUser, FiBook, FiDollarSign, FiCheckCircle, FiClock, FiAlertCircle, FiEdit2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BursaryApprovalDetailsModal = ({ application, onClose, onUpdateSuccess }) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [approvalDetails, setApprovalDetails] = useState(null);
  const [bursaryDetails, setBursaryDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    applicationId: "",
    applicantFullName: "",
    applicantPhoneNumber: "",
    emailAddress: "",
    admissionNumber: "",
    nationalIdentificationNumber: "",
    schoolName: "",
    departmentName: "",
    enrolledCourse: "",
    yearOfStudy: "",
    previousAcademicYearGrade: "",
    sponsorshipType: "",
    anyFormOfDisability: "",
    applicationStatus: "",
    county: "",
    batchNumber: "",
    amountAppliedFor: { amount: 0, currency: "KES" },
    amountAllocated: { amount: 0, currency: "KES" },
    remark: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both details in parallel
      const [approvalResponse, bursaryResponse] = await Promise.all([
        fetch(`https://localhost:7094/api/Bursary/approval/bursary-application-id/${application.bursaryApplicationId}`),
        fetch(`https://localhost:7094/api/Bursary/get/${application.bursaryApplicationId}`)
      ]);

      if (!approvalResponse.ok || !bursaryResponse.ok) {
        throw new Error("Failed to fetch application details");
      }

      const [approvalData, bursaryData] = await Promise.all([
        approvalResponse.json(),
        bursaryResponse.json()
      ]);

      setApprovalDetails(approvalData);
      setBursaryDetails(bursaryData);

      // Initialize form data with the fetched values
      setFormData({
        applicationId: bursaryData.bursaryApplicationId,
        applicantFullName: bursaryData.applicantFullName || "",
        applicantPhoneNumber: bursaryData.applicantPhoneNumber || "",
        emailAddress: bursaryData.applicantEmail || "",
        admissionNumber: bursaryData.admissionNumber || "",
        nationalIdentificationNumber: bursaryData.nationalIdentificationNumber || "",
        schoolName: bursaryData.schoolName || "",
        departmentName: bursaryData.departmentName || "",
        enrolledCourse: bursaryData.enrolledCourse || "",
        yearOfStudy: bursaryData.yearOfStudy || "",
        previousAcademicYearGrade: bursaryData.previousAcademicYearGrade || "",
        sponsorshipType: bursaryData.sponsorshipType || "",
        anyFormOfDisability: bursaryData.anyFormOfDisability || "",
        applicationStatus: approvalData.approvalStatus || "Pending",
        county: bursaryData.county || "",
        batchNumber: approvalData.assignedBatchNumber || "",
        amountAppliedFor: bursaryData.amountAppliedFor || { amount: 0, currency: "KES" },
        amountAllocated: approvalData.amountAllocated || { amount: 0, currency: "KES" },
        remark: approvalData.remark || ""
      });

    } catch (error) {
      console.error("Error fetching details:", error);
      setError("Unable to load details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!application || !application.bursaryApplicationId) {
      setError("Invalid application data");
      setLoading(false);
      return;
    }
    fetchApplicationDetails();
  }, [application]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmountChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      amountAllocated: {
        ...prev.amountAllocated,
        [name]: name === "amount" ? parseFloat(value) || 0 : value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        applicationId: formData.applicationId,
        applicantFullName: formData.applicantFullName,
        applicantPhoneNumber: formData.applicantPhoneNumber,
        emailAddress: formData.emailAddress,
        admissionNumber: formData.admissionNumber,
        nationalIdentificationNumber: formData.nationalIdentificationNumber,
        schoolName: formData.schoolName,
        departmentName: formData.departmentName,
        enrolledCourse: formData.enrolledCourse,
        yearOfStudy: formData.yearOfStudy,
        previousAcademicYearGrade: formData.previousAcademicYearGrade,
        sponsorshipType: formData.sponsorshipType,
        anyFormOfDisability: formData.anyFormOfDisability,
        applicationStatus: formData.applicationStatus,
        county: formData.county,
        batchNumber: formData.batchNumber
      };

      const response = await fetch(
        `https://localhost:7094/api/Bursary/update/${formData.applicationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Update failed");
      }

      await fetchApplicationDetails();
      
      setShowEditForm(false);
      
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }

    } catch (error) {
      console.error("Update error:", error);
      toast.error(`Failed to update: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const StatusIndicator = ({ status }) => {
    const statusConfig = {
      Approved: {
        icon: <FiCheckCircle className="w-4 h-4" />,
        color: "bg-emerald-100 text-emerald-700",
      },
      Rejected: {
        icon: <FiAlertCircle className="w-4 h-4" />,
        color: "bg-red-100 text-red-700",
      },
      Pending: {
        icon: <FiClock className="w-4 h-4" />,
        color: "bg-amber-100 text-amber-700",
      },
    };

    const config = statusConfig[status] || statusConfig.Pending;

    return (
      <motion.span
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.icon}
        <span className="ml-1">{status}</span>
      </motion.span>
    );
  };

  if (!application) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
        >
        
          <AnimatePresence>
            {showEditForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white z-10 p-6 rounded-xl"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Update Application</h3>
                  <button
                    onClick={() => setShowEditForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[70vh] pr-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="applicantFullName"
                        value={formData.applicantFullName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="applicantPhoneNumber"
                        value={formData.applicantPhoneNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="emailAddress"
                        value={formData.emailAddress}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Admission Number</label>
                      <input
                        type="text"
                        name="admissionNumber"
                        value={formData.admissionNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">National ID</label>
                      <input
                        type="text"
                        name="nationalIdentificationNumber"
                        value={formData.nationalIdentificationNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                      <input
                        type="text"
                        name="schoolName"
                        value={formData.schoolName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <input
                        type="text"
                        name="departmentName"
                        value={formData.departmentName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                      <input
                        type="text"
                        name="enrolledCourse"
                        value={formData.enrolledCourse}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study</label>
                      <input
                        type="text"
                        name="yearOfStudy"
                        value={formData.yearOfStudy}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Previous Grade</label>
                      <input
                        type="text"
                        name="previousAcademicYearGrade"
                        value={formData.previousAcademicYearGrade}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sponsorship Type</label>
                      <input
                        type="text"
                        name="sponsorshipType"
                        value={formData.sponsorshipType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Disability</label>
                      <input
                        type="text"
                        name="anyFormOfDisability"
                        value={formData.anyFormOfDisability}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">County</label>
                      <input
                        type="text"
                        name="county"
                        value={formData.county}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                    {user.role === "ROLE_ADMIN" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <select
                            name="applicationStatus"
                            value={formData.applicationStatus}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
                          <input
                            type="text"
                            name="batchNumber"
                            value={formData.batchNumber}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            disabled={formData.applicationStatus === "Rejected"}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Amount Allocated</label>
                          <div className="flex">
                            <select
                              name="currency"
                              value={formData.amountAllocated.currency}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  amountAllocated: { ...prev.amountAllocated, currency: e.target.value },
                                }))
                              }
                              className="px-3 py-2 border border-gray-300 rounded-l-md text-sm"
                              disabled={formData.applicationStatus === "Rejected"}
                            >
                              <option value="KES">KES</option>
                              <option value="USD">USD</option>
                            </select>
                            <input
                              type="number"
                              name="amount"
                              value={formData.amountAllocated.amount}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  amountAllocated: { ...prev.amountAllocated, amount: parseFloat(e.target.value) || 0 },
                                }))
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-r-md text-sm"
                              min="0"
                              disabled={formData.applicationStatus === "Rejected"}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
                          <input
                            type="text"
                            name="remark"
                            value={formData.remark}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowEditForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Updating...
                        </span>
                      ) : (
                        "Update Application"
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Modal Content */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Bursary Application Details</h2>
              <p className="text-sm text-gray-500 mt-1">
                Application ID: {application.bursaryApplicationId}
              </p>
            </div>
            {user?.role === "ROLE_STUDENT" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowEditForm(true)}
                className="flex items-center text-sm bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-3 py-1.5 rounded-lg transition-colors"
              >
                <FiEdit2 className="mr-1.5" />
                Edit
              </motion.button>
            )}
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50 hover:scrollbar-thumb-blue-300 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
            {loading ? (
              <div className="flex justify-center items-center py-8 h-full">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
                />
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm h-full flex items-center">
                <div className="flex items-center">
                  <FiAlertCircle className="w-5 h-5 mr-2" />
                  {error}
                </div>
              </div>
            ) : (
              <div className="space-y-6 pb-2">
                {/* Applicant Information */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex items-center mb-3">
                    <FiUser className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="text-base font-medium text-gray-800">Applicant Information</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Full Name</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {bursaryDetails?.applicantFullName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Phone Number</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {bursaryDetails?.applicantPhoneNumber || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Email</p>
                      <p className="text-sm text-gray-900 mr-3 mt-1">
                        {bursaryDetails?.applicantEmail || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Disable?</p>
                      <p className="text-sm text-gray-900 ml-3 mt-1">
                        {bursaryDetails?.anyFormOfDisability || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Admission Number</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {bursaryDetails?.admissionNumber || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">National ID</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {bursaryDetails?.nationalIdentificationNumber || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">County</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {bursaryDetails?.county || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Application Date</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {new Date(bursaryDetails?.applicationDate).toDateString()|| "N/A"}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Academic Information */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex items-center mb-3">
                    <FiBook className="w-5 h-5 text-indigo-600 mr-2" />
                    <h3 className="text-base font-medium text-gray-800">Academic Information</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500">School</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {bursaryDetails?.schoolName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Department</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {bursaryDetails?.departmentName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Course</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {bursaryDetails?.enrolledCourse || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Year of Study</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {bursaryDetails?.yearOfStudy || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Previous Grade</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {bursaryDetails?.previousAcademicYearGrade|| "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Sponsorship Type</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {bursaryDetails?.sponsorshipType || "N/A"}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Approval Information */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex items-center mb-3">
                    <FiDollarSign className="w-5 h-5 text-green-600 mr-2" />
                    <h3 className="text-base font-medium text-gray-800">Approval Information</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Approver</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {approvalDetails?.approverFullName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Status</p>
                      <div className="mt-1">
                        <StatusIndicator status={approvalDetails?.approvalStatus} />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Batch Number</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {approvalDetails?.assignedBatchNumber || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Approved Date</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {approvalDetails?.approvedDate
                          ? new Date(approvalDetails.approvedDate).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Amount Applied</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {approvalDetails?.amountAppliedFor?.amount
                          ? `${approvalDetails.amountAppliedFor.amount} ${approvalDetails.amountAppliedFor.currency}`
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Amount Allocated</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {approvalDetails?.amountAllocated?.amount
                          ? `${approvalDetails.amountAllocated.amount} ${approvalDetails.amountAllocated.currency}`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  {approvalDetails?.remark && (
                    <div className="mt-4">
                      <p className="text-xs font-medium text-gray-500">Remark</p>
                      <p className="text-sm text-gray-900 mt-1 bg-white p-2 rounded border border-gray-200">
                        {approvalDetails.remark}
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Close Details
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BursaryApprovalDetailsModal;