import { useState } from "react";
import GlassCard from "../ui/GlassCard";

const BacklinkForm = ({ brandId, onCreate, onClose }) => {
  const [form, setForm] = useState({
    userName: "",
    platform: "",
    contentTitle: "",
    contentBody: "",
    backlinkUrl: "",
    date: "",
    status: "Live",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onCreate({
      ...form,
      brandId,
    });

    setForm({
      userName: "",
      platform: "",
      contentTitle: "",
      contentBody: "",
      backlinkUrl: "",
      date: "",
      status: "Live",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <GlassCard hover={false} className="w-full max-w-md overflow-hidden">
        <h3 className="text-lg font-semibold mb-4">Create Backlink</h3>

        <div className="relative max-h-[70vh]">
          <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* USER NAME */}
              <div>
                <label className="form-label">User Name</label>
                <input
                  name="userName"
                  placeholder="Enter username..."
                  value={form.userName}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              {/* PLATFORM */}
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
                  <option value="Quora">Quora</option>
                  <option value="Reddit">Reddit</option>
                  <option value="Medium">Medium</option>
                  <option value="Stack Exchange">Stack Exchange</option>
                </select>
              </div>

              {/* CONTENT TITLE */}
              <div>
                <label className="form-label">Content Title</label>
                <input
                  name="contentTitle"
                  placeholder="Enter content title..."
                  value={form.contentTitle}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              {/* CONTENT BODY */}
              <div>
                <label className="form-label">Content Body</label>
                <textarea
                  name="contentBody"
                  placeholder="Write your content..."
                  value={form.contentBody}
                  onChange={handleChange}
                  className="textarea-field"
                  required
                />
              </div>

              {/* BACKLINK URL */}
              <div>
                <label className="form-label">Backlink URL</label>
                <input
                  name="backlinkUrl"
                  placeholder="https://example.com"
                  value={form.backlinkUrl}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              {/* DATE + STATUS */}
              <div className="grid grid-cols-2 gap-3">
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

                <div>
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="select-field"
                  >
                    <option value="Live">Live</option>
                    <option value="Removed">Removed</option>
                  </select>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-3 pt-4">
                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded border border-gray-300 text-red-500 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                )}

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
                  Add Backlink
                </button>
              </div>
            </form>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default BacklinkForm;
