interface StatsCardProps {
    title: string;
    value: string | number;
}

export default function StatsCard({ title, value }: StatsCardProps) {
    return (
        <div className="shadow-lg rounded-lg p-6 text-center">
            <h3 className="text-xl mb-2">{title}</h3>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    );
}
