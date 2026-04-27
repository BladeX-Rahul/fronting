import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";
import "./Profile.css";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm]   = useState({ name:user?.name||"", phone:user?.phone||"", password:"" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg]       = useState("");
  const [error, setError]   = useState("");

  async function handleSave(e) {
    e.preventDefault(); setMsg(""); setError(""); setSaving(true);
    try {
      const payload = { name:form.name, phone:form.phone };
      if (form.password.trim()) payload.password = form.password;
      const data = await api.updateProfile(payload);
      updateUser(data);
      setMsg("Profile updated successfully!");
      setForm(f=>({...f,password:""}));
    } catch(err) { setError(err.message); }
    finally { setSaving(false); }
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">{user?.name.charAt(0).toUpperCase()}</div>
        <h1 className="profile-name">{user?.name}</h1>
        <p className="profile-email">{user?.email}</p>
        <span className={`badge ${user?.role==="admin"?"badge-confirmed":"badge-pending"} profile-role`}>{user?.role}</span>

        <form onSubmit={handleSave} className="profile-form">
          <h2 className="profile-section-title">Edit Profile</h2>
          <div className="form-field">
            <label className="field-label">Full Name</label>
            <input className="text-input" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required/>
          </div>
          <div className="form-field">
            <label className="field-label">Email (cannot change)</label>
            <input className="text-input" value={user?.email} disabled style={{opacity:.6}}/>
          </div>
          <div className="form-field">
            <label className="field-label">Phone</label>
            <input className="text-input" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="9876543210"/>
          </div>
          <div className="form-field">
            <label className="field-label">New Password (leave blank to keep current)</label>
            <input className="text-input" type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="Min 6 characters"/>
          </div>
          {msg   && <p className="save-success">{msg}</p>}
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn-primary save-btn" disabled={saving}>
            {saving ? <><span className="spinner"/>Saving...</> : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
