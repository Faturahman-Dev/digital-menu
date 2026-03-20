import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-screen bg-gray-50 overflow-hidden'>
      
      {/* Satpam 1: Ini Sidebar yang udah pinter (Responsive) */}
      <Sidebar />

      {/* Main Content Area */}
      <main className='flex-1 overflow-y-auto w-full pt-16 md:pt-0'>
        {children}
      </main>
      
    </div>
  );
}