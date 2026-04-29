const GlassCard = ({ children, className = "", onClick, hover = true }) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative
        overflow-hidden
        rounded-3xl
        border border-gray-200
        bg-white
        shadow-md
        transition-all duration-300 ease-out
        p-6
        ${hover ? "hover:shadow-xl hover:-translate-y-1" : ""}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassCard;
