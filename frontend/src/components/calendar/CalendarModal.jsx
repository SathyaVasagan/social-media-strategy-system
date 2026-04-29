import { useState, useEffect } from "react";
import GlassCard from "../ui/GlassCard";

const CalendarModal = ({ selectedDate, onSave, onClose, existing }) => {
  const [form, setForm] = useState({
    title: "",
    postType: "",
    platform: "",
    description: "",
    date: "",
  });

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title || "",
        postType: existing.postType || "",
        platform: existing.platform || "",
        description: existing.description || "",
        date: existing.date ? existing.date.slice(0, 10) : "",
      });
    } else if (selectedDate) {
      setForm((prev) => ({
        ...prev,
        date: selectedDate.toISOString().slice(0, 10),
      }));
    }
  }, [existing, selectedDate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <GlassCard hover={false} className="w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {existing ? "Edit Content Plan" : "Add Content Plan"}
        </h3>

        <p className="text-sm text-gray-500 mb-4">
          Date: {selectedDate.toDateString()}
        </p>

        {/* 🚀 UPGRADED FORM */}
        <div className="relative max-h-[70vh]">
          {/* SCROLL CONTAINER */}
          <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* DATE */}
              <div>
                <label className="form-label">Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              {/* TITLE */}
              <div>
                <label className="form-label">Post Title</label>
                <input
                  name="title"
                  placeholder="Enter post title..."
                  value={form.title}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              {/* TYPE + PLATFORM */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Post Type</label>
                  <select
                    name="postType"
                    value={form.postType}
                    onChange={handleChange}
                    className="select-field"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="Static">Static</option>
                    <option value="Carousel">Carousel</option>
                    <option value="Reel">Reel</option>
                    <option value="Video">Video</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Platform</label>
                  <select
                    name="platform"
                    value={form.platform}
                    onChange={handleChange}
                    className="select-field"
                    required
                  >
                    <option value="">Select platform</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="X">X</option>
                    <option value="YouTube">YouTube</option>
                  </select>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  placeholder="Write content plan..."
                  value={form.description}
                  onChange={handleChange}
                  className="textarea-field"
                  required
                />
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded border border-gray-300 text-red-500 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="
                bg-gradient-to-r from-blue-600 to-cyan-500
                text-white px-5 py-2.5 rounded-xl
                shadow-md hover:shadow-xl
                hover:scale-105 active:scale-95
                transition-all duration-200
              "
                >
                  {existing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default CalendarModal;
