import { useEffect, useState } from "react";
import API from "../api/axios";

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    const res = await API.get("/tickets");
    setTickets(res.data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const updateStatus = async (id, status) => {
    await API.put(`/tickets/${id}`, { status });
    fetchTickets();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">All Tickets</h1>
      </div>

      <div className="grid gap-4">
        {tickets.map((t) => (
          <div key={t._id} className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold">{t.title}</h3>
            <p>{t.description}</p>

            <p className="text-sm text-gray-500">
              Tenant: {t.tenant?.username}
            </p>
            <p className="text-sm font-medium">
              Status: 
              <span className={
                t.status === "resolved"
                  ? "text-green-600"
                  : t.status === "in-progress"
                  ? "text-yellow-600"
                  : "text-gray-600"
              }>
                {t.status}
              </span>
            </p>

            {t.image_url && (
              <img
                src={t.image_url}
                className="mt-2 rounded w-full max-h-56 object-contain border border-gray-200"
                alt="Ticket image"
              />
            )}

            <div className="mt-3 flex gap-2">
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded"
                onClick={() => updateStatus(t._id, "in-progress")}
              >
                In Progress
              </button>

              <button
                className="bg-green-600 text-white px-3 py-1 rounded"
                onClick={() => updateStatus(t._id, "resolved")}
              >
                Resolve
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}