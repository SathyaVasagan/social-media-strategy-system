import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import GlassCard from "../../components/ui/GlassCard";
import toast from "react-hot-toast";
import { getPost } from "../../services/postService";
import { formatDateTime } from "../../utils/formatDate";

import PostForm from "../../components/posts/PostForm";

const PostDetails = () => {
  const { postId } = useParams();

  const [post, setPost] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  // 🔥 Carousel state
  const [activeIndex, setActiveIndex] = useState(0);

  // 🔥 Swipe refs
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const fetchPost = async () => {
    try {
      const data = await getPost(postId);
      setPost(data);
    } catch {
      toast.error("Failed to load post");
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  /* 🔥 KEYBOARD NAVIGATION */
  useEffect(() => {
    if (!post) return;

    const handleKey = (e) => {
      if (e.key === "ArrowRight" && activeIndex < post.mediaUrls.length - 1) {
        setActiveIndex((prev) => prev + 1);
      }

      if (e.key === "ArrowLeft" && activeIndex > 0) {
        setActiveIndex((prev) => prev - 1);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, post]);

  /* 🔥 SWIPE HANDLERS */
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;

    if (!post) return;

    if (diff > 50 && activeIndex < post.mediaUrls.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }

    if (diff < -50 && activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  if (!post) return null;

  return (
    <div>
      <GlassCard>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 🔥 MEDIA */}
          <div>
            <div
              className="relative"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {post.mediaUrls[activeIndex]?.includes("video") ? (
                <video
                  src={post.mediaUrls[activeIndex]}
                  controls
                  className="w-full rounded-xl"
                />
              ) : (
                <img
                  src={post.mediaUrls[activeIndex]}
                  className="w-full rounded-xl"
                />
              )}

              {/* LEFT */}
              {activeIndex > 0 && (
                <button
                  onClick={() => setActiveIndex((prev) => prev - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded"
                >
                  ‹
                </button>
              )}

              {/* RIGHT */}
              {activeIndex < post.mediaUrls.length - 1 && (
                <button
                  onClick={() => setActiveIndex((prev) => prev + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded"
                >
                  ›
                </button>
              )}
            </div>

            {/* 🔥 THUMBNAILS */}
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {post.mediaUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  onClick={() => setActiveIndex(i)}
                  className={`w-16 h-16 object-cover rounded cursor-pointer border ${
                    i === activeIndex ? "border-blue-500" : ""
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 🔥 DETAILS PANEL */}
          <div className="space-y-6 lg:sticky lg:top-24 h-fit">
            <h2 className="text-3xl font-bold">{post.title}</h2>

            <div className="flex gap-4 text-sm text-gray-500">
              <span>{post.platform}</span>
              <span>•</span>
              <span>{post.postType}</span>
            </div>

            <div>
              <span className="font-semibold">Status:</span>
              <span className="ml-2">{post.status}</span>
            </div>

            <div>
              <span className="font-semibold">Scheduled:</span>
              <p className="text-gray-600 mt-1">
                {formatDateTime(post.scheduledAt)}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Caption</h4>
              <p className="text-gray-700 leading-relaxed">{post.caption}</p>
            </div>

            {/* CTA */}
            {post.status !== "Posted" ? (
              <button
                onClick={() => setShowEdit(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:scale-105 transition"
              >
                Edit Post
              </button>
            ) : (
              <p className="text-sm text-gray-500">
                Posted posts cannot be edited
              </p>
            )}
          </div>
        </div>
      </GlassCard>

      {/* 🔥 EDIT MODAL */}
      {showEdit && (
        <PostForm
          brandId={post.brandId}
          editData={post}
          onClose={(updatedPost) => {
            setShowEdit(false);

            if (updatedPost && updatedPost._id) {
              setPost(updatedPost);
            } else {
              fetchPost();
            }
          }}
        />
      )}
    </div>
  );
};

export default PostDetails;
