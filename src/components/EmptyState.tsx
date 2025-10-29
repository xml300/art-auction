import Image from "next/image";

interface EmptyStateProps {
    iconSrc?: string;
    title: string;
    message: string;
}

export default function EmptyState({ iconSrc, title, message }: EmptyStateProps) {
    return (
        <div className="col-span-full flex flex-col items-center justify-center text-center p-12 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-inner">
            {iconSrc && (
                <Image src={iconSrc} width={800} height={800} alt={title} className="h-24 w-24 mb-4 text-gray-400 dark:text-gray-500" />
            )}
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400">{message}</p>
        </div>
    );
}
