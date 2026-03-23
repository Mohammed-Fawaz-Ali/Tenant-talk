import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", image: null });

  const fetchTickets = async () => {
    const res = await API.get("/tickets/my");
    setTickets(res.data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      alert("Please add a title for the ticket.");
      return;
    }

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    if (form.image) data.append("image", form.image);

    try {
      await API.post("/tickets", data);
      setForm({ title: "", description: "", image: null });
      fetchTickets();
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        (typeof error?.response?.data === "object" ? JSON.stringify(error.response.data) : null) ||
        "Failed to create ticket";

      alert(serverMessage);
      console.error("Ticket submit error", serverMessage, error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Tickets</h1>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
        <h2 className="text-lg mb-3">Raise New Ticket</h2>

        <input
          placeholder="Title"
          className="border p-2 w-full mb-2 rounded"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="border p-2 w-full mb-2 rounded"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="file"
          className="mb-3"
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSubmit}
        >
          Submit Ticket
        </button>
      </div>

      {/* Ticket List */}
      <div className="grid gap-4">
        {tickets.map((t) => (
          <div key={t._id} className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold">{t.title}</h3>
            <p className="text-sm text-gray-600">{t.description}</p>

            {t.image_url && (
              <img
                src={t.image_url}
                className="mt-2 rounded w-full max-h-56 object-contain border border-gray-200"
                alt="Ticket issue"
              />
            )}

            <span
              className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${
                t.status === "resolved"
                  ? "bg-green-100 text-green-700"
                  : t.status === "in-progress"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {t.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}