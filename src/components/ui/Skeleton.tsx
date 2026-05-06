export default function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Title */}
      <div className="h-6 w-3/4 bg-gray-300 rounded"></div>

      {/* Lines */}
      <div className="h-4 w-full bg-gray-300 rounded"></div>
      <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
      <div className="h-4 w-2/3 bg-gray-300 rounded"></div>

      {/* Box */}
      <div className="h-40 w-full bg-gray-300 rounded"></div>
    </div>
  );
}