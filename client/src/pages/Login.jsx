import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 text-white px-4">
      <div className="p-8 bg-white rounded-2xl shadow-2xl text-slate-800 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-5 text-center">TenantTalk Login</h2>

        <input
          placeholder="Username"
          className="border p-2 w-full mb-2"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          placeholder="Password"
          type="password"
          className="border p-2 w-full mb-4"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white w-full p-2 rounded-lg mt-3"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}