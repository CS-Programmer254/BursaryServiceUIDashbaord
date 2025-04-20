import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const PAYPAL_TEST_EMAIL = 'sb-fixqo36569043@personal.example.com';

function BatchPayoutForm() {
  const [batchNumber, setBatchNumber] = useState('');
  const [bursaries, setBursaries] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [payoutResult, setPayoutResult] = useState(null);
  const [error, setError] = useState(null);

  const fetchBursaries = async () => {
    if (!batchNumber) return;

    try {
      const response = await axios.get('https://localhost:7094/api/Bursary/all', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const batchData = response.data.filter(
        (bursary) => bursary.batchNumber === batchNumber
      );
      setBursaries(batchData);
      setError(null);
      setPayoutResult(null);
      setProgress(0);
    } catch (err) {
      console.error('Fetch failed:', err);
      setError(err.response?.data || err.message);
      setBursaries([]);
      setPayoutResult(null);
      setProgress(0);
    }
  };

  const processPayout = async () => {
    if (bursaries.length === 0) return;

    // Filter for approved applications
    const approvedBursaries = bursaries.filter(
      (bursary) => bursary.applicationStatus === 'Approved'
    );

    if (approvedBursaries.length === 0) {
      setError('No approved bursaries to process');
      return;
    }

    setIsProcessing(true);
    setPayoutResult(null);
    setError(null);
    setProgress(0);

    try {
      // Initial processing step
      setProgress(10);

      // Prepare payload matching PayoutRequestDto
      const payoutPayload = {
        sender_batch_header: {
          sender_batch_id: `BURSARY_${batchNumber}_${Date.now()}`,
          email_subject: 'Bursary Payment Notification',
          email_message: 'Your bursary payment has been processed.',
        },
        items: approvedBursaries.map((bursary) => ({
          recipient_type: 'EMAIL',
          amount: {
            value: (bursary.amountAppliedFor.amount / 100).toFixed(2),
            currency: 'USD',
          },
          note: `Bursary payment for ${bursary.applicantFullName}`,
          sender_item_id: `BURSARY_${bursary.admissionNumber}`,
          receiver: PAYPAL_TEST_EMAIL,
        })),
      };

      // Simulate processing steps
      setProgress(30);
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Send to backend
      setProgress(50);
      const response = await axios.post(
        'https://localhost:7124/api/PayPalPayout/send',
        payoutPayload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Processing complete
      setProgress(80);
      await new Promise((resolve) => setTimeout(resolve, 200));

      setPayoutResult(response.data);
      setProgress(100);

   

      // Reset progress after success
      setTimeout(() => setProgress(0), 500);
    } catch (err) {
      console.error('Payout failed:', err);
      setError(err.response?.data || err.message);
      setProgress(0);

    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Bursary Payout Processing</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-3">
            <strong>Test batch:</strong> BATCH-1744620433938
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
              placeholder="Enter batch number"
              className="flex-grow p-3 border rounded-lg"
            />
            <button
              onClick={fetchBursaries}
              className="bg-blue-500 text-white px-5 py-3 rounded-lg hover:bg-blue-600"
            >
              Find Bursaries
            </button>
          </div>
        </div>

        {isProcessing && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Processing payments</span>
                  <span className="text-sm font-medium text-blue-600">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-blue-500 h-2 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {bursaries.length > 0 && !isProcessing && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">
              {bursaries.length} Bursaries Ready for Payout
            </h2>
            <button
              onClick={processPayout}
              disabled={isProcessing}
              className="bg-green-500 text-white px-5 py-3 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
            >
              Send PayPal Payout
            </button>
          </div>
        )}

        {payoutResult && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-100 mb-4">
            <h3 className="font-bold text-green-800">Payout Successful!</h3>
            <p>Batch ID: {payoutResult.batch_header.payout_batch_id}</p>
            <p>Status: {payoutResult.batch_header.batch_status}</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800">Payout Failed</h3>
            <pre className="text-sm text-red-600 overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {bursaries.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <details>
            <summary className="font-medium cursor-pointer">Payload Sent to Backend</summary>
            <pre className="mt-2 p-2 bg-white rounded text-sm overflow-auto">
              {JSON.stringify(
                {
                  sender_batch_header: {
                    sender_batch_id: `BURSARY_${batchNumber}_${Date.now()}`,
                    email_subject: 'Bursary Payment Notification',
                    email_message: 'Your bursary payment has been processed.',
                  },
                  items: bursaries
                    .filter((bursary) => bursary.applicationStatus === 'Approved')
                    .map((b) => ({
                      recipient_type: 'EMAIL',
                      amount: {
                        value: (b.amountAppliedFor.amount / 100).toFixed(2),
                        currency: 'USD',
                      },
                      note: `Bursary payment for ${b.applicantFullName}`,
                      sender_item_id: `BURSARY_${b.admissionNumber}`,
                      receiver: PAYPAL_TEST_EMAIL,
                    })),
                },
                null,
                2
              )}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}

export default BatchPayoutForm;