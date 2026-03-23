import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { getUser } from "../utils/getUser";

export default function Layout({ children }) {
  const user = getUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 text-slate-800">
      <div className="flex h-screen overflow-hidden">
        <Sidebar role={user?.role} />

        <div className="flex-1 overflow-y-auto">
          <Topbar />
          <div className="p-6 max-w-[1400px] mx-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}