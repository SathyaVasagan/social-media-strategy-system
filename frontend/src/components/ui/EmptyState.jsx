import GlassCard from "./GlassCard";

const EmptyState = ({ title, description }) => {
  return (
    <GlassCard className="text-center">
      <h3 className="text-lg font-semibold">{title}</h3>

      <p className="text-gray-500 mt-2">{description}</p>
    </GlassCard>
  );
};

export default EmptyState;
