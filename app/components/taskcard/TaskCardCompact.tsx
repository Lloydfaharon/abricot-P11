// components/TaskCardCompact.tsx
import React from "react";
import Link from "next/link";

type TaskStatus = "À faire" | "En cours" | "Terminé";

type TaskCardCompactProps = {
  title: string;
  description?: string;
  projectName: string;
  dateLabel: string;
  projectId: string;
  commentsCount: number;
  status: TaskStatus;
  onView?: () => void;
};

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

export default function TaskCardCompact({
  title,
  description = "Description de la tâche",
  projectName,
  dateLabel,
  projectId,
  commentsCount,
  status,
}: TaskCardCompactProps) {
  return (
    <div className="w-full max-w-[360px] rounded-2xl border border-gray-200 bg-white px-5 py-4 flex flex-col gap-[15px]  ">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[16px] font-semibold text-gray-900 truncate">
            {title}
          </h3>
          <p className="mt-0.5 text-xs text-gray-400 truncate">
            {description}
          </p>
        </div>

        <span
          className={[
            "shrink-0 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
            statusStyles[status],
          ].join(" ")}
        >
          {status}
        </span>
      </div>

      {/* Meta */}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <IconFolder className="h-4 w-4" />
          <span className="truncate">{projectName}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <IconCalendar className="h-4 w-4" />
          <span>{dateLabel}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <IconMessage className="h-4 w-4" />
          <span>{commentsCount}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4">
        <Link
          href={`/projet/${projectId}`}
          className="rounded-xl bg-gray-900 px-6 py-2.5 lg:px-10 lg:py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 active:scale-[0.99] w-auto sm:w-auto text-center"
        >
          Voir
        </Link>
      </div>
    </div>
  );
}
