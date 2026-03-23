import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    month: "",
    receipt: null,
  });

  const fetchPayments = async () => {
    const res = await API.get("/transactions/my");
    setPayments(res.data);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleSubmit = async () => {
    const data = new FormData();
    data.append("amount", form.amount);
    data.append("month", form.month);
    data.append("receipt", form.receipt);

    await API.post("/transactions", data);
    fetchPayments();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Payments</h1>
      </div>

      {/* Upload Payment */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 mb-6">
        <h2 className="text-lg mb-3">Pay Rent</h2>

        <input
          placeholder="Amount"
          className="border p-2 w-full mb-2 rounded"
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <input
          placeholder="Month (e.g. March-2026)"
          className="border p-2 w-full mb-2 rounded"
          onChange={(e) => setForm({ ...form, month: e.target.value })}
        />

        <input
          type="file"
          className="mb-3"
          onChange={(e) => setForm({ ...form, receipt: e.target.files[0] })}
        />

        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleSubmit}
        >
          Submit Payment
        </button>
      </div>

      {/* Payment List */}
      <div className="grid gap-4">
        {payments.map((p) => (
          <div key={p._id} className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold">₹ {p.amount}</h3>
            <p className="text-sm text-gray-600">{p.month}</p>

            {p.receipt_image && (
              <img
                src={p.receipt_image}
                className="mt-2 rounded w-full max-h-56 object-contain border border-gray-200"
                alt="Payment receipt"
              />
            )}

            <span
              className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${
                p.is_verified
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {p.is_verified ? "Verified" : "Pending"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}