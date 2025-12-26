import "./Button.css";
import clsx from "clsx";

export default function Button({
  children,
  variant = "default",
  disabled,
  onClick,
}) {
  return (
    <button
      className={clsx("btn", `btn--${variant}`)}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
