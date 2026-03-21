interface StatsCardProps {
    title: string;
    value: string | number;
}

export default function StatsCard({ title, value }: StatsCardProps) {
    return (
        <div className="shadow-lg rounded-lg p-6 text-center">
            <h3 className="text-sm font-medium mb-1 text-text opacity-70 uppercase tracking-wider">{title}</h3>
            <p className="text-xl font-bold">{value}</p>
        </div>
    );
}
