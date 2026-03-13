import { useNavigate } from "react-router-dom";
import GlassCard from "../ui/GlassCard";
import toast from "react-hot-toast";

const PostCard = ({ post, onDelete }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    if (status === "Draft")
      return (
        <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
          🟡 Draft
        </span>
      );

    if (status === "Scheduled")
      return (
        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
          🔵 Scheduled
        </span>
      );

    if (status === "Posted")
      return (
        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
          🟢 Posted
        </span>
      );

    return status;
  };

  const getSchedule = (date) => {
    const diff = new Date(date) - Date.now();
    const days = Math.round(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "📅 Today";
    if (days === 1) return "📅 Tomorrow";
    if (days > 1) return `📅 In ${days} days`;

    return `📅 ${Math.abs(days)} days ago`;
  };

  const copyCaption = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(post.caption);
    toast.success("Caption copied");
  };

  const deletePost = (e) => {
    e.stopPropagation();
    onDelete(post._id);
  };

  return (
    <GlassCard
      onClick={() => navigate(`${post._id}`)}
      className="hover:shadow-lg hover:-translate-y-1 transition cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{post.title}</h3>

          <p className="text-sm text-gray-500">
            {post.platform} | {post.postType}
          </p>

          <div className="mt-2">{getStatusBadge(post.status)}</div>

          <p className="text-sm text-gray-500 mt-2">
            {getSchedule(post.scheduledDate)}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={copyCaption}
            className="text-gray-600 hover:text-gray-900"
          >
            📋
          </button>

          <button
            onClick={deletePost}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>
    </GlassCard>
  );
};

export default PostCard;
