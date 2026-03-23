import { useEffect, useState } from "react";
import API from "../api/axios";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    const res = await API.get("/transactions");
    setPayments(res.data);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const verifyPayment = async (id) => {
    await API.put(`/transactions/${id}/verify`);
    fetchPayments();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">All Payments</h1>
      </div>

      <div className="grid gap-4">
        {payments.map((p) => (
          <div key={p._id} className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold">₹ {p.amount}</h3>

            <p className="text-sm text-gray-600">
              Tenant: {p.tenant?.username}
            </p>

            <p className="text-sm">{p.month}</p>

            {p.receipt_image && (
              <img
                src={p.receipt_image}
                className="mt-2 rounded w-full max-h-56 object-contain border border-gray-200"
                alt="Receipt"
              />
            )}

            <div className="mt-3">
              {p.is_verified ? (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded">
                  Verified
                </span>
              ) : (
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() => verifyPayment(p._id)}
                >
                  Verify
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}