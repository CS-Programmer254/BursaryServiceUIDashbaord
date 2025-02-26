import PageWrapper from "../components/Animation/PageWrapper";
import { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { motion } from "framer-motion";
import { Howl } from "howler";
import { FiCheckCircle } from "react-icons/fi";

import DisbursmentReport from "../components/ReportsSection/DisbursmentReport";
import BursaryApplicationsReport from "../components/ReportsSection/BursaryApplicationsReport";
import NotificationReport from "../components/ReportsSection/NotificationReport";
import PaymentVouchers from "../components/ReportsSection/PaymentVouchers";

function Reports() {
  const [selectedReport, setSelectedReport] = useState("Payment Vouchers");
  const [filteredData, setFilteredData] = useState([]);
  const [showToast, setShowToast] = useState(false);

  const isDataAvailable = filteredData.length > 0;

  const playSuccessSound = () => {
    const sound = new Howl({ src: ["/success.wav"], volume: 0.5 });
    sound.play();
  };

  const showSuccessToast = () => {
    setShowToast(true);
    playSuccessSound();
    setTimeout(() => setShowToast(false), 4000);
  };

  const formatAmount = (amountObj) => {
    return amountObj
      ? `${amountObj.currency} ${amountObj.amount.toLocaleString()}`
      : "N/A";
  };

  const exportToExcel = () => {
    if (!isDataAvailable) return;

    const formattedData = filteredData.map((item) => ({
      ...item,
      "Amount Applied For": formatAmount(item.amountAppliedFor),
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, selectedReport);

    XLSX.writeFile(wb, `${selectedReport}.xlsx`);
    showSuccessToast();
  };

  const exportToCSV = () => {
    if (!isDataAvailable) return;

    const formattedData = filteredData.map((item) => ({
      ...item,
      "Amount Applied For": formatAmount(item.amountAppliedFor),
    }));

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [Object.keys(formattedData[0]).join(",")]
        .concat(formattedData.map((item) => Object.values(item).join(",")))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedReport}.csv`);
    document.body.appendChild(link);
    link.click();
    showSuccessToast();
  };

const exportToPDF = () => {
    if (!isDataAvailable) return;
  
    let formattedData = filteredData.map((item) => {
      if (selectedReport === "Notification Report") {
        item = { ...item, notificationDetails: item.notificationDetails?.message || "N/A" };
      }
      return {
        ...item,
        "Amount Applied For": formatAmount(item.amountAppliedFor),
      };
    });

    let columns, rows;
  
    if (selectedReport === "Bursary Applications") {
      formattedData = formattedData.map(({ 
        applicantFullName, 
        admissionNumber, 
        schoolName, 
        departmentName, 
        enrolledCourse, 
        yearOfStudy, 
        applicationStatus, 
        applicationDate, 
        amountAppliedFor 
      }) => ({
        "Full Name": applicantFullName,
        "Admission No": admissionNumber,
        "School": schoolName,
        "Department": departmentName,
        "Course": enrolledCourse,
        "Year": yearOfStudy,
        "Status": applicationStatus,
        "Application Date": new Date(applicationDate).toLocaleDateString(),
        "Amount Applied": amountAppliedFor 
          ? `${amountAppliedFor.currency} ${amountAppliedFor.amount.toLocaleString()}`
          : "N/A"
      }));
  
      columns = Object.keys(formattedData[0] || {});
      rows = formattedData.map((item) => Object.values(item));
    } else {
    
      formattedData = formattedData.map(({ amount, ...rest }) => rest);
      columns = Object.keys(formattedData[0] || {});
      rows = formattedData.map((item) => Object.values(item));
    }
  
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  
    let fontSize = columns.length > 6 ? 8 : 10;
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(`${selectedReport} Report`, 14, 15);
  
    autoTable(doc, {
      startY: 25,
      head: [columns],
      body: rows,
      theme: "striped",
      styles: { fontSize, cellPadding: 4, whiteSpace: "nowrap" },
      headStyles: { fillColor: [52, 152, 219], fontSize: 10, halign: "center" },
      columnStyles: {
        0: { minCellWidth: 25 },
        1: { minCellWidth: 30 },
        2: { minCellWidth: 40 },
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 20 },
      overflow: "hidden",
    });
  
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, doc.internal.pageSize.height - 10);
  
    doc.save(`${selectedReport}.pdf`);
    showSuccessToast();
  };
  


  return (
    <PageWrapper>
      {showToast && (
        <motion.div
          initial={{ y: -50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -50, opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-lg font-bold px-6 py-4 rounded-lg shadow-lg flex items-center space-x-2"
        >
          <FiCheckCircle className="w-6 h-6" />
          <span>{selectedReport} downloaded successfully!</span>
        </motion.div>
      )}

      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-semibold mb-4">Reports & Downloads</h1>

        {/* Report Type Selector */}
        <label className="block font-medium text-gray-700">Select Report:</label>
        <select
          className="border p-2 rounded-lg w-full mt-2"
          value={selectedReport}
          onChange={(e) => setSelectedReport(e.target.value)}
        >
          <option value="Payment Vouchers">Payment Vouchers</option>
          <option value="Disbursement Report">Disbursement Report</option>
          <option value="Bursary Applications">Bursary Applications</option>
          <option value="Notification Report">Notification Report</option>
        </select>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            className={`px-4 py-2 rounded-lg transition-all ${
              isDataAvailable ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={exportToExcel}
            disabled={!isDataAvailable}
          >
            Export Excel
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-all ${
              isDataAvailable ? "bg-green-500 text-white hover:bg-green-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={exportToCSV}
            disabled={!isDataAvailable}
          >
            Export CSV
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-all ${
              isDataAvailable ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={exportToPDF}
            disabled={!isDataAvailable}
          >
            Export PDF
          </button>
        </div>
      </div>

      <div className="mt-6">
        {selectedReport === "Disbursement Report" && <DisbursmentReport setFilteredData={setFilteredData} />}
        {selectedReport === "Bursary Applications" && <BursaryApplicationsReport setFilteredData={setFilteredData} />}
        {selectedReport === "Notification Report" && <NotificationReport setFilteredData={setFilteredData} />}
        {selectedReport === "Payment Vouchers" && <PaymentVouchers setFilteredData={setFilteredData} />}
      </div>
    </PageWrapper>
  );
}

export default Reports;
