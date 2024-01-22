import { cn } from "@/lib/utils"

export default function SettingsSection({ children, className, id }: { children: Readonly<React.ReactNode>, className?: string, id?: string }) {
    return (
        <div id={id} className={cn('w-full flex-1 rounded-xl bg-white px-4 py-2 shadow-sm border border-slate-200 gap-8', className)}>
            {children}
        </div>
    );
};