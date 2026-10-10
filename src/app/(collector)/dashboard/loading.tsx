import LoadingSpinner from "@/components/LoadingSpinner";

export default function Loading() {
  return (
    <div className="w-full min-h-[400px] flex items-center justify-center p-8">
      <LoadingSpinner size="lg" message="Loading your dashboard..." />
    </div>
  );
}