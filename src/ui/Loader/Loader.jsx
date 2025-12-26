import "./Loader.css";

export default function Loader({ text = "Loading…" }) {
  return (
    <div className="loader-overlay" role="status" aria-live="polite">
      <div className="card loader-box">
        <span className="loader-spinner" />
        <span className="loader-text">{text}</span>
      </div>
    </div>
  );
}
