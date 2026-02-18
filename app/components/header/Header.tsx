'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useData } from "@/app/context/DataContext";
import { useState } from "react";



type ModalType = "PROFIL" | null;

export default function Header() {
    const pathname = usePathname();
    const { user } = useData();


    const isActive = (path: string) => pathname === path;

    const getLinkClass = (path: string) => {
        const active = isActive(path);
        const base = "flex items-center justify-center gap-0 md:gap-3 rounded-[10px] transition-all font-semibold text-sm";

        if (active) {
            return `${base} bg-black text-white shadow-md w-[50px] h-[50px] md:w-[248px] md:h-[78px]`;
        }
        return `${base} text-[#E85D04] hover:bg-orange-50 w-[50px] h-[50px] md:w-[248px] md:h-[78px]`;
    };

    const getIconClass = (path: string) => {
        return isActive(path) ? "brightness-0 invert" : "";
    };

    // Calcul des initiales
    const getInitials = () => {
        if (!user || !user.name) return "AD";
        return user.name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header>
            <div className="flex justify-between items-center h-20 md:h-24 px-4 md:px-10 bg-white">
                <div>
                    <Image src="/images/logo.svg" alt="Logo" width={150} height={150} className="w-[110px] md:w-[150px]" />
                </div>
                <div className="flex gap-2 md:gap-4">
                    <Link href="/dashboard" className={getLinkClass('/dashboard')}>
                        <Image
                            src="/images/Group-3.svg"
                            alt="Dashboard"
                            width={20}
                            height={20}
                            className={getIconClass('/dashboard')}
                        />
                        <span className="hidden md:block">Tableau de bord</span>
                    </Link>
                    <Link href="/projet" className={getLinkClass('/projet')}>
                        <Image
                            src="/images/Union.svg"
                            alt="Projets"
                            width={20}
                            height={20}
                            className={getIconClass('/projet')}
                        />
                        <span className="hidden md:block">Projets</span>
                    </Link>
                </div>
                <div>
                    <Link href="/compte/moncompte">
                        {/* Avatar dynamique */}
                        <button
                            className={`w-[40px] h-[40px] md:w-[50px] md:h-[50px] rounded-full flex items-center justify-center text-[12px] md:text-[14px] font-normal transition-all border cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-200 ${pathname.startsWith('/compte')
                                ? "bg-[#E85D04] text-white "
                                : "bg-orange-100 text-gray-700 border-orange-50 hover:bg-orange-100"
                                }`}
                            title={user?.name || "Chargement..."}
                        >
                            {getInitials()}
                        </button>
                    </Link>

                </div>
            </div>

        </header>
    );
}