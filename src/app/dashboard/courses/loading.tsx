import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="grid gap-4">
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </div>
  );
}