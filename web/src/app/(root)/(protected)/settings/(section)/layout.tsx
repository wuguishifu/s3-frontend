export default function Section({ children }: { children: Readonly<React.ReactNode> }) {
    return (
        <main className="flex flex-col gap-8 items-center">
            {children}
        </main>
    );
};