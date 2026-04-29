import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { updatePost } from "../../services/postService";
import GlassCard from "../ui/GlassCard";

const PostForm = ({ brandId, onCreate, editData, onClose }) => {
  const [form, setForm] = useState({
    title: "",
    postType: "",
    platform: "",
    caption: "",
    scheduledDate: "",
    scheduledTime: "",
    status: "Draft",
  });

  const [files, setFiles] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData && !initialized) {
      const dateObj = new Date(editData.scheduledAt);

      setForm({
        title: editData.title || "",
        postType: editData.postType || "",
        platform: editData.platform || "",
        caption: editData.caption || "",
        scheduledDate: dateObj.toISOString().split("T")[0],
        scheduledTime: dateObj.toTimeString().slice(0, 5),
        status: editData.status || "Draft",
      });

      setInitialized(true);
    }
  }, [editData, initialized]);

  useEffect(() => {
    if (!editData) setInitialized(false);
  }, [editData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateFiles = (selectedFiles) => {
    if (!form.postType) {
      toast.error("Select Post Type first");
      return false;
    }

    const fileArray = Array.from(selectedFiles);

    if (form.postType === "Static") {
      if (fileArray.length !== 1 || !fileArray[0].type.startsWith("image")) {
        toast.error("Static post requires exactly 1 image");
        return false;
      }
    }

    if (form.postType === "Carousel") {
      if (
        fileArray.length < 2 ||
        fileArray.some((f) => !f.type.startsWith("image"))
      ) {
        toast.error("Carousel requires multiple images");
        return false;
      }
    }

    if (form.postType === "Reel" || form.postType === "Video") {
      if (fileArray.length !== 1 || !fileArray[0].type.startsWith("video")) {
        toast.error("Reel/Video requires exactly 1 video");
        return false;
      }
    }

    return true;
  };

  const handleFileChange = (e) => {
    if (!validateFiles(e.target.files)) return;
    setFiles(e.target.files);
  };

  const validateSchedule = () => {
    if (!form.scheduledDate || !form.scheduledTime) {
      toast.error("Select date and time");
      return false;
    }

    const scheduledAt = new Date(
      `${form.scheduledDate}T${form.scheduledTime}:00`,
    );

    if (scheduledAt <= new Date()) {
      toast.error("Scheduled time must be in the future");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editData && files.length === 0) {
      toast.error("Upload media");
      return;
    }

    if (!validateSchedule()) return;

    const scheduledAt = new Date(
      `${form.scheduledDate}T${form.scheduledTime}:00`,
    );

    try {
      setLoading(true);

      if (editData) {
        if (onClose) {
          onClose({
            ...editData,
            ...form,
            scheduledAt: scheduledAt.toISOString(),
          });
        }

        await updatePost(editData._id, {
          ...form,
          scheduledAt: scheduledAt.toISOString(),
        });

        toast.success("Post updated");
      } else {
        const formData = new FormData();

        Object.entries(form).forEach(([key, val]) => formData.append(key, val));

        formData.append("brandId", brandId);
        formData.append("scheduledAt", scheduledAt.toISOString());

        Array.from(files).forEach((file) => formData.append("media", file));

        await onCreate(formData);

        toast.success("Post scheduled");

        setForm({
          title: "",
          postType: "",
          platform: "",
          caption: "",
          scheduledDate: "",
          scheduledTime: "",
          status: "Draft",
        });

        setFiles([]);
      }
    } catch {
      toast.error(editData ? "Update failed" : "Create failed");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <GlassCard hover={false} className="w-full max-w-md overflow-hidden">
        <h3 className="text-lg font-semibold mb-4">
          {editData ? "Edit Post" : "Create Post"}
        </h3>

        <div className="relative max-h-[70vh]">
          <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* TITLE */}
              <div>
                <label className="form-label">Title</label>
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
                    <option value="">Select</option>
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
                    <option value="">Select</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="X">X</option>
                    <option value="YouTube">YouTube</option>
                  </select>
                </div>
              </div>

              {/* CAPTION */}
              <div>
                <label className="form-label">Caption</label>
                <textarea
                  name="caption"
                  placeholder="Write engaging caption..."
                  value={form.caption}
                  onChange={handleChange}
                  className="textarea-field"
                  required
                />
              </div>

              {/* MEDIA */}
              {!editData && (
                <div>
                  <label className="form-label">Upload Media</label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="file-field"
                  />
                </div>
              )}

              {/* DATE + TIME */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    name="scheduledDate"
                    min={today}
                    value={form.scheduledDate}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Time</label>
                  <input
                    type="time"
                    name="scheduledTime"
                    value={form.scheduledTime}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              {/* STATUS */}
              <div>
                <label className="form-label">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="select-field"
                >
                  <option value="Draft">Draft</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
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
                  disabled={loading}
                  className="
              bg-gradient-to-r from-blue-600 to-cyan-500
              text-white px-5 py-2.5 rounded-xl
              shadow-md hover:shadow-xl
              hover:scale-105 active:scale-95
              transition-all duration-200
              disabled:opacity-50
            "
                >
                  {loading
                    ? "Saving..."
                    : editData
                      ? "Update Post"
                      : "Add Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default PostForm;
