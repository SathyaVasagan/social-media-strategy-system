import { useState } from "react";

const BrandForm = ({ onCreate }) => {
  const [form, setForm] = useState({
    name: "",
    field: "",
    logo: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onCreate(form);

    setForm({
      name: "",
      field: "",
      logo: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        name="name"
        placeholder="Brand Name"
        required
        value={form.name}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg"
      />

      <input
        name="field"
        placeholder="Industry / Field"
        required
        value={form.field}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg"
      />

      <button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
        Add Brand
      </button>
    </form>
  );
};

export default BrandForm;
