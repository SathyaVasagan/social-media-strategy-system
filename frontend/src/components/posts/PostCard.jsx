import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import GlassCard from "../ui/GlassCard";
import toast from "react-hot-toast";
import { formatDateTime } from "../../utils/formatDate";
import { retryPost, togglePostStatus } from "../../services/postService";
import PostForm from "./PostForm";

const PostCard = ({ post, onDelete, onUpdate }) => {
  const navigate = useNavigate();

  const [showEdit, setShowEdit] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef();

  /* 🔥 CLOSE MENU ON OUTSIDE CLICK */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* STATUS BADGE */

  const getStatusBadge = (status) => {
    const styles = {
      Draft: "bg-yellow-100 text-yellow-700",
      Processing: "bg-blue-100 text-blue-600 animate-pulse",
      Scheduled: "bg-blue-100 text-blue-700",
      Posted: "bg-green-100 text-green-700",
      Failed: "bg-red-100 text-red-700",
    };

    const labels = {
      Draft: "🟡 Draft",
      Processing: "⏳ Processing",
      Scheduled: "🔵 Scheduled",
      Posted: "🟢 Posted",
      Failed: "❌ Failed",
    };

    return (
      <span className={`text-xs px-2 py-1 rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  /* SCHEDULE LABEL */

  const getScheduleLabel = (date) => {
    if (!date) return "";

    const diff = new Date(date) - Date.now();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (diff < 0) return "⏪ Past";
    if (minutes < 60) return `⏳ In ${minutes} min`;
    if (hours < 24) return `⏳ In ${hours} hr`;
    if (days === 1) return "📅 Tomorrow";
    if (days > 1) return `📅 In ${days} days`;

    return "📅 Today";
  };

  /* ACTIONS */

  const copyCaption = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(post.caption);
    toast.success("Caption copied");
    setMenuOpen(false);
  };

  const deletePost = (e) => {
    e.stopPropagation();
    onDelete(post._id);
    setMenuOpen(false);
  };

  const handleRetry = async (e) => {
    e.stopPropagation();
    try {
      await retryPost(post._id);
      toast.success("Retry scheduled");
    } catch {
      toast.error("Retry failed");
    }
    setMenuOpen(false);
  };

  /* 🚀 PRODUCTION-SAFE TOGGLE (NO MUTATION) */
  const handleToggleStatus = async (e) => {
    e.stopPropagation();

    const previousStatus = post.status;
    const newStatus = previousStatus === "Scheduled" ? "Draft" : "Scheduled";

    // ✅ optimistic update via parent (IMMUTABLE)
    onUpdate({ ...post, status: newStatus });

    setMenuOpen(false);

    try {
      const updated = await togglePostStatus(post._id);

      // ✅ sync with backend (SOURCE OF TRUTH)
      onUpdate(updated);

      toast.success(`Moved to ${updated.status}`);
    } catch {
      // ❌ rollback
      onUpdate({ ...post, status: previousStatus });

      toast.error("Failed to update status");
    }
  };

  return (
    <>
      <GlassCard
        onClick={() => navigate(`${post._id}`)}
        className="hover:shadow-lg hover:-translate-y-1 transition cursor-pointer"
      >
        {/* MEDIA */}
        {post.mediaUrls?.length > 0 && (
          <div className="mb-3">
            {post.postType === "Video" || post.postType === "Reel" ? (
              <video
                src={post.mediaUrls[0]}
                className="w-full h-40 object-cover rounded"
                muted
              />
            ) : (
              <img
                src={post.mediaUrls[0]}
                alt="preview"
                className="w-full h-40 object-cover rounded"
              />
            )}

            {post.postType === "Carousel" && post.mediaUrls.length > 1 && (
              <p className="text-xs text-gray-500 mt-1">
                +{post.mediaUrls.length - 1} more
              </p>
            )}
          </div>
        )}

        {/* CONTENT */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{post.title}</h3>

            <p className="text-sm text-gray-500">
              {post.platform} | {post.postType}
            </p>

            <div className="mt-2">{getStatusBadge(post.status)}</div>

            <p className="text-sm text-gray-500 mt-2">
              {getScheduleLabel(post.scheduledAt)}
            </p>

            <p className="text-xs text-gray-400">
              {formatDateTime(post.scheduledAt)}
            </p>

            {post.status === "Failed" && post.errorMessage && (
              <p className="text-xs text-red-500 mt-1">{post.errorMessage}</p>
            )}
          </div>

          {/* 🔥 3 DOT MENU */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((prev) => !prev);
              }}
              className="text-xl px-2"
            >
              ⋯
            </button>

            {menuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-50"
              >
                <button
                  onClick={copyCaption}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Copy Caption
                </button>

                {post.status !== "Posted" && (
                  <button
                    onClick={handleToggleStatus}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    {post.status === "Scheduled"
                      ? "Move to Draft"
                      : "Schedule Now"}
                  </button>
                )}

                {post.status !== "Posted" && (
                  <button
                    onClick={() => {
                      setShowEdit(true);
                      setMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                )}

                {post.status === "Failed" && (
                  <button
                    onClick={handleRetry}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Retry
                  </button>
                )}

                <button
                  onClick={deletePost}
                  className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </GlassCard>

      {/* EDIT MODAL */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <GlassCard className="max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit Post</h3>

            <PostForm
              brandId={post.brandId}
              editData={post}
              onClose={() => setShowEdit(false)}
            />

            <button
              onClick={() => setShowEdit(false)}
              className="text-red-500 mt-4"
            >
              Cancel
            </button>
          </GlassCard>
        </div>
      )}
    </>
  );
};

export default PostCard;
