import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import "./Admin.css";

/* ── Sidebar ── */
const adminLinks = [
  { path:"/admin",         label:"Dashboard",    icon:"⊞" },
  { path:"/admin/cars",    label:"Manage Cars",  icon:"🚗" },
  { path:"/admin/bookings",label:"Bookings",     icon:"📋" },
  { path:"/admin/users",   label:"Users",        icon:"👥" },
];

function AdminLayout({ children }) {
  const { pathname } = useLocation();
  const { logout }   = useAuth();
  const navigate     = useNavigate();
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand"><div className="logo-icon">R</div><span>Admin Panel</span></div>
        <nav className="admin-nav">
          {adminLinks.map(l=>(
            <Link key={l.path} to={l.path} className={`admin-nav-link ${pathname===l.path?"admin-active":""}`}>
              <span>{l.icon}</span><span>{l.label}</span>
            </Link>
          ))}
        </nav>
        <button className="admin-logout" onClick={()=>{logout();navigate("/");}}>🚪 Logout</button>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}

/* ── Dashboard ── */
export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  useEffect(()=>{ api.getStats().then(setStats).catch(()=>{}); },[]);
  const cards = stats ? [
    { label:"Total Cars",     value:stats.totalCars,     color:"var(--brand)" },
    { label:"Total Users",    value:stats.totalUsers,    color:"var(--green)" },
    { label:"Total Bookings", value:stats.totalBookings, color:"var(--accent)" },
    { label:"Revenue (₹)",   value:`₹${stats.revenue.toLocaleString()}`, color:"#8b5cf6" },
    { label:"Pending",        value:stats.pending,       color:"var(--accent)" },
    { label:"Confirmed",      value:stats.confirmed,     color:"var(--green)" },
    { label:"Subscribers",    value:stats.subscribers,   color:"var(--brand)" },
  ] : [];
  return (
    <AdminLayout>
      <h1 className="admin-page-title">Dashboard</h1>
      {!stats ? <div className="page-loading"><span className="spinner dark"/></div> : (
        <div className="stats-grid">
          {cards.map(c=>(
            <div key={c.label} className="stat-card">
              <p className="stat-card-label">{c.label}</p>
              <p className="stat-card-value" style={{color:c.color}}>{c.value}</p>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

/* ── Manage Cars ── */
export function AdminCars() {
  const [cars, setCars]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCar, setEditCar]   = useState(null);
  const [form, setForm]         = useState(defaultCarForm());
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");

  function defaultCarForm() {
    return { name:"",brand:"",category:"Sedan",pricePerDay:"",fuelType:"Petrol",transmission:"Manual",seats:5,description:"",features:"",isAvailable:true,location:"Delhi, India",image:"" };
  }

  useEffect(()=>{ api.getCars().then(setCars).catch(()=>{}).finally(()=>setLoading(false)); },[]);

  function openAdd() { setEditCar(null); setForm(defaultCarForm()); setShowForm(true); setError(""); }
  function openEdit(car) {
    setEditCar(car);
    setForm({...car, features: car.features?.join(", ")||"", pricePerDay: car.pricePerDay });
    setShowForm(true); setError("");
  }

  async function handleSave(e) {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const payload = { ...form, pricePerDay:Number(form.pricePerDay), seats:Number(form.seats),
        features: form.features.split(",").map(s=>s.trim()).filter(Boolean) };
      if (editCar) {
        const updated = await api.updateCar(editCar._id, payload);
        setCars(cs => cs.map(c=>c._id===editCar._id?updated:c));
      } else {
        const created = await api.createCar(payload);
        setCars(cs=>[created,...cs]);
      }
      setShowForm(false);
    } catch(err) { setError(err.message); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this car?")) return;
    try { await api.deleteCar(id); setCars(cs=>cs.filter(c=>c._id!==id)); }
    catch(e) { alert(e.message); }
  }

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Manage Cars</h1>
        <button className="btn-primary" onClick={openAdd}>+ Add Car</button>
      </div>

      {showForm && (
        <div className="admin-form-card">
          <h3 className="form-card-title">{editCar?"Edit Car":"Add New Car"}</h3>
          <form onSubmit={handleSave} className="car-form-grid">
            {[["name","Name"],["brand","Brand"],["location","Location"],["image","Image URL"]].map(([k,l])=>(
              <div key={k} className="form-field">
                <label className="field-label">{l}</label>
                <input className="text-input" value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} placeholder={l}/>
              </div>
            ))}
            <div className="form-field">
              <label className="field-label">Category</label>
              <select className="text-input" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                {["Sedan","SUV","Hatchback","Luxury","Electric","Van"].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label className="field-label">Fuel Type</label>
              <select className="text-input" value={form.fuelType} onChange={e=>setForm(f=>({...f,fuelType:e.target.value}))}>
                {["Petrol","Diesel","Electric","Hybrid"].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label className="field-label">Transmission</label>
              <select className="text-input" value={form.transmission} onChange={e=>setForm(f=>({...f,transmission:e.target.value}))}>
                <option>Manual</option><option>Automatic</option>
              </select>
            </div>
            <div className="form-field">
              <label className="field-label">Price/Day (₹)</label>
              <input className="text-input" type="number" value={form.pricePerDay} onChange={e=>setForm(f=>({...f,pricePerDay:e.target.value}))}/>
            </div>
            <div className="form-field">
              <label className="field-label">Seats</label>
              <input className="text-input" type="number" value={form.seats} onChange={e=>setForm(f=>({...f,seats:e.target.value}))}/>
            </div>
            <div className="form-field form-field-full">
              <label className="field-label">Description</label>
              <input className="text-input" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
            </div>
            <div className="form-field form-field-full">
              <label className="field-label">Features (comma separated)</label>
              <input className="text-input" value={form.features} onChange={e=>setForm(f=>({...f,features:e.target.value}))} placeholder="AC, Sunroof, Bluetooth"/>
            </div>
            <div className="form-field">
              <label className="avail-toggle field-label">
                <input type="checkbox" checked={form.isAvailable} onChange={e=>setForm(f=>({...f,isAvailable:e.target.checked}))}/>
                Available
              </label>
            </div>
            {error && <p className="form-error form-field-full">{error}</p>}
            <div className="form-actions form-field-full">
              <button type="submit" className="btn-primary" disabled={saving}>{saving?"Saving...":editCar?"Update Car":"Add Car"}</button>
              <button type="button" className="btn-ghost" onClick={()=>setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="page-loading"><span className="spinner dark"/></div> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Car</th><th>Category</th><th>Price/Day</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {cars.map(car=>(
                <tr key={car._id}>
                  <td><div className="table-car"><img src={car.image||`https://placehold.co/60x40/2563eb/white?text=${car.brand}`} alt=""/><div><p className="tc-name">{car.brand} {car.name}</p><p className="tc-sub">{car.fuelType} · {car.transmission}</p></div></div></td>
                  <td>{car.category}</td>
                  <td>₹{car.pricePerDay.toLocaleString()}</td>
                  <td><span className={`badge ${car.isAvailable?"badge-confirmed":"badge-cancelled"}`}>{car.isAvailable?"Available":"Booked"}</span></td>
                  <td><div className="table-actions"><button className="btn-outline table-btn" onClick={()=>openEdit(car)}>Edit</button><button className="btn-danger table-btn" onClick={()=>handleDelete(car._id)}>Delete</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

/* ── Manage Bookings ── */
export function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(()=>{ api.getAllBookings().then(setBookings).catch(()=>{}).finally(()=>setLoading(false)); },[]);

  async function handleStatus(id, status) {
    try {
      const updated = await api.updateBookingStatus(id, status);
      setBookings(bs=>bs.map(b=>b._id===id?{...b,status:updated.status}:b));
    } catch(e) { alert(e.message); }
  }

  return (
    <AdminLayout>
      <h1 className="admin-page-title">All Bookings</h1>
      {loading ? <div className="page-loading"><span className="spinner dark"/></div> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>User</th><th>Car</th><th>Dates</th><th>Days</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {bookings.map(b=>(
                <tr key={b._id}>
                  <td><p className="tc-name">{b.user?.name}</p><p className="tc-sub">{b.user?.email}</p></td>
                  <td><p className="tc-name">{b.car?.brand} {b.car?.name}</p></td>
                  <td><p className="tc-sub">{fmt(b.startDate)}</p><p className="tc-sub">{fmt(b.endDate)}</p></td>
                  <td>{b.totalDays}</td>
                  <td>₹{b.totalPrice.toLocaleString()}</td>
                  <td>
                    <span className={`badge badge-${b.status}`}>{b.status}</span>
                    {b.status==="confirmed" && b.autoConfirmed && <span className="badge" style={{background:"#7c3aed",color:"#fff",marginLeft:"4px",fontSize:"0.7rem"}} title="Auto-approved">⚡ Auto</span>}
                  </td>
                  <td>
                    <div className="table-actions">
                      {b.status==="pending"   && <button className="btn-success table-btn" onClick={()=>handleStatus(b._id,"confirmed")}>Confirm</button>}
                      {b.status==="confirmed" && <button className="btn-success table-btn" onClick={()=>handleStatus(b._id,"completed")}>Complete</button>}
                      {(b.status==="pending"||b.status==="confirmed") && <button className="btn-danger table-btn" onClick={()=>handleStatus(b._id,"cancelled")}>Cancel</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

/* ── Manage Users ── */
export function AdminUsers() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{ api.getAllUsers().then(setUsers).catch(()=>{}).finally(()=>setLoading(false)); },[]);

  async function handleToggle(id) {
    try {
      const data = await api.toggleUser(id);
      setUsers(us=>us.map(u=>u._id===id?{...u,isActive:data.isActive}:u));
    } catch(e) { alert(e.message); }
  }

  return (
    <AdminLayout>
      <h1 className="admin-page-title">Manage Users</h1>
      {loading ? <div className="page-loading"><span className="spinner dark"/></div> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map(u=>(
                <tr key={u._id}>
                  <td><p className="tc-name">{u.name}</p></td>
                  <td><p className="tc-sub">{u.email}</p></td>
                  <td><p className="tc-sub">{u.phone||"—"}</p></td>
                  <td><span className={`badge ${u.role==="admin"?"badge-confirmed":"badge-pending"}`}>{u.role}</span></td>
                  <td><span className={`badge ${u.isActive?"badge-confirmed":"badge-cancelled"}`}>{u.isActive?"Active":"Inactive"}</span></td>
                  <td><p className="tc-sub">{fmt(u.createdAt)}</p></td>
                  <td>{u.role!=="admin"&&<button className={u.isActive?"btn-danger table-btn":"btn-success table-btn"} onClick={()=>handleToggle(u._id)}>{u.isActive?"Deactivate":"Activate"}</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

function fmt(d) { return new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}); }
