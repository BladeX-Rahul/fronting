import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import CarCard from "../components/CarCard";
import "./Home.css";

const stats = [
  { num: "500+", label: "Vehicles Available" },
  { num: "10K+", label: "Happy Customers" },
  { num: "50+",  label: "Cities Covered" },
  { num: "24/7", label: "Customer Support" },
];

const categories = ["All","Sedan","SUV","Hatchback","Luxury","Electric","Van"];

export default function Home() {
  const navigate = useNavigate();
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCars("?available=true").then(data => {
      setFeaturedCars(data.slice(0, 3));
    }).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🚗 Premium Vehicle Rentals</div>
          <h1 className="hero-heading">Find & Book Your<br/><span className="hero-accent">Perfect Ride</span></h1>
          <p className="hero-sub">Browse hundreds of vehicles, compare prices, and book instantly. No hidden fees, full transparency.</p>
          <div className="hero-actions">
            <button className="btn-primary hero-cta" onClick={() => navigate("/cars")}>Browse Cars</button>
            <button className="btn-outline hero-cta-outline" onClick={() => navigate("/register")}>Get Started Free</button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-car-card">
            <img src="https://placehold.co/480x300/2563eb/white?text=🚗+Drive+in+Style" alt="hero car"/>
          </div>
          <div className="blob h1"/><div className="blob h2"/>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-bar">
        {stats.map(s => (
          <div key={s.label} className="stat-item">
            <span className="stat-num">{s.num}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">Browse by Type</p>
              <h2 className="section-title">Find Your Category</h2>
            </div>
          </div>
          <div className="category-grid">
            {categories.filter(c=>c!=="All").map(cat => (
              <button key={cat} className="category-card" onClick={()=>navigate(`/cars?category=${cat}`)}>
                <span className="cat-emoji">{catEmoji(cat)}</span>
                <span className="cat-name">{cat}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="section section-gray">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">Top Picks</p>
              <h2 className="section-title">Featured Vehicles</h2>
            </div>
            <button className="btn-outline" onClick={()=>navigate("/cars")}>View All →</button>
          </div>
          {loading ? (
            <div className="cars-loading"><span className="spinner dark"/><p>Loading cars...</p></div>
          ) : (
            <div className="featured-grid">
              {featuredCars.map(car => <CarCard key={car._id} car={car}/>)}
            </div>
          )}
        </div>
      </section>

      {/* Why RentX */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header center">
            <div>
              <p className="section-eyebrow">Why Choose Us</p>
              <h2 className="section-title">The RentX Advantage</h2>
            </div>
          </div>
          <div className="features-grid">
            {[
              { icon:"🔒", title:"Secure Booking",   desc:"Your bookings and payments are fully secured with encrypted transactions." },
              { icon:"🚀", title:"Instant Confirmation", desc:"Get instant booking confirmation without any delays or manual approvals." },
              { icon:"💰", title:"Best Prices",      desc:"Transparent pricing with no hidden charges. What you see is what you pay." },
              { icon:"📱", title:"Easy Management",  desc:"Manage all your bookings, view history and cancel anytime from your dashboard." },
            ].map(f=>(
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="cta-inner">
          <h2>Ready to Hit the Road?</h2>
          <p>Join thousands of satisfied customers. Book your ride in under 2 minutes.</p>
          <button className="btn-primary cta-btn" onClick={()=>navigate("/cars")}>Browse All Cars</button>
        </div>
      </section>
    </div>
  );
}

function catEmoji(cat) {
  const map = { Sedan:"🚗", SUV:"🚙", Hatchback:"🚕", Luxury:"✨", Electric:"⚡", Van:"🚐" };
  return map[cat] || "🚗";
}
