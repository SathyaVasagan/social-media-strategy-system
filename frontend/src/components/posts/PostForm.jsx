import { useState } from "react";

const PostForm = ({ brandId, onCreate }) => {
  const [form, setForm] = useState({
    title: "",
    postType: "",
    platform: "",
    caption: "",
    mediaLink: "",
    scheduledDate: "",
    status: "",
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
      title: "",
      postType: "",
      platform: "",
      caption: "",
      mediaLink: "",
      scheduledDate: "",
      status: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* TITLE */}

      <input
        name="title"
        placeholder="Post Title"
        required
        value={form.title}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      {/* POST TYPE */}

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

      {/* PLATFORM */}

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

      {/* CAPTION */}

      <textarea
        name="caption"
        placeholder="Caption"
        required
        value={form.caption}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      {/* MEDIA LINK */}

      <input
        name="mediaLink"
        placeholder="Media Link"
        required
        value={form.mediaLink}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      {/* SCHEDULE DATE */}

      <input
        type="date"
        name="scheduledDate"
        required
        value={form.scheduledDate}
        onChange={handleChange}
        className={`w-full p-2 border rounded ${
          form.scheduledDate ? "text-black" : "text-gray-400"
        }`}
      />

      {/* STATUS */}

      <select
        name="status"
        required
        value={form.status}
        onChange={handleChange}
        className={`w-full p-2 border rounded ${
          form.status ? "text-black" : "text-gray-400"
        }`}
      >
        <option value="" disabled>
          Select Status
        </option>
        <option value="Draft">Draft</option>
        <option value="Scheduled">Scheduled</option>
        <option value="Posted">Posted</option>
      </select>

      {/* BUTTON */}

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Add Post
      </button>
    </form>
  );
};

export default PostForm;
