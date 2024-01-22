export default function Section({ children }: { children: Readonly<React.ReactNode> }) {
    return (
        <div className="w-full flex-1 rounded-xl py-2 gap-8">
            <div className="max-w-screen-md px-4 lg:max-w-screen-xl lg:px-8">
                {children}
            </div>
        </div>
    );
};