import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GlassCard from "../../components/ui/GlassCard";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";
import toast from "react-hot-toast";

import BacklinkTable from "../../components/backlinks/BacklinkTable";
import BacklinkForm from "../../components/backlinks/BacklinkForm";

import {
  getBacklinks,
  createBacklink,
  deleteBacklink,
} from "../../services/backlinkService";

const Backlinks = () => {
  const { brandId } = useParams();

  const [backlinks, setBacklinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [statusFilter, setStatusFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState("All");

  const fetchBacklinks = async () => {
    try {
      const data = await getBacklinks(brandId);
      setBacklinks(data);
    } catch {
      toast.error("Failed to load backlinks");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchBacklinks();
  }, [brandId]);

  const handleCreate = async (form) => {
    try {
      const newLink = await createBacklink(form);
      setBacklinks([newLink, ...backlinks]);
      setShowForm(false);
      toast.success("Backlink added");
    } catch {
      toast.error("Create failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBacklink(id);
      setBacklinks(backlinks.filter((b) => b._id !== id));
      toast.success("Backlink deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) return <LoadingSkeleton />;

  /* SUMMARY */

  const total = backlinks.length;
  const live = backlinks.filter((b) => b.status === "Live").length;
  const removed = backlinks.filter((b) => b.status === "Removed").length;
  const platforms = [...new Set(backlinks.map((b) => b.platform))];

  /* FILTER */

  let filteredBacklinks = backlinks;

  if (statusFilter !== "All") {
    filteredBacklinks = filteredBacklinks.filter(
      (b) => b.status === statusFilter,
    );
  }

  if (platformFilter !== "All") {
    filteredBacklinks = filteredBacklinks.filter(
      (b) => b.platform === platformFilter,
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Backlinks</h2>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:scale-105 transition"
        >
          + Add Backlink
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <GlassCard>
          <p className="text-sm text-gray-500">Total Links</p>
          <p className="text-2xl font-bold">{total}</p>
        </GlassCard>

        <GlassCard>
          <p className="text-sm text-gray-500">Live</p>
          <p className="text-2xl font-bold text-green-600">{live}</p>
        </GlassCard>

        <GlassCard>
          <p className="text-sm text-gray-500">Removed</p>
          <p className="text-2xl font-bold text-red-600">{removed}</p>
        </GlassCard>

        <GlassCard>
          <p className="text-sm text-gray-500">Platforms</p>
          <p className="text-2xl font-bold">{platforms.length}</p>
        </GlassCard>
      </div>

      {/* FILTER */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <div className="flex gap-2">
          {["All", "Live", "Removed"].map((status) => (
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

        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All Platforms</option>
          <option value="Quora">Quora</option>
          <option value="Reddit">Reddit</option>
          <option value="Medium">Medium</option>
          <option value="Stack Exchange">Stack Exchange</option>
        </select>
      </div>

      {/* TABLE */}
      <BacklinkTable backlinks={filteredBacklinks} onDelete={handleDelete} />

      {/* MODAL */}
      {showForm && (
        <BacklinkForm
          brandId={brandId}
          onCreate={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Backlinks;
