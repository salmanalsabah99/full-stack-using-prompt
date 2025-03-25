export default function TaskListSkeleton() {
  return (
    <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 shadow-lg w-64 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="h-6 w-32 bg-white/10 rounded-lg animate-pulse" />
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-white/10 rounded-lg animate-pulse" />
          <div className="h-8 w-8 bg-white/10 rounded-lg animate-pulse" />
        </div>
      </div>

      <div className="flex-1 min-h-[100px] space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-white/10 rounded-lg animate-pulse" />
        ))}
      </div>

      <div className="h-10 bg-white/10 rounded-lg animate-pulse" />
    </div>
  );
} 