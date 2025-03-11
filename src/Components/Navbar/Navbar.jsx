import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="nav">
      <Link to="/" className="nav-logo">MedSync</Link>
      <ul className="nav-menu">
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/search" className="nav-records">Records</Link></li>
      </ul>
    </div>
  );
};

export default Navbar;
