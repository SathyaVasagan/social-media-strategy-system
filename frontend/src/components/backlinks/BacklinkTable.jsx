import { useNavigate } from "react-router-dom";
import GlassCard from "../ui/GlassCard";
import toast from "react-hot-toast";

const BacklinkTable = ({ backlinks, onDelete }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    if (status === "Live") {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
          🟢 Live
        </span>
      );
    }

    if (status === "Removed") {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
          🔴 Removed
        </span>
      );
    }

    return status;
  };

  const getAge = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days < 1) return "Today";
    if (days === 1) return "1 day ago";
    if (days < 30) return `${days} days ago`;

    const months = Math.floor(days / 30);
    return `${months} months ago`;
  };

  const copyLink = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied");
  };

  return (
    <GlassCard>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">User</th>
            <th>Platform</th>
            <th>Content</th>
            <th>Status</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {backlinks.map((link) => (
            <tr
              key={link._id}
              className={`border-b hover:bg-gray-50 ${
                link.status === "Removed" ? "opacity-70" : ""
              }`}
            >
              <td className="py-2">{link.userName}</td>

              <td>{link.platform}</td>

              <td>
                <button
                  onClick={() => navigate(`${link._id}`)}
                  className="text-blue-600 hover:underline"
                >
                  {link.contentTitle}
                </button>
              </td>

              <td>{getStatusBadge(link.status)}</td>

              <td className="text-sm text-gray-500">{getAge(link.date)}</td>

              <td className="flex gap-3 items-center">
                <button
                  onClick={() => navigate(`${link._id}`)}
                  className="text-blue-600"
                >
                  View
                </button>

                <button
                  onClick={() => copyLink(link.backlinkUrl)}
                  className="text-gray-600"
                >
                  📋
                </button>

                <button
                  onClick={() => onDelete(link._id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </GlassCard>
  );
};

export default BacklinkTable;
