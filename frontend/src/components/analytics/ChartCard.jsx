import GlassCard from "../ui/GlassCard";

const ChartCard = ({ title, children }) => {
  const hasContent =
    children && !(Array.isArray(children) && children.length === 0);

  return (
    <GlassCard className="min-h-[320px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>

        <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
          Analytics
        </span>
      </div>

      {hasContent ? (
        children
      ) : (
        <div className="flex items-center justify-center h-52">
          <p className="text-sm text-gray-400">No data available</p>
        </div>
      )}
    </GlassCard>
  );
};

export default ChartCard;
