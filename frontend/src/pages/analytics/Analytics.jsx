import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import GlassCard from "../../components/ui/GlassCard";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";
import ChartCard from "../../components/analytics/ChartCard";
import toast from "react-hot-toast";

import { getAnalytics } from "../../services/analyticsService";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

/* ✅ FIXED COLOR SYSTEM */
const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

const Analytics = () => {
  const { brandId } = useParams();
  const [data, setData] = useState(null);

  const reportRef = useRef(null);

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

  const exportPDF = async () => {
    try {
      const input = reportRef.current;

      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        scrollY: -window.scrollY,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const today = new Date().toLocaleDateString("en-GB").replace(/\//g, "_");

      pdf.save(`Analytics_Report_${today}.pdf`);
    } catch {
      toast.error("Failed to export PDF");
    }
  };

  if (!data) return <LoadingSkeleton />;

  const { cards, charts, insights } = data;

  if (cards.totalPosts === 0) {
    return (
      <div className="mt-10">
        <GlassCard>
          <h3 className="text-lg font-semibold">No analytics yet</h3>
          <p className="text-gray-500 mt-2">
            Start by creating your first post to unlock insights.
          </p>
        </GlassCard>
      </div>
    );
  }

  const contentData = charts.contentTypeStats.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  const platformData =
    charts.platformStats?.map((item) => ({
      name: item._id,
      value: item.count,
    })) || [];

  const statusData =
    charts.statusStats?.map((item) => ({
      name: item._id,
      value: item.count,
    })) || [];

  const postFrequency = charts.postingFrequency.map((item) => ({
    date: item._id,
    posts: item.count,
  }));

  const backlinkFrequency = charts.backlinkFrequency.map((item) => ({
    date: item._id,
    backlinks: item.count,
  }));

  const mostUsedContent =
    contentData.length > 0
      ? contentData.reduce((prev, curr) =>
          prev.value > curr.value ? prev : curr,
        )
      : null;

  const avgPostsPerWeek =
    postFrequency.length > 0
      ? (
          postFrequency.reduce((sum, w) => sum + w.posts, 0) /
          postFrequency.length
        ).toFixed(1)
      : 0;

  const latestBacklinks =
    backlinkFrequency.length > 0
      ? backlinkFrequency[backlinkFrequency.length - 1].backlinks
      : 0;

  const previousBacklinks =
    backlinkFrequency.length > 1
      ? backlinkFrequency[backlinkFrequency.length - 2].backlinks
      : 0;

  const growth =
    previousBacklinks > 0
      ? (
          ((latestBacklinks - previousBacklinks) / previousBacklinks) *
          100
        ).toFixed(1)
      : 0;

  return (
    <>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Analytics</h2>

        <button
          onClick={exportPDF}
          className="
            bg-gradient-to-r from-blue-600 to-cyan-500
            text-white px-5 py-2.5 rounded-xl
            shadow-md hover:shadow-xl
            hover:scale-105 active:scale-95
            transition-all duration-200
          "
        >
          Export PDF
        </button>
      </div>

      {/* REPORT CONTENT */}
      <div ref={reportRef}>
        {/* KPI SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassCard>
            <h3 className="text-gray-600">Posts Created</h3>
            <p className="text-3xl font-bold animate-pulse">
              {cards.totalPosts}
            </p>
          </GlassCard>

          <GlassCard>
            <h3 className="text-gray-600">Posts Planned</h3>
            <p className="text-3xl font-bold animate-pulse">
              {cards.plannedPosts}
            </p>
          </GlassCard>

          <GlassCard>
            <h3 className="text-gray-600">Backlinks Built</h3>
            <p className="text-3xl font-bold animate-pulse">
              {cards.totalBacklinks}
            </p>
          </GlassCard>
        </div>

        {/* DECISION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <GlassCard>
            <h3 className="text-sm text-gray-500">Best Platform</h3>
            <p className="text-xl font-bold text-green-600">
              {insights?.bestPlatform?._id || "-"}
            </p>
          </GlassCard>

          <GlassCard>
            <h3 className="text-sm text-gray-500">Weak Platform</h3>
            <p className="text-xl font-bold text-yellow-600">
              {insights?.worstPlatform?._id || "-"}
            </p>
          </GlassCard>

          <GlassCard>
            <h3 className="text-sm text-gray-500">Failure Rate</h3>
            <p className="text-xl font-bold text-red-600">
              {insights?.failureRate}%
            </p>
          </GlassCard>

          <GlassCard>
            <h3 className="text-sm text-gray-500">Consistency Score</h3>
            <p
              className={`text-xl font-bold ${
                insights?.consistencyScore > 70
                  ? "text-green-600"
                  : insights?.consistencyScore > 40
                    ? "text-yellow-600"
                    : "text-red-600"
              }`}
            >
              {insights?.consistencyScore}/100
            </p>
          </GlassCard>
        </div>

        {/* INSIGHTS */}
        <GlassCard className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Insights</h3>

          <ul className="text-sm text-gray-700 space-y-1">
            {mostUsedContent && (
              <li>
                Most used content type: <strong>{mostUsedContent.name}</strong>
              </li>
            )}
            <li>
              Average posts per week: <strong>{avgPostsPerWeek}</strong>
            </li>
            <li>
              Backlink growth: <strong>{growth}%</strong>
            </li>
            <li>
              Total backlinks built: <strong>{cards.totalBacklinks}</strong>
            </li>
          </ul>
        </GlassCard>

        {/* ACTION CENTER */}
        <GlassCard className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Action Center</h3>

          <ul className="space-y-2 text-sm text-gray-700">
            {insights?.failureRate > 10 && (
              <li>⚠️ High failure rate — review failed posts</li>
            )}

            {insights?.consistencyScore < 50 && (
              <li>📉 Posting is inconsistent — schedule more posts</li>
            )}

            {insights?.bestPlatform && (
              <li>
                🚀 Focus more on <strong>{insights.bestPlatform._id}</strong>
              </li>
            )}
          </ul>
        </GlassCard>

        {/* PIE CHARTS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <ChartCard title="Content Type Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={contentData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                >
                  {contentData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Platform Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                >
                  {platformData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Post Status Overview">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
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
          <ChartCard title="Posting Frequency">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={postFrequency}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="posts" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Backlink Growth">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={backlinkFrequency}>
                <defs>
                  <linearGradient
                    id="backlinkGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.6} />
                    <stop offset="75%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="backlinks"
                  stroke="#10B981"
                  strokeWidth={3}
                  fill="url(#backlinkGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </>
  );
};

export default Analytics;
