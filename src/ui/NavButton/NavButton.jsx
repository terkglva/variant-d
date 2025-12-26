import { NavLink } from "react-router";
import "./NavButton.css";

export default function NavButton(props) {
  const { to, children } = props;
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `nav-link ${isActive ? "nav-link--active" : ""}`
      }
    >
      {children}
    </NavLink>
  );
}
