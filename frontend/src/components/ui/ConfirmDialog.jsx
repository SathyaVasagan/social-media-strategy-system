import GlassCard from "./GlassCard";

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <GlassCard className="max-w-sm text-center">
        <p className="mb-4">{message}</p>

        <div className="flex justify-center gap-4">
          <button onClick={onCancel} className="px-4 py-2 border rounded">
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

export default ConfirmDialog;
