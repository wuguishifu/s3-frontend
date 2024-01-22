import Navbar from "@/components/navbar/navbar";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <Navbar />
            <div className="flex-1 px-4 md:px-8 w-full max-w-screen-xl">
                {children}
            </div>
        </>
    );
};