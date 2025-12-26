import "./Drawer.css";

export default function Drawer({ isOpen, children, onClose, width = 420 }) {
  if (!isOpen) return null;

  return (
    <div
      className="drawerOverlay"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="drawerPanel"
        style={{ width }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
