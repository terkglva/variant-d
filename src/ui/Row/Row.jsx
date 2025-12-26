import "./Row.css";
import clsx from "clsx";

export default function Row({
  children,
  justify = "flex-start",
  gap = 8,
  wrap = false,
}) {
  return (
    <div
      className={clsx("row", {
        "row--wrap": wrap,
      })}
      style={{ justifyContent: justify, gap }}
    >
      {children}
    </div>
  );
}
