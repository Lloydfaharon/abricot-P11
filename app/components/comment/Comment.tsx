type CommentProps = {
    content: string
    authorName: string
    createdAt: string
}



export default function Comment({
    content,
    authorName,
    createdAt
}: CommentProps) {
    const getInitials = (name: string) => {
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    return (
        <div className="flex gap-3 p-3 hover: rounded-lg transition-colors">
            {/* Avatar Placeholder */}
            <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-gray-500">
                {getInitials(authorName)}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1 h-full  py-[18px] px-[14px]  w-full rounded-lg bg-gray-100">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">{authorName}</span>
                    <span className="text-xs text-gray-400">{createdAt}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                    {content}
                </p>
            </div>
        </div>
    );
}

