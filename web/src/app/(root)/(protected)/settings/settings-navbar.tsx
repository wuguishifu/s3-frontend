import Link from "next/link";
import { usePathname } from "next/navigation";
import sections from "./settings-def";

const focusedLinkClass = 'font-bold opacity-100';
const unfocusedLinkClass = 'opacity-70';

export default function SettingsNavbar() {
    const pathname = usePathname();
    return (
        <nav className="w-32">
            {sections.map(section =>
                <div key={section.sectionName}>
                    <h3>{section.sectionName}</h3>
                    {section.links.map(link => (
                        <Link key={link.label} href={link.href}>
                            <p className={link.highlightFn(pathname) ? focusedLinkClass : unfocusedLinkClass}>
                                {link.label}
                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
};