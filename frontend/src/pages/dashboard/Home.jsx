import { useEffect, useState } from "react";
import GlassCard from "../../components/ui/GlassCard";
import API from "../../services/api";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";
import ChartCard from "../../components/analytics/ChartCard";

import {
  FaLayerGroup,
  FaCalendarAlt,
  FaRegFileAlt,
  FaLink,
  FaArrowUp,
  FaClock,
} from "react-icons/fa";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

const StatCard = ({ title, value, icon }) => {
  return (
    <GlassCard className="relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-400"></div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-500 text-sm">{title}</h3>
          <p className="text-3xl font-bold mt-1 text-gray-900">{value}</p>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 text-2xl">
          {icon}
        </div>
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
    alerts: {},
    upcoming: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/dashboard/stats");
        setStats(res.data);
      } catch (error) {
        console.error(
          "Stats fetch failed:",
          error.response?.data || error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSkeleton />;

  const contentData = [
    { name: "Reel", value: 5 },
    { name: "Carousel", value: 3 },
    { name: "Static", value: 2 },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <GlassCard className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome back 👋</h1>
            <p className="text-sm text-blue-100 mt-1">
              Here’s what’s happening with your social strategy today.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
            <FaArrowUp />
            Productivity Up
          </div>
        </div>
      </GlassCard>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
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

      {/* ALERT + UPCOMING */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold mb-4">Attention Required</h3>

          <div className="space-y-3 text-sm">
            {stats.alerts?.missedPosts > 0 && (
              <p className="text-red-600">
                ⚠️ {stats.alerts.missedPosts} posts missed schedule
              </p>
            )}

            {stats.alerts?.drafts > 0 && (
              <p className="text-yellow-600">
                📝 {stats.alerts.drafts} drafts pending
              </p>
            )}

            {stats.alerts?.missedPosts === 0 && stats.alerts?.drafts === 0 && (
              <p className="text-green-600">✅ All good</p>
            )}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-semibold mb-4">Upcoming (Next 24h)</h3>

          {stats.upcoming?.length === 0 ? (
            <p className="text-sm text-gray-500">No upcoming posts</p>
          ) : (
            <div className="space-y-3 text-sm">
              {stats.upcoming.map((p) => (
                <div
                  key={p._id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <span>{p.title}</span>
                  <span className="text-gray-500 flex items-center gap-1">
                    <FaClock />
                    {new Date(p.scheduledAt).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>


      {/* ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Content Mix">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={contentData} dataKey="value" outerRadius={80}>
                {contentData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <GlassCard>
          <h3 className="text-lg font-semibold mb-2">Smart Insight</h3>

          <p className="text-sm text-gray-600 leading-7">
            Your posting consistency is improving. Scheduling at least 5 quality
            posts per week can significantly improve engagement and reach.
          </p>
        </GlassCard>
      </div>
    </div>
  );
};

export default Home;
