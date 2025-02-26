import { useEffect, useState } from "react";

function PaymentVouchers({ setFilteredData }) {
  const [vouchers, setVouchers] = useState([
    { id: 1, student: "John Doe", status: "Pending", amount: 5000 },
    { id: 2, student: "Jane Smith", status: "Approved", amount: 7000 },
    { id: 3, student: "Alice Brown", status: "Completed", amount: 8000 },
  ]);

  useEffect(() => {
    setFilteredData(vouchers);
  }, [vouchers, setFilteredData]);

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Payment Vouchers</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Student</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map((voucher) => (
            <tr key={voucher.id} className="border">
              <td className="p-2">{voucher.id}</td>
              <td className="p-2">{voucher.student}</td>
              <td
                className={`p-2 ${
                  voucher.status === "Pending"
                    ? "text-yellow-500"
                    : voucher.status === "Approved"
                    ? "text-green-500"
                    : "text-blue-500"
                }`}
              >
                {voucher.status}
              </td>
              <td className="p-2">${voucher.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PaymentVouchers;
