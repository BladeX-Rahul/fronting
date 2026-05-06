import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const data = await api.login({ email, password });
      login(data);
      navigate(data.role === "admin" ? "/admin" : "/");
    } catch(err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo"><div className="logo-icon">R</div><span>RentX</span></div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to your account to continue</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="field-label">Email</label>
            <input className="text-input" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
          </div>
          <div className="auth-field">
            <label className="field-label">Password</label>
            <input className="text-input" type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required/>
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn-primary auth-btn" disabled={loading}>
            {loading ? <><span className="spinner"/> Signing in…</> : "Sign In"}
          </button>
        </form>
        <p className="auth-switch">Don't have an account? <Link to="/register" className="auth-link">Sign up</Link></p>
        <div className="auth-demo">
          <p className="demo-title">Demo Credentials</p>
          <p>Admin: <strong>admin@gmail.com</strong> / <strong>123456</strong></p>
        </div>
      </div>
    </div>
  );
}

export function Register() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ name:"", email:"", password:"", phone:"" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) { setForm(f=>({...f,[e.target.name]:e.target.value})); setError(""); }

  async function handleSubmit(e) {
    e.preventDefault(); setError(""); setLoading(true);
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); setLoading(false); return; }
    try {
      const data = await api.register(form);
      login(data);
      navigate("/");
    } catch(err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo"><div className="logo-icon">R</div><span>RentX</span></div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Join RentX and start booking today</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="field-label">Full Name</label>
            <input className="text-input" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required/>
          </div>
          <div className="auth-field">
            <label className="field-label">Email</label>
            <input className="text-input" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required/>
          </div>
          <div className="auth-field">
            <label className="field-label">Phone (optional)</label>
            <input className="text-input" name="phone" placeholder="9876543210" value={form.phone} onChange={handleChange}/>
          </div>
          <div className="auth-field">
            <label className="field-label">Password</label>
            <input className="text-input" name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required/>
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn-primary auth-btn" disabled={loading}>
            {loading ? <><span className="spinner"/> Creating account…</> : "Create Account"}
          </button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login" className="auth-link">Sign in</Link></p>
      </div>
    </div>
  );
}
