import GlassCard from "./GlassCard";

const ErrorState = ({ message = "Something went wrong." }) => {
  return (
    <GlassCard className="text-center">
      <h2 className="text-xl font-semibold text-red-600">Error</h2>

      <p className="mt-2 text-gray-600">{message}</p>
    </GlassCard>
  );
};

export default ErrorState;
