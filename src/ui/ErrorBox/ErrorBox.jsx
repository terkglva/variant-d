import "./ErrorBox.css";
import clsx from "clsx";

export default function ErrorBox({ title, children, status = "info" }) {
  return (
    <div
      className={clsx("errorBox", {
        "errorBox--error": status === "error",
      })}
    >
      <div className="errorBox__content">
        {status === "error" && <span className="errorBox__icon">!</span>}

        <div>
          {title && <div className="errorBox__title">{title}</div>}
          <div className="errorBox__text">{children}</div>
        </div>
      </div>
    </div>
  );
}
