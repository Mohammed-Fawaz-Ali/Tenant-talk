export default function Topbar() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="h-14 bg-white shadow-sm border-b border-slate-200 flex items-center justify-between px-6">
      <div className="text-slate-600 font-semibold">Welcome back</div>
      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-1.5 rounded"
      >
        Logout
      </button>
    </div>
  );
}