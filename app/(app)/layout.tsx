import Sidebar from "@/components/Sidebar";
import ToastContainer from "@/components/Toast";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-zinc-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <ToastContainer />
    </div>
  );
}
