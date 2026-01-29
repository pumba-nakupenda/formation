import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-orange-500/30">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-12">
                    {children}
                </div>
            </main>
        </div>
    );
}
