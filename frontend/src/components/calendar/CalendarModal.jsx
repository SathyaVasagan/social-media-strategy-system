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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <GlassCard className="w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {existing ? "Edit Content Plan" : "Add Content Plan"}
        </h3>

        <p className="text-sm text-gray-500 mb-4">
          Date: {selectedDate.toDateString()}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="date"
            name="date"
            required
            value={form.date}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              form.date ? "text-black" : "text-gray-400"
            }`}
          />

          <input
            name="title"
            placeholder="Post Title"
            required
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <select
            name="postType"
            required
            value={form.postType}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              form.postType ? "text-black" : "text-gray-400"
            }`}
          >
            <option value="" disabled>
              Select Post Type
            </option>
            <option value="Static">Static</option>
            <option value="Carousel">Carousel</option>
            <option value="Reel">Reel</option>
            <option value="Video">Video</option>
          </select>

          <select
            name="platform"
            required
            value={form.platform}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              form.platform ? "text-black" : "text-gray-400"
            }`}
          >
            <option value="" disabled>
              Select Platform
            </option>
            <option value="Instagram">Instagram</option>
            <option value="Facebook">Facebook</option>
            <option value="X">X</option>
            <option value="YouTube">YouTube</option>
          </select>

          <textarea
            name="description"
            placeholder="Description"
            required
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <div className="flex justify-between">
            <button type="button" onClick={onClose} className="text-gray-600">
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default CalendarModal;
