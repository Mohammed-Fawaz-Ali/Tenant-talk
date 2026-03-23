import { useEffect, useState } from "react";
import API from "../api/axios";

export default function AdminTenants() {
  const [tenants, setTenants] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    phone: "",
    age: "",
    people_living: "",
  });
  const [addForm, setAddForm] = useState({
    name: "",
    username: "",
    password: "",
    phone: "",
    age: "",
    people_living: "",
  });
  const [message, setMessage] = useState("");

  const fetchTenants = async () => {
    const res = await API.get("/admin/tenants");
    setTenants(res.data);
  };

  useEffect(() => {
    const loadTenants = async () => {
      await fetchTenants();
    };

    loadTenants();
  }, []);

  const handleSelectTenant = (tenant) => {
    setSelected(tenant);
    setForm({
      name: tenant.name || "",
      username: tenant.username || "",
      password: "",
      phone: tenant.phone || "",
      age: tenant.age || "",
      people_living: tenant.people_living || "",
    });
    setMessage("");
  };

  const handleCreateTenant = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await API.post("/admin/create-tenant", {
        name: addForm.name,
        username: addForm.username,
        password: addForm.password,
        phone: addForm.phone,
        age: Number(addForm.age) || undefined,
        people_living: Number(addForm.people_living) || undefined,
      });

      setMessage("Tenant created successfully.");
      setAddForm({
        name: "",
        username: "",
        password: "",
        phone: "",
        age: "",
        people_living: "",
      });
      fetchTenants();
    } catch (err) {
      setMessage(err?.response?.data?.message || "Unable to create tenant");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selected) return;

    try {
      await API.put(`/admin/tenant/${selected._id}`, {
        name: form.name,
        username: form.username,
        password: form.password,
        phone: form.phone,
        age: Number(form.age) || undefined,
        people_living: Number(form.people_living) || undefined,
      });

      setMessage("Tenant updated successfully.");
      setForm({ ...form, password: "" });
      fetchTenants();
    } catch (err) {
      setMessage(err?.response?.data?.message || "Unable to update tenant");
    }
  };

  const handleDeleteTenant = async (tenantId) => {
    if (!window.confirm("Are you sure you want to delete this tenant?")) return;

    try {
      await API.delete(`/admin/tenant/${tenantId}`);
      setMessage("Tenant deleted successfully.");
      if (selected?._id === tenantId) {
        setSelected(null);
        setForm({ name: "", username: "", password: "", phone: "", age: "", people_living: "" });
      }
      fetchTenants();
    } catch (err) {
      setMessage(err?.response?.data?.message || "Unable to delete tenant");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tenant Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow col-span-1">
          <h2 className="text-lg mb-3">Add Tenant</h2>
          <form onSubmit={handleCreateTenant} className="space-y-2">
            <input
              value={addForm.name}
              onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
              placeholder="Name"
              className="w-full border rounded p-2"
              required
            />
            <input
              value={addForm.username}
              onChange={(e) => setAddForm({ ...addForm, username: e.target.value })}
              placeholder="Username"
              className="w-full border rounded p-2"
              required
            />
            <input
              value={addForm.password}
              onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
              type="password"
              placeholder="Password"
              className="w-full border rounded p-2"
              required
            />
            <input
              value={addForm.phone}
              onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
              placeholder="Phone"
              className="w-full border rounded p-2"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                min={0}
                value={addForm.age}
                onChange={(e) => setAddForm({ ...addForm, age: e.target.value })}
                placeholder="Age"
                className="w-full border rounded p-2"
              />
              <input
                type="number"
                min={1}
                value={addForm.people_living}
                onChange={(e) => setAddForm({ ...addForm, people_living: e.target.value })}
                placeholder="People Living"
                className="w-full border rounded p-2"
              />
            </div>
            <button className="w-full bg-green-600 text-white rounded px-4 py-2">Create Tenant</button>
          </form>
        </div>

        <div className="bg-white p-4 rounded-xl shadow md:col-span-2">
          <h2 className="text-lg mb-3">Tenant List & Edit</h2>
          <div className="space-y-2 mb-4">
            {tenants.map((tenant) => (
              <div key={tenant._id} className="flex items-center justify-between p-2 rounded bg-slate-50">
                <button
                  className={`flex-1 text-left ${selected?._id === tenant._id ? "text-blue-700" : ""}`}
                  onClick={() => handleSelectTenant(tenant)}
                >
                  <strong>{tenant.username}</strong> - {tenant.name}
                </button>
                <button
                  className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDeleteTenant(tenant._id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <h2 className="text-lg mb-3">Edit Tenant</h2>
          {message && <div className="mb-3 text-sm text-green-600">{message}</div>}
          {!selected ? (
            <p>Select a tenant to edit details.</p>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-3">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
                className="w-full border rounded p-2"
                required
              />
              <input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="Username"
                className="w-full border rounded p-2"
                required
              />
              <input
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Password (leave blank to keep current)"
                type="password"
                className="w-full border rounded p-2"
              />
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Phone"
                className="w-full border rounded p-2"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min={0}
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  placeholder="Age"
                  className="w-full border rounded p-2"
                />
                <input
                  type="number"
                  min={1}
                  value={form.people_living}
                  onChange={(e) => setForm({ ...form, people_living: e.target.value })}
                  placeholder="People Living"
                  className="w-full border rounded p-2"
                />
              </div>
              <button className="bg-blue-600 text-white rounded px-4 py-2">Update Tenant</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

