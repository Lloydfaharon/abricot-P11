// components/ProjectCard.tsx
import React from "react";

type Avatar = {
    initials: string; // ex: "AD"
};

type ProjectCardProps = {
    title: string;
    description?: string;
    progressPercent: number; // 0 -> 100
    doneTasks: number; // ex: 0
    totalTasks: number; // ex: 2
    teamCount: number; // ex: 3
    ownerLabel?: string; // ex: "Propriétaire"
    ownerAvatars?: Avatar[]; // ex: [{initials:"AD"},{initials:"BC"},{initials:"CV"}]
};

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

function IconUsers(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 18.5c0-1.93-1.79-3.5-4-3.5s-4 1.57-4 3.5"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 12.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 18.5c0-1.43-1-2.68-2.43-3.2M17.5 6.9a2.6 2.6 0 0 1 0 5.2"
            />
        </svg>
    );
}

function AvatarPill({ initials, className = "" }: { initials: string, className?: string }) {
    return (
        <span className={`inline-flex h-8 w-8  px-1 py-1 items-center justify-center rounded-full ring-2 ring-white text-[10px]  shrink-0 ${className}`}>
            {initials}
        </span>
    );
}

export default function ProjectCard({
    title,
    description = "Description du projet",
    progressPercent,
    doneTasks,
    totalTasks,
    teamCount,
    ownerLabel = "Propriétaire",
    ownerAvatars = [{ initials: "AD" }, { initials: "BC" }, { initials: "CV" }],
}: ProjectCardProps) {
    const pct = clamp(Math.round(progressPercent), 0, 100);

    return (
        <div className="w-full max-w-[380px] h-[351px] rounded-2xl flex flex-col gap-[36px] px-[34px] py-[30px] border border-gray-200 bg-white transition-all hover:shadow-md group-focus:ring-4 group-focus:ring-orange-200 group-focus:border-orange-500">
            {/* Title + description */}
            <div>
                <h3 className="text-[14px] font-semibold text-gray-900">{title}</h3>
                <p className="mt-1 text-[11px] leading-snug text-gray-400">
                    {description}
                </p>
            </div>

            {/* Progress */}
            <div className="mt-4">
                <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span>Progression</span>
                    <span>{pct}%</span>
                </div>

                <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100">
                    <div
                        className="h-1.5 rounded-full bg-orange-300"
                        style={{ width: `${pct}%` }}
                    />
                </div>

                <p className="mt-2 text-[11px] text-gray-400">
                    {doneTasks}/{totalTasks} tâches terminées
                </p>
            </div>

            {/* Footer */}
            <div className="mt-6 flex flex-col gap-3">
                {/* Team Label */}
                <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium">
                    <IconUsers className="h-4 w-4" />
                    <span>Équipe ({teamCount})</span>
                </div>

                {/* Avatars Row */}
                <div className="flex items-center gap-2">
                    {/* Owner Avatar (First one) */}
                    {ownerAvatars.length > 0 && (
                        <AvatarPill initials={ownerAvatars[0].initials} className="inline-flex h-8 w-8  px-1 py-1  bg-amber-50 border-white  items-center justify-center rounded-full  text-[10px] font-semibold text-gray-600 shrink-0" />
                    )}

                    {/* Owner Badge */}
                    <div className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1">
                        <span className="text-[11px] font-semibold text-amber-600">
                            {ownerLabel}
                        </span>
                    </div>

                    {/* Other Avatars */}
                    <div className="flex items-center -space-x-2 ml-1">
                        {ownerAvatars.slice(1, 4).map((a, idx) => (
                            <AvatarPill
                                key={`${a.initials}-${idx}`}
                                initials={a.initials}
                                className="bg-gray-100 text-gray-600 font-semibold"
                            />
                        ))}
                        {ownerAvatars.length > 4 && (
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-[10px] font-semibold text-gray-600  ring-white ring-2">
                                +{ownerAvatars.length - 4}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
