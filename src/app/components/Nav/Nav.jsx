import "./Nav.css";
import NavButton from "../../../ui/NavButton/NavButton.jsx";

export default function Nav() {
  return (
    <div className="nav-card">
      <div className="nav-row nav-row--space">
        <div className="nav-title">Call Center</div>
        <div className="nav-row">
          <NavButton to="/calls">Calls</NavButton>
        </div>
      </div>
    </div>
  );
}
