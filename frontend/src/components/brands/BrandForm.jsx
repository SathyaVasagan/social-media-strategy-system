import { useState } from "react";
import GlassCard from "../ui/GlassCard";

const BrandForm = ({ onCreate, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    field: "",
    facebookPageId: "",
    facebookAccessToken: "",
  });

  const [showToken, setShowToken] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <GlassCard
        hover={false}
        className="w-full max-w-lg p-6 space-y-6 overflow-hidden"
      >
        {/* HEADER */}
        <div>
          <h2 className="text-2xl font-semibold">Create Brand</h2>
          <p className="text-sm text-gray-500">
            Connect your brand with social platforms
          </p>
        </div>

        <div className="relative max-h-[70vh]">
          {/* SCROLL AREA */}
          <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* BRAND INFO */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">
                  Brand Info
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Brand Name</label>
                    <input
                      name="name"
                      placeholder="Enter brand name..."
                      value={form.name}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Industry</label>
                    <input
                      name="field"
                      placeholder="Enter industry..."
                      value={form.field}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* FACEBOOK SECTION */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">
                  Facebook Integration
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="form-label">Page ID</label>
                    <input
                      name="facebookPageId"
                      placeholder="Enter page ID..."
                      value={form.facebookPageId}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="form-label">Access Token</label>

                    <div className="relative">
                      <input
                        type={showToken ? "text" : "password"}
                        name="facebookAccessToken"
                        placeholder="Enter access token..."
                        value={form.facebookAccessToken}
                        onChange={handleChange}
                        className="input-field pr-16"
                      />

                      <button
                        type="button"
                        onClick={() => setShowToken(!showToken)}
                        className="absolute right-3 top-2.5 text-sm text-blue-600"
                      >
                        {showToken ? "Hide" : "Show"}
                      </button>
                    </div>

                    <p className="text-xs text-gray-400 mt-1">
                      Graph API Explorer → /me/accounts
                    </p>
                  </div>
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
                  Add Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default BrandForm;
