import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import "./CarDetail.css";

export default function CarDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [car, setCar]             = useState(null);
  const [loading, setLoading]     = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate]     = useState("");
  const [pickup, setPickup]       = useState("");
  const [drop, setDrop]           = useState("");
  const [booking, setBooking]     = useState(false);
  const [success, setSuccess]     = useState("");
  const [error, setError]         = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    api.getCar(id).then(setCar).catch(()=>navigate("/cars")).finally(()=>setLoading(false));
  }, [id, navigate]);

  const totalDays  = startDate && endDate ? Math.ceil((new Date(endDate)-new Date(startDate))/(1000*60*60*24)) : 0;
  const totalPrice = totalDays > 0 && car ? totalDays * car.pricePerDay : 0;

  async function handleBook() {
    if (!user) { navigate("/login"); return; }
    if (!startDate || !endDate) { setError("Please select start and end dates."); return; }
    if (totalDays <= 0)         { setError("End date must be after start date."); return; }
    setError(""); setBooking(true);
    try {
      await api.createBooking({ carId: id, startDate, endDate, pickupLocation: pickup, dropLocation: drop });
      setSuccess(`🎉 Booking confirmed! Total: ₹${totalPrice.toLocaleString()} for ${totalDays} day(s).`);
    } catch(e) { setError(e.message); }
    finally { setBooking(false); }
  }

  if (loading) return <div className="detail-loading"><span className="spinner dark"/><p>Loading...</p></div>;
  if (!car)    return null;

  return (
    <div className="detail-page">
      <div className="detail-inner">
        {/* Left */}
        <div className="detail-left">
          <img src={car.image || `https://placehold.co/700x420/2563eb/white?text=${car.brand}+${car.name}`} alt={car.name} className="detail-img"/>
          <div className="detail-info">
            <div className="detail-brand-row">
              <span className="detail-brand">{car.brand}</span>
              <span className="detail-rating">⭐ {car.rating}</span>
            </div>
            <h1 className="detail-name">{car.name}</h1>
            <div className="detail-tags">
              <span className="car-tag">{car.category}</span>
              <span className="car-tag">{car.fuelType}</span>
              <span className="car-tag">{car.transmission}</span>
              <span className="car-tag">👥 {car.seats} Seats</span>
              <span className={`car-tag ${car.isAvailable?"tag-green":"tag-red"}`}>{car.isAvailable?"✓ Available":"✗ Unavailable"}</span>
            </div>
            <p className="detail-desc">{car.description}</p>
            {car.features?.length > 0 && (
              <div className="detail-features">
                <p className="detail-feat-title">Features & Highlights</p>
                <div className="detail-feat-grid">
                  {car.features.map(f => <span key={f} className="detail-feat">{f}</span>)}
                </div>
              </div>
            )}
            <p className="detail-location">📍 {car.location}</p>
          </div>
        </div>

        {/* Right — Booking */}
        <div className="booking-card">
          <div className="booking-price-header">
            <span className="booking-price">₹{car.pricePerDay.toLocaleString()}</span>
            <span className="booking-per">/day</span>
          </div>

          {success ? (
            <div className="booking-success">
              <p>{success}</p>
              <button className="btn-outline" style={{marginTop:"1rem",width:"100%"}} onClick={()=>navigate("/my-bookings")}>View My Bookings</button>
            </div>
          ) : (
            <>
              <div className="booking-field">
                <label className="field-label">Pickup Date</label>
                <input type="date" className="text-input" min={today} value={startDate} onChange={e=>{setStartDate(e.target.value);setError("");}}/>
              </div>
              <div className="booking-field">
                <label className="field-label">Return Date</label>
                <input type="date" className="text-input" min={startDate||today} value={endDate} onChange={e=>{setEndDate(e.target.value);setError("");}}/>
              </div>
              <div className="booking-field">
                <label className="field-label">Pickup Location</label>
                <input className="text-input" placeholder="e.g. Delhi Airport" value={pickup} onChange={e=>setPickup(e.target.value)}/>
              </div>
              <div className="booking-field">
                <label className="field-label">Drop Location</label>
                <input className="text-input" placeholder="e.g. Connaught Place" value={drop} onChange={e=>setDrop(e.target.value)}/>
              </div>

              {totalDays > 0 && (
                <div className="booking-summary">
                  <div className="summary-row"><span>Duration</span><span>{totalDays} day(s)</span></div>
                  <div className="summary-row"><span>Rate</span><span>₹{car.pricePerDay.toLocaleString()}/day</span></div>
                  <div className="summary-row total"><span>Total</span><span>₹{totalPrice.toLocaleString()}</span></div>
                </div>
              )}

              {error && <p className="form-error">{error}</p>}

              <button className="btn-primary book-now-btn" onClick={handleBook} disabled={booking||!car.isAvailable}>
                {booking ? <><span className="spinner"/> Booking...</> : car.isAvailable ? "Book Now" : "Not Available"}
              </button>
              {!user && <p className="login-hint">You need to <span onClick={()=>navigate("/login")} className="link-span">login</span> to book a car.</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
