import { useEffect, useState } from "react";
import API from "../api/axios";

export default function AdminDashboard() {
  const [data, setData] = useState({
    properties: 0,
    payments: 0,
    tickets: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const props = await API.get("/properties");
      const pays = await API.get("/transactions");
      const tickets = await API.get("/tickets");

      setData({
        properties: props.data.length,
        payments: pays.data.length,
        tickets: tickets.data.length,
      });
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg">Properties</h2>
          <p className="text-2xl">{data.properties}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg">Payments</h2>
          <p className="text-2xl">{data.payments}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg">Tickets</h2>
          <p className="text-2xl">{data.tickets}</p>
        </div>
      </div>
    </div>
  );
}