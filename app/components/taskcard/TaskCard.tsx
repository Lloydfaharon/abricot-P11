import Link from "next/link";

type TaskStatus = "À faire" | "En cours" | "Terminé";

type TaskCardProps = {
    title: string;
    description?: string;
    projectName: string;
    projectId: string;
    dateLabel: string; // ex: "9 mars"
    commentsCount: number;
    status: TaskStatus;
    onView?: () => void;
};
// ... (keep intermediate code if it matches, but replace_file_content needs distinct blocks. I will do it in chunks or one go if small enough)
// Actually I need to replace the top part value and the bottom part value.
// I will use multi_replace.

const statusStyles: Record<TaskStatus, string> = {
    "À faire": "bg-rose-100 text-rose-500",
    "En cours": "bg-amber-100 text-amber-600",
    "Terminé": "bg-emerald-100 text-emerald-600",
};

function IconFolder(props: React.SVGProps<SVGSVGElement>) {
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
                d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2h6.5A2.5 2.5 0 0 1 21 9.5v9A2.5 2.5 0 0 1 18.5 21h-13A2.5 2.5 0 0 1 3 18.5v-11Z"
            />
        </svg>
    );
}

function IconCalendar(props: React.SVGProps<SVGSVGElement>) {
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
                d="M8 3v2m8-2v2M4.5 9h15M6.5 5h11A2.5 2.5 0 0 1 20 7.5v12A2.5 2.5 0 0 1 17.5 22h-11A2.5 2.5 0 0 1 4 19.5v-12A2.5 2.5 0 0 1 6.5 5Z"
            />
        </svg>
    );
}

function IconMessage(props: React.SVGProps<SVGSVGElement>) {
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
                d="M7 8h10M7 12h7m-9 8 3.5-2H19a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H5A3 3 0 0 0 2 7v10a3 3 0 0 0 3 3Z"
            />
        </svg>
    );
}

export default function TaskCard({
    title,
    description = "Description de la tâche",
    projectName,
    projectId,
    dateLabel,
    commentsCount,
    status,
}: TaskCardProps) {
    return (
        <div className="w-full h-auto lg:h-45 rounded-2xl border border-gray-200 bg-white px-5 py-5 lg:px-7 lg:py-6 flex flex-col justify-center transition-all hover:shadow-md">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6 w-full">
                {/* Left */}
                <div className="min-w-0 flex flex-col gap-3 lg:gap-4 w-full sm:w-auto flex-1">
                    <div>
                        <h2 className="text-base lg:text-lg font-semibold text-gray-900 leading-tight">{title}</h2>
                        <p className="mt-1 text-sm text-gray-400 line-clamp-2">{description}</p>
                    </div>

                    <div className="mt-3 lg:mt-5 flex flex-wrap items-center gap-y-2 gap-x-3 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <IconFolder className="h-4 w-4 lg:h-4.5 lg:w-4.5" />
                            <span className="truncate max-w-30 sm:max-w-50">{projectName}</span>
                        </div>

                        <span className="text-gray-200 hidden sm:inline">|</span>

                        <div className="flex items-center gap-2">
                            <IconCalendar className="h-4 w-4 lg:h-4.5 lg:w-4.5" />
                            <span>{dateLabel}</span>
                        </div>

                        <span className="text-gray-200 hidden sm:inline">|</span>

                        <div className="flex items-center gap-2">
                            <IconMessage className="h-4 w-4 lg:h-4.5 lg:w-4.5" />
                            <span>{commentsCount}</span>
                        </div>
                    </div>
                </div>

                {/* Right */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-10 w-full sm:w-auto mt-2 sm:mt-0 border-t border-gray-100 sm:border-0 pt-4 sm:pt-0">
                    <span
                        className={[
                            "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shrink-0",
                            statusStyles[status],
                        ].join(" ")}
                    >
                        {status}
                    </span>

                    <Link
                        href={`/projet/${projectId}`}
                        className="rounded-xl bg-gray-900 px-6 py-2.5 lg:px-10 lg:py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 active:scale-[0.99] w-auto sm:w-auto text-center"
                    >
                        Voir
                    </Link>
                </div>
            </div>
        </div>
    );
}
