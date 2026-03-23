import { useEffect, useState } from "react";
import API from "../api/axios";

export default function AdminProperties() {
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState({});
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState({
    unit_no: "",
    rent_amount: "",
    people_living: 1,
    tenant_age: "",
  });

  const handleAssign = async (propertyId) => {
    const tenantId = selectedTenant[propertyId];

    if (!tenantId) {
      alert("Select tenant first");
      return;
    }

    await API.put(`/properties/${propertyId}/assign`, { tenantId });
    fetchProperties();
  };

  const handleUnassign = async (propertyId) => {
    await API.put(`/properties/${propertyId}/unassign`);
    fetchProperties();
  };

  const fetchProperties = async () => {
    const res = await API.get("/properties");
    setProperties(res.data);
  };

  useEffect(() => {
  fetchProperties();

  API.get("/admin/tenants")
    .then((res) => setTenants(res.data))
    .catch(() => console.log("Error loading tenants"));
}, []);

  const createProperty = async () => {
    const payload = {
      unit_no: form.unit_no,
      rent_amount: Number(form.rent_amount),
      people_living: Number(form.people_living),
      tenant_age: form.tenant_age ? Number(form.tenant_age) : undefined,
    };

    await API.post("/properties", payload);
    setForm({ unit_no: "", rent_amount: "", people_living: 1, tenant_age: "" });
    fetchProperties();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Property Management</h1>
      </div>

      {/* Create Property */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 mb-6">
        <h2 className="text-lg mb-3">Add Property</h2>

        <input
          placeholder="Unit No"
          className="border p-2 w-full mb-2 rounded"
          onChange={(e) => setForm({ ...form, unit_no: e.target.value })}
        />

        <input
          placeholder="Rent Amount"
          className="border p-2 w-full mb-2 rounded"
          value={form.rent_amount}
          onChange={(e) =>
            setForm({ ...form, rent_amount: e.target.value })
          }
        />

        <input
          type="number"
          min={1}
          placeholder="People Living"
          className="border p-2 w-full mb-2 rounded"
          value={form.people_living}
          onChange={(e) =>
            setForm({ ...form, people_living: e.target.value })
          }
        />

        <input
          type="number"
          min={0}
          placeholder="Tenant Age"
          className="border p-2 w-full mb-3 rounded"
          value={form.tenant_age}
          onChange={(e) =>
            setForm({ ...form, tenant_age: e.target.value })
          }
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={createProperty}
        >
          Add Property
        </button>
      </div>

      {/* Properties List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[calc(100vh-240px)] overflow-y-auto">
        {properties.map((p) => (
          <div key={p._id} className="bg-white p-4 rounded-xl shadow min-h-[220px]">
            <h3 className="font-semibold">Unit: {p.unit_no}</h3>
            <p>Rent: ₹ {p.rent_amount}</p>
            <p>People Living: {p.people_living || 1}</p>
            <p>Status: {p.status}</p>

            <p className="text-sm text-gray-600">
              Tenant: {p.tenant?.username ? `${p.tenant.username}${p.tenant.age ? ` (Age: ${p.tenant.age})` : ""}` : "None"}
            </p>

            <div className="mt-2 flex gap-2">
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => handleUnassign(p._id)}
                disabled={!p.tenant}
              >
                Unassign
              </button>
            </div>

            {/* Assign Tenant */}
            <div className="mt-3 flex gap-2 items-center">
              <select
                className="border p-2 rounded"
                onChange={(e) =>
                  setSelectedTenant({
                    ...selectedTenant,
                    [p._id]: e.target.value,
                  })
                }
              >
                <option value="">Select Tenant</option>

                {tenants.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.username}
                  </option>
                ))}
              </select>

              <button
                className="bg-green-600 text-white px-3 py-2 rounded"
                onClick={() => handleAssign(p._id)}
              >
                Assign
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}