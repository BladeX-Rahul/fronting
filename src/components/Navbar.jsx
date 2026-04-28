import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
    setMenuOpen(false);
  }

  return (
  <nav className="navbar">
    <div className="navbar-inner">
      <Link to="/" className="navbar-logo">
        <img
          src={require("../assests/logo.png")}
          alt="RentX Logo"
          className="logo-image"
        />
        <span>RentX</span>
      </Link>

        <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <Link to="/"      className={`nav-link ${pathname==="/"?"active":""}`} onClick={()=>setMenuOpen(false)}>Home</Link>
          <Link to="/cars"  className={`nav-link ${pathname==="/cars"?"active":""}`} onClick={()=>setMenuOpen(false)}>Browse Cars</Link>
          {user && !isAdmin && (
            <Link to="/my-bookings" className={`nav-link ${pathname==="/my-bookings"?"active":""}`} onClick={()=>setMenuOpen(false)}>My Bookings</Link>
          )}
          {isAdmin && (
            <Link to="/admin" className={`nav-link ${pathname.startsWith("/admin")?"active":""}`} onClick={()=>setMenuOpen(false)}>Admin</Link>
          )}
        </div>

        <div className="navbar-actions">
          {!user ? (
            <>
              <button className="btn-ghost nav-btn" onClick={()=>navigate("/login")}>Login</button>
              <button className="btn-primary nav-btn" onClick={()=>navigate("/register")}>Sign Up</button>
            </>
          ) : (
            <div className="user-menu">
              <button className="user-avatar" onClick={()=>setMenuOpen(m=>!m)}>
                <span>{user.name.charAt(0).toUpperCase()}</span>
              </button>
              {menuOpen && (
                <div className="dropdown">
                  <p className="dropdown-name">{user.name}</p>
                  <p className="dropdown-email">{user.email}</p>
                  <hr className="dropdown-divider"/>
                  <button className="dropdown-item" onClick={()=>{navigate("/profile");setMenuOpen(false);}}>Profile</button>
                  {!isAdmin && <button className="dropdown-item" onClick={()=>{navigate("/my-bookings");setMenuOpen(false);}}>My Bookings</button>}
                  {isAdmin  && <button className="dropdown-item" onClick={()=>{navigate("/admin");setMenuOpen(false);}}>Admin Panel</button>}
                  <hr className="dropdown-divider"/>
                  <button className="dropdown-item danger" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          )}
        </div>

        <button className="hamburger" onClick={()=>setMenuOpen(m=>!m)}>
          <span/><span/><span/>
        </button>
      </div>
    </nav>
  );
}
