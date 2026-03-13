import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GlassCard from "../../components/ui/GlassCard";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";
import toast from "react-hot-toast";
import { getBrandById } from "../../services/brandService";

import { Calendar, FileText, Link2, BarChart3 } from "lucide-react";

const Workspace = () => {
  const { brandId } = useParams();
  const navigate = useNavigate();

  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const data = await getBrandById(brandId);
        setBrand(data);
      } catch {
        toast.error("Failed to load brand");
      }

      setLoading(false);
    };

    fetchBrand();
  }, [brandId]);

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSkeleton />
      </div>
    );
  }

  if (!brand) {
    return <p>Brand not found</p>;
  }

  /* workspace modules */

  const modules = [
    {
      title: "Content Calendar",
      description: "Plan upcoming social media posts.",
      icon: Calendar,
      path: `/brand/${brandId}/calendar`,
    },
    {
      title: "Posts",
      description: "Manage created social media posts.",
      icon: FileText,
      path: `/brand/${brandId}/posts`,
    },
    {
      title: "Backlinks",
      description: "Track backlink building activities.",
      icon: Link2,
      path: `/brand/${brandId}/backlinks`,
    },
    {
      title: "Analytics",
      description: "View performance insights.",
      icon: BarChart3,
      path: `/brand/${brandId}/analytics`,
    },
  ];

  return (
    <>
      {/* BRAND HEADER */}

      <GlassCard className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">{brand.name}</h1>
        <p className="text-gray-600 mt-1">{brand.field}</p>
      </GlassCard>

      {/* WORKSPACE MODULES */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((module, index) => {
          const Icon = module.icon;

          return (
            <GlassCard
              key={index}
              onClick={() => navigate(module.path)}
              className="group cursor-pointer"
            >
              <div className="flex flex-col items-start space-y-4">
                {/* Icon */}

                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition">
                  <Icon size={22} />
                </div>

                {/* Title */}

                <h3 className="text-lg font-semibold text-gray-800">
                  {module.title}
                </h3>

                {/* Description */}

                <p className="text-sm text-gray-600 leading-relaxed">
                  {module.description}
                </p>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </>
  );
};

export default Workspace;
