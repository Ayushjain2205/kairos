export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src="/kairos.svg" alt="Kairos Logo" className="w-12" />
      <span className="text-2xl font-barriecito text-gray-900">Kairos</span>
    </div>
  );
}
