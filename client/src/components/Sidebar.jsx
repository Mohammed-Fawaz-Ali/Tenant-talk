import { Link } from "react-router-dom";

export default function Sidebar({ role }) {
  return (
    <div className="w-72 h-full bg-gradient-to-b from-blue-900 to-indigo-900 text-white p-5 shadow-xl overflow-y-auto">
      <h2 className="text-2xl font-bold tracking-wide mb-6">TenantTalk</h2>

      <nav className="flex flex-col gap-3">
        <Link className="px-3 py-2 rounded hover:bg-blue-800 transition" to="/dashboard">Dashboard</Link>

        {role === "tenant" && (
          <>
            <Link className="px-3 py-2 rounded hover:bg-blue-800 transition" to="/tickets">My Tickets</Link>
            <Link className="px-3 py-2 rounded hover:bg-blue-800 transition" to="/payments">My Payments</Link>
          </>
        )}

        {role === "admin" && (
          <>
            <Link className="px-3 py-2 rounded hover:bg-blue-800 transition" to="/admin/tickets">All Tickets</Link>
            <Link className="px-3 py-2 rounded hover:bg-blue-800 transition" to="/admin/properties">Properties</Link>
            <Link className="px-3 py-2 rounded hover:bg-blue-800 transition" to="/admin/tenants">Tenants</Link>
            <Link className="px-3 py-2 rounded hover:bg-blue-800 transition" to="/admin/payments">Payments</Link>
          </>
        )}
      </nav>
    </div>
  );
}