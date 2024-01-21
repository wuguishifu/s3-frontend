import Navbar from "@/components/navbar/navbar";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <Navbar />
            <div className="flex-1">
                {children}
            </div>
        </>
    );
};