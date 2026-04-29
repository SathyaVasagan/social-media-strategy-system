import { Skeleton } from "@mui/material";

const LoadingSkeleton = () => {
  return (
    <div className="space-y-6">
      <Skeleton variant="rounded" height={100} sx={{ borderRadius: "24px" }} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton
            key={i}
            variant="rounded"
            height={120}
            sx={{ borderRadius: "24px" }}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Skeleton
            key={i}
            variant="rounded"
            height={250}
            sx={{ borderRadius: "24px" }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
