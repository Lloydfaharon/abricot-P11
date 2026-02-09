'use client';

import Image from "next/image";
import { usePathname } from "next/navigation";

export default function InterfacesTdB() {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

    const getLinkClass = (path: string) => {
        const active = isActive(path);
        const base = "flex items-center justify-center gap-3 px-6 py-3 rounded-[10px] transition-all font-semibold text-sm";

        if (active) {
            return `${base}  bg-[#FFE8D9]  text-[#E85D04] w-[94px] h-[45px] `;
        }
        return `${base}  bg-white text-[#E85D04] hover:bg-orange-50 w-[111px] h-[45px] `;
    };


    return (
        <div>
            <div className="flex gap-4">
                <button className={getLinkClass('/dashboard')}>
                    <Image
                        src="/images/Group-4.svg"
                        alt="Dashboard"
                        width={20}
                        height={20}

                    />
                    Liste
                </button>
                <button className={getLinkClass('/kanban')}>
                    <Image
                        src="/images/union-2.svg"
                        alt="Kanban"
                        width={20}
                        height={20}

                    />
                    Kanban
                </button>
            </div>
        </div>
    );
}