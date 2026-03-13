import GlassCard from "../ui/GlassCard";

const ChartCard = ({ title, children }) => {
  return (
    <GlassCard>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </GlassCard>
  );
};

export default ChartCard;
