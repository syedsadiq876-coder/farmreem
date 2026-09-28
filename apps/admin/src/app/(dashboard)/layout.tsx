import AdminSidebar from "../../components/layout/Sidebar";
import AdminHeader from "../../components/layout/Header";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#FAF7F2] overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#FAF7F2]">
          {children}
        </main>
      </div>
    </div>
  );
}
