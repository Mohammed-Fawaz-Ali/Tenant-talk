import { getUser } from "../utils/getUser";

export default function Dashboard() {
  const user = getUser();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
        <h2 className="text-xl font-semibold mb-3">Welcome, {user?.name || "User"}</h2>

        {user?.role === "admin" ? (
          <div className="grid gap-3 md:grid-cols-2">
            <div className="p-4 bg-slate-50 rounded-lg shadow-sm border">Manage tenants</div>
            <div className="p-4 bg-slate-50 rounded-lg shadow-sm border">Manage properties</div>
            <div className="p-4 bg-slate-50 rounded-lg shadow-sm border">Review payments</div>
            <div className="p-4 bg-slate-50 rounded-lg shadow-sm border">Handle tickets</div>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            <div className="p-4 bg-slate-50 rounded-lg shadow-sm border">My tickets</div>
            <div className="p-4 bg-slate-50 rounded-lg shadow-sm border">My payments</div>
          </div>
        )}
      </div>
    </div>
  );
}