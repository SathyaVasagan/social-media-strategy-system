import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GlassCard from "../../components/ui/GlassCard";
import toast from "react-hot-toast";

import { getBacklink } from "../../services/backlinkService";

const BacklinkDetails = () => {
  const { id } = useParams();

  const [link, setLink] = useState(null);

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const data = await getBacklink(id);
        setLink(data);
      } catch {
        toast.error("Failed to load backlink");
      }
    };

    fetchLink();
  }, [id]);

  if (!link) return null;

  const getStatusBadge = (status) => {
    if (status === "Live") {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
          🟢 Live
        </span>
      );
    }

    if (status === "Removed") {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
          🔴 Removed
        </span>
      );
    }

    return status;
  };

  return (
    <div>
      <GlassCard>
        <h2 className="text-2xl font-bold mb-4">{link.contentTitle}</h2>

        <p>
          <strong>User:</strong> {link.userName}
        </p>

        <p>
          <strong>Platform:</strong> {link.platform}
        </p>

        <p>
          <strong>Status:</strong> {getStatusBadge(link.status)}
        </p>

        <p>
          <strong>Date:</strong> {new Date(link.date).toDateString()}
        </p>

        <p className="mt-4">
          <strong>Content Body:</strong>
        </p>

        <p>{link.contentBody}</p>

        <p className="mt-4">
          <strong>Backlink:</strong>
        </p>

        <a
          href={link.backlinkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600"
        >
          Visit Link
        </a>
      </GlassCard>
    </div>
  );
};

export default BacklinkDetails;
