import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import "./MyBookings.css";

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    api.getMyBookings().then(setBookings).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  async function handleCancel(id) {
    if (!window.confirm("Cancel this booking?")) return;
    setCancelling(id);
    try {
      await api.cancelBooking(id);
      setBookings(bs => bs.map(b => b._id===id ? {...b, status:"cancelled"} : b));
    } catch(e) { alert(e.message); }
    finally { setCancelling(null); }
  }

  if (loading) return <div className="page-loading"><span className="spinner dark"/><p>Loading bookings...</p></div>;

  return (
    <div className="mybookings-page">
      <div className="mybookings-inner">
        <div className="page-header-row">
          <h1 className="page-heading">My Bookings</h1>
          <button className="btn-primary" onClick={()=>navigate("/cars")}>+ Book a Car</button>
        </div>

        {bookings.length === 0 ? (
          <div className="empty-state">
            <span>📋</span>
            <p>You have no bookings yet.</p>
            <button className="btn-outline" onClick={()=>navigate("/cars")}>Browse Cars</button>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map(b => (
              <div key={b._id} className="booking-item">
                <img src={b.car?.image || `https://placehold.co/160x110/2563eb/white?text=${b.car?.brand}`} alt={b.car?.name} className="booking-car-img"/>
                <div className="booking-info">
                  <div className="booking-top">
                    <div>
                      <p className="booking-car-brand">{b.car?.brand}</p>
                      <h3 className="booking-car-name">{b.car?.name}</h3>
                    </div>
                    <span className={`badge badge-${b.status}`}>{b.status}</span>
                  </div>
                  <div className="booking-meta">
                    <div className="meta-item"><span>📅</span><span>{fmt(b.startDate)} → {fmt(b.endDate)}</span></div>
                    <div className="meta-item"><span>🕐</span><span>{b.totalDays} day(s)</span></div>
                    <div className="meta-item"><span>💰</span><span>₹{b.totalPrice.toLocaleString()}</span></div>
                    {b.pickupLocation && <div className="meta-item"><span>📍</span><span>{b.pickupLocation}</span></div>}
                  </div>
                </div>
                <div className="booking-actions">
                  <button className="btn-outline" onClick={()=>navigate(`/cars/${b.car?._id}`)}>View Car</button>
                  {(b.status==="pending"||b.status==="confirmed") && (
                    <button className="btn-danger" onClick={()=>handleCancel(b._id)} disabled={cancelling===b._id}>
                      {cancelling===b._id ? "Cancelling..." : "Cancel"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function fmt(d) { return new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}); }
