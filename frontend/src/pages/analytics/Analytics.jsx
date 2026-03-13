import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GlassCard from "../../components/ui/GlassCard";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";
import ChartCard from "../../components/analytics/ChartCard";
import toast from "react-hot-toast";

import { getAnalytics } from "../../services/analyticsService";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#1E3A8A", "#38BDF8", "#14B8A6", "#6366F1"];

const Analytics = () => {
  const { brandId } = useParams();

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const analytics = await getAnalytics(brandId);
        setData(analytics);
      } catch {
        toast.error("Failed to load analytics");
      }
    };

    fetchAnalytics();
  }, [brandId]);

  if (!data) return <LoadingSkeleton />;

  const { cards, charts } = data;

  /* CONTENT TYPE DATA */

  const contentData = charts.contentTypeStats.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  /* PLATFORM DATA */

  const platformData =
    charts.platformStats?.map((item) => ({
      name: item._id,
      value: item.count,
    })) || [];

  /* POST FREQUENCY */

  const postFrequency = charts.postingFrequency.map((item) => ({
    week: `W${item._id}`,
    posts: item.count,
  }));

  /* BACKLINK FREQUENCY */

  const backlinkFrequency = charts.backlinkFrequency.map((item) => ({
    week: `W${item._id}`,
    backlinks: item.count,
  }));

  /* INSIGHT LOGIC */

  const mostUsedContent =
    contentData.length > 0
      ? contentData.reduce((prev, curr) =>
          prev.value > curr.value ? prev : curr
        )
      : null;

  const avgPostsPerWeek =
    postFrequency.length > 0
      ? (
          postFrequency.reduce((sum, w) => sum + w.posts, 0) /
          postFrequency.length
        ).toFixed(1)
      : 0;

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Analytics</h2>

      {/* KPI SUMMARY */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <GlassCard>
          <h3 className="text-gray-600">Posts Created</h3>
          <p className="text-3xl font-bold">{cards.totalPosts}</p>
        </GlassCard>

        <GlassCard>
          <h3 className="text-gray-600">Posts Planned</h3>
          <p className="text-3xl font-bold">{cards.plannedPosts}</p>
        </GlassCard>

        <GlassCard>
          <h3 className="text-gray-600">Backlinks Built</h3>
          <p className="text-3xl font-bold">{cards.totalBacklinks}</p>
        </GlassCard>
      </div>

      {/* INSIGHT PANEL */}

      <GlassCard className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Insights</h3>

        <ul className="text-sm text-gray-700 space-y-1">
          {mostUsedContent && (
            <li>
              Most used content type:{" "}
              <strong>{mostUsedContent.name}</strong>
            </li>
          )}

          <li>
            Average posts per week: <strong>{avgPostsPerWeek}</strong>
          </li>

          <li>
            Total backlinks built:{" "}
            <strong>{cards.totalBacklinks}</strong>
          </li>
        </ul>
      </GlassCard>

      {/* MAIN ANALYTICS CHARTS */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {/* CONTENT TYPE */}

        <ChartCard title="Content Type Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={contentData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                isAnimationActive
              >
                {contentData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* PLATFORM DISTRIBUTION */}

        <ChartCard title="Platform Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={platformData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                isAnimationActive
              >
                {platformData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>

      {/* ACTIVITY CHARTS */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* POSTING FREQUENCY */}

        <ChartCard title="Posting Frequency">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={postFrequency}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="posts"
                fill="#1E3A8A"
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* BACKLINK GROWTH */}

        <ChartCard title="Backlink Growth">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={backlinkFrequency}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="backlinks"
                fill="#14B8A6"
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>
    </>
  );
};

export default Analytics;