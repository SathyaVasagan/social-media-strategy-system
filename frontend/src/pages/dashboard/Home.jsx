import { useEffect, useState } from "react";
import GlassCard from "../../components/ui/GlassCard";
import API from "../../services/api";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";

import {
  FaLayerGroup,
  FaCalendarAlt,
  FaRegFileAlt,
  FaLink,
} from "react-icons/fa";

const StatCard = ({ title, value, icon }) => {
  return (
    <GlassCard className="relative overflow-hidden">
      {/* Accent bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-400"></div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-500 text-sm">{title}</h3>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>

        <div className="text-blue-600 text-2xl opacity-80">{icon}</div>
      </div>
    </GlassCard>
  );
};

const Home = () => {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    brands: 0,
    posts: 0,
    planned: 0,
    backlinks: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/dashboard/stats");
        setStats(res.data);
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div>
      {/* Stats */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Brands"
          value={stats.brands}
          icon={<FaLayerGroup />}
        />

        <StatCard
          title="Posts Created"
          value={stats.posts}
          icon={<FaRegFileAlt />}
        />

        <StatCard
          title="Posts Planned"
          value={stats.planned}
          icon={<FaCalendarAlt />}
        />

        <StatCard
          title="Backlinks Built"
          value={stats.backlinks}
          icon={<FaLink />}
        />
      </div>

      {/* Lower Section */}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>

          <div className="space-y-2">
            <a href="/brands" className="block text-blue-600 hover:underline">
              Manage Brands
            </a>

            <a href="/brands" className="block text-blue-600 hover:underline">
              Create New Brand
            </a>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-semibold mb-3">System Overview</h3>

          <p className="text-gray-600 text-sm leading-relaxed">
            This dashboard helps marketing teams manage social media content
            strategy, organize backlinks, and analyze campaign activity across
            multiple brands.
          </p>
        </GlassCard>
      </div>
    </div>
  );
};

export default Home;
