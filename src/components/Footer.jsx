import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../utils/api";
import "./Footer.css";

export default function Footer() {
  const [email, setEmail]     = useState("");
  const [msg, setMsg]         = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubscribe(e) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const data = await api.subscribe(email);
      setMsg(data.message);
      setEmail("");
    } catch(err) {
      setMsg(err.message);
    } finally { setLoading(false); }
  }

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="logo-icon-sm">R</div>
            <span>RentX</span>
          </div>
          <p className="footer-tagline">Your trusted vehicle rental platform. Drive with confidence, book with ease.</p>
        </div>

        <div className="footer-links-col">
          <p className="footer-col-title">Quick Links</p>
          <Link to="/"    className="footer-link">Home</Link>
          <Link to="/cars" className="footer-link">Browse Cars</Link>
          <Link to="/login" className="footer-link">Login</Link>
          <Link to="/register" className="footer-link">Sign Up</Link>
        </div>

        <div className="footer-newsletter">
          <p className="footer-col-title">Newsletter</p>
          <p className="footer-newsletter-sub">Get updates on new vehicles and exclusive offers.</p>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => { setEmail(e.target.value); setMsg(""); }}
              className="newsletter-input"
            />
            <button type="submit" className="newsletter-btn" disabled={loading}>
              {loading ? <span className="spinner"/> : "Subscribe"}
            </button>
          </form>
          {msg && <p className="newsletter-msg">{msg}</p>}
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} RentX. All rights reserved.</p>
        <p>Built with MERN Stack</p>
      </div>
    </footer>
  );
}
