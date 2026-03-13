import { useEffect, useState } from "react";
import GlassCard from "../../components/ui/GlassCard";
import BrandCard from "../../components/brands/BrandCard";
import BrandForm from "../../components/brands/BrandForm";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

import toast from "react-hot-toast";

import {
  getBrands,
  createBrand,
  deleteBrand,
} from "../../services/brandService";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [confirmId, setConfirmId] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const fetchBrands = async () => {
    try {
      const data = await getBrands();

      setBrands(data);
    } catch {
      toast.error("Failed to load brands");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleCreate = async (form) => {
    try {
      const newBrand = await createBrand(form);

      setBrands([newBrand, ...brands]);

      setShowForm(false);

      toast.success("Brand created");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBrand(id);

      setBrands(brands.filter((b) => b._id !== id));

      toast.success("Brand deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div>
      {/* Header */}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Brands</h2>

        <div className="flex gap-3">
          <input
            placeholder="Search brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded-lg"
          />

          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Brand
          </button>
        </div>
      </div>

      {/* Brand Grid */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredBrands.map((brand) => (
          <BrandCard
            key={brand._id}
            brand={brand}
            onDelete={() => setConfirmId(brand._id)}
          />
        ))}
      </div>

      {/* Add Brand Modal */}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <GlassCard className="max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Create Brand</h3>

            <BrandForm onCreate={handleCreate} />

            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 mt-4"
            >
              Cancel
            </button>
          </GlassCard>
        </div>
      )}

      {/* Confirm Delete Dialog */}

      {confirmId && (
        <ConfirmDialog
          message="Are you sure you want to delete this brand?"
          onCancel={() => setConfirmId(null)}
          onConfirm={() => {
            handleDelete(confirmId);
            setConfirmId(null);
          }}
        />
      )}
    </div>
  );
};

export default Brands;
