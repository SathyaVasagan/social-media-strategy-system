import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GlassCard from "../../components/ui/GlassCard";
import PostCard from "../../components/posts/PostCard";
import PostForm from "../../components/posts/PostForm";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";
import toast from "react-hot-toast";

import { getPosts, createPost, deletePost } from "../../services/postService";

const Posts = () => {
  const { brandId } = useParams();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [statusFilter, setStatusFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState("All");

  const fetchPosts = async () => {
    try {
      const data = await getPosts(brandId);
      setPosts(data);
    } catch {
      toast.error("Failed to load posts");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [brandId]);

  const handleCreate = async (form) => {
    try {
      const newPost = await createPost(form);

      setPosts([newPost, ...posts]);

      setShowForm(false);

      toast.success("Post created");
    } catch {
      toast.error("Create failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id);

      setPosts(posts.filter((p) => p._id !== id));

      toast.success("Post deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) return <LoadingSkeleton />;

  /* PIPELINE SUMMARY */

  const total = posts.length;
  const draft = posts.filter((p) => p.status === "Draft").length;
  const scheduled = posts.filter((p) => p.status === "Scheduled").length;
  const posted = posts.filter((p) => p.status === "Posted").length;

  /* FILTER LOGIC */

  let filteredPosts = posts;

  if (statusFilter !== "All") {
    filteredPosts = filteredPosts.filter((p) => p.status === statusFilter);
  }

  if (platformFilter !== "All") {
    filteredPosts = filteredPosts.filter((p) => p.platform === platformFilter);
  }

  return (
    <div>
      {/* HEADER */}

      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Posts</h2>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:scale-105 transition"
        >
          + Add Post
        </button>
      </div>

      {/* SUMMARY CARDS */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <GlassCard>
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold">{total}</p>
        </GlassCard>

        <GlassCard>
          <p className="text-sm text-gray-500">Draft</p>
          <p className="text-2xl font-bold text-yellow-600">{draft}</p>
        </GlassCard>

        <GlassCard>
          <p className="text-sm text-gray-500">Scheduled</p>
          <p className="text-2xl font-bold text-blue-600">{scheduled}</p>
        </GlassCard>

        <GlassCard>
          <p className="text-sm text-gray-500">Posted</p>
          <p className="text-2xl font-bold text-green-600">{posted}</p>
        </GlassCard>
      </div>

      {/* FILTER BAR */}

      <div className="flex flex-wrap gap-4 items-center mb-6">
        {/* STATUS FILTER */}

        <div className="flex gap-2">
          {["All", "Draft", "Scheduled", "Posted"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded text-sm ${
                statusFilter === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* PLATFORM FILTER */}

        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All Platforms</option>
          <option value="Instagram">Instagram</option>
          <option value="Facebook">Facebook</option>
          <option value="X">X</option>
          <option value="YouTube">YouTube</option>
        </select>
      </div>

      {/* POSTS GRID */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <PostCard key={post._id} post={post} onDelete={handleDelete} />
        ))}
      </div>

      {/* CREATE MODAL */}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <GlassCard className="max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Create Post</h3>

            <PostForm brandId={brandId} onCreate={handleCreate} />

            <button
              onClick={() => setShowForm(false)}
              className="text-red-500 mt-4"
            >
              Cancel
            </button>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Posts;
