'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    const getLinkClass = (path: string) => {
        const active = isActive(path);
        const base = "flex items-center justify-center gap-3 px-6 py-3 rounded-[10px] transition-all font-semibold text-sm";

        if (active) {
            return `${base} bg-black text-white shadow-md w-[248px] h-[78px] `;
        }
        return `${base} text-[#E85D04] hover:bg-orange-50 w-[248px] h-[78px] `;
    };

    const getIconClass = (path: string) => {
        return isActive(path) ? "brightness-0 invert" : "";
    };

    return (
        <header>
            <div className="flex justify-between items-center h-24 px-10 bg-white ">
                <div>
                    <Image src="/images/logo.svg" alt="Logo" width={150} height={150} />
                </div>
                <div className="flex gap-4">
                    <Link href="/dashboard" className={getLinkClass('/dashboard')}>
                        <Image
                            src="/images/Group-3.svg"
                            alt="Dashboard"
                            width={20}
                            height={20}
                            className={getIconClass('/dashboard')}
                        />
                        Tableau de bord
                    </Link>
                    <Link href="/projects" className={getLinkClass('/projects')}>
                        <Image
                            src="/images/Union.svg"
                            alt="Projets"
                            width={20}
                            height={20}
                            className={getIconClass('/projects')}
                        />
                        Projets
                    </Link>
                </div>
                <div>
                    {/* Avatar placeholder */}
                    <div className="w-18 h-18 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold border border-gray-200">
                        AD
                    </div>
                </div>
            </div>
        </header>
    );
}