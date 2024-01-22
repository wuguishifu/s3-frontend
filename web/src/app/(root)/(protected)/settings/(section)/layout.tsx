export default function Section({ children }: { children: Readonly<React.ReactNode> }) {
    return (
        <div className="w-full flex-1 rounded-xl py-2 gap-8">
            {children}
        </div>
    );
};