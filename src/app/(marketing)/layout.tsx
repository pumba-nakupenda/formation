import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-4 md:px-8 py-8">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
}
