import { useState } from "react";

const BacklinkForm = ({ brandId, onCreate }) => {
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
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* USER NAME */}

      <input
        name="userName"
        placeholder="User Name"
        required
        value={form.userName}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

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
        <option value="Quora">Quora</option>
        <option value="Reddit">Reddit</option>
        <option value="Medium">Medium</option>
        <option value="Stack Exchange">Stack Exchange</option>
      </select>

      {/* CONTENT TITLE */}

      <input
        name="contentTitle"
        placeholder="Content Title"
        required
        value={form.contentTitle}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      {/* CONTENT BODY */}

      <textarea
        name="contentBody"
        placeholder="Content Body"
        required
        value={form.contentBody}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      {/* BACKLINK URL */}

      <input
        name="backlinkUrl"
        placeholder="Backlink URL"
        required
        value={form.backlinkUrl}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      {/* DATE */}

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

      {/* STATUS */}

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className={`w-full p-2 border rounded ${
          form.status ? "text-black" : "text-gray-400"
        }`}
      >
        <option value="" disabled>
          Select Status
        </option>
        <option value="Live">Live</option>
        <option value="Removed">Removed</option>
      </select>

      {/* SUBMIT */}

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Add Backlink
      </button>
    </form>
  );
};

export default BacklinkForm;
