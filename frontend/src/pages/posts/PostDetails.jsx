import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../layout/DashboardLayout";
import GlassCard from "../../components/ui/GlassCard";
import toast from "react-hot-toast";

import { getPost } from "../../services/postService";

const PostDetails = () => {
  const { postId } = useParams();

  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPost(postId);

        setPost(data);
      } catch {
        toast.error("Failed to load post");
      }
    };

    fetchPost();
  }, []);

  if (!post) return null;

  return (
    <div>
      <GlassCard>
        <h2 className="text-2xl font-bold mb-4">{post.title}</h2>

        <p>
          <strong>Platform:</strong> {post.platform}
        </p>
        <p>
          <strong>Type:</strong> {post.postType}
        </p>
        <p>
          <strong>Status:</strong> {post.status}
        </p>
        <p>
          <strong>Scheduled:</strong>{" "}
          {new Date(post.scheduledDate).toDateString()}
        </p>

        <p className="mt-4">
          <strong>Caption:</strong>
        </p>

        <p>{post.caption}</p>

        <p className="mt-4">
          <strong>Media Link:</strong>
        </p>

        <a href={post.mediaLink} target="_blank" className="text-blue-600">
          View Media
        </a>
      </GlassCard>
    </div>
  );
};

export default PostDetails;
