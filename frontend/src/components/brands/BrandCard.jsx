import { useNavigate } from "react-router-dom";
import { FaFolderOpen } from "react-icons/fa";
import GlassCard from "../ui/GlassCard";

const BrandCard = ({ brand, onDelete }) => {
  const navigate = useNavigate();

  return (
    <GlassCard className="flex flex-col justify-between hover:scale-[1.02]">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-blue-600 text-xl">
          <FaFolderOpen />
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-800">{brand.name}</h3>

          <p className="text-gray-500 text-sm">{brand.field}</p>
        </div>
      </div>

      <div className="flex justify-between mt-4 text-sm">
        <button
          onClick={() => navigate(`/brand/${brand._id}`)}
          className="text-blue-600 hover:underline"
        >
          Open Workspace
        </button>

        <button
          onClick={() => onDelete(brand._id)}
          className="text-red-500 hover:underline"
        >
          Delete
        </button>
      </div>
    </GlassCard>
  );
};

export default BrandCard;
