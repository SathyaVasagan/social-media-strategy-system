import { Skeleton } from "@mui/material";

const LoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton variant="rectangular" height={120} />
      <Skeleton variant="rectangular" height={120} />
      <Skeleton variant="rectangular" height={120} />
    </div>
  );
};

export default LoadingSkeleton;
