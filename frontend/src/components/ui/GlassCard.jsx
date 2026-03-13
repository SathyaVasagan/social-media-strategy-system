const GlassCard = ({ children, className = "", onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative
        backdrop-blur-xl
        bg-white/40
        border border-white/30
        rounded-xl
        shadow-md
        hover:shadow-2xl
        hover:-translate-y-2
        transition-all duration-300 ease-out
        p-6
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassCard;
