import AdminHeader from '@/src/components/AdminHeader';
import AdminSidebar from '@/src/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0d0f1a] text-white">
      <AdminHeader />

      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}