import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../utils/api";
import CarCard from "../components/CarCard";
import "./Cars.css";

const CATEGORIES    = ["All","Sedan","SUV","Hatchback","Luxury","Electric","Van"];
const FUELS         = ["All","Petrol","Diesel","Electric","Hybrid"];
const TRANSMISSIONS = ["All","Manual","Automatic"];

export default function Cars() {
  const [searchParams] = useSearchParams();
  const [cars, setCars]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [fuel, setFuel]         = useState("All");
  const [trans, setTrans]       = useState("All");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [onlyAvail, setOnlyAvail] = useState(false);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== "All") params.set("category", category);
      if (fuel !== "All")     params.set("fuel", fuel);
      if (trans !== "All")    params.set("transmission", trans);
      if (maxPrice < 10000)   params.set("maxPrice", maxPrice);
      if (onlyAvail)          params.set("available", "true");
      if (search.trim())      params.set("search", search.trim());
      const data = await api.getCars(`?${params.toString()}`);
      setCars(data);
    } catch { setCars([]); }
    finally { setLoading(false); }
  }, [category, fuel, trans, maxPrice, onlyAvail, search]);

  useEffect(() => { fetchCars(); }, [fetchCars]);

  function clearFilters() {
    setCategory("All"); setFuel("All"); setTrans("All");
    setMaxPrice(10000); setOnlyAvail(false); setSearch("");
  }

  return (
    <div className="cars-page">
      {/* sidebar filters */}
      <aside className="filters-panel">
        <div className="filters-header">
          <h3>Filters</h3>
          <button className="clear-btn" onClick={clearFilters}>Clear All</button>
        </div>

        <div className="filter-group">
          <label className="field-label">Search</label>
          <input className="text-input" placeholder="Brand or model..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>

        <div className="filter-group">
          <label className="field-label">Category</label>
          <div className="filter-chips">
            {CATEGORIES.map(c=>(
              <button key={c} className={`fchip ${category===c?"fchip-active":""}`} onClick={()=>setCategory(c)}>{c}</button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label className="field-label">Fuel Type</label>
          <div className="filter-chips">
            {FUELS.map(f=>(
              <button key={f} className={`fchip ${fuel===f?"fchip-active":""}`} onClick={()=>setFuel(f)}>{f}</button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label className="field-label">Transmission</label>
          <div className="filter-chips">
            {TRANSMISSIONS.map(t=>(
              <button key={t} className={`fchip ${trans===t?"fchip-active":""}`} onClick={()=>setTrans(t)}>{t}</button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label className="field-label">Max Price/Day: ₹{maxPrice.toLocaleString()}</label>
          <input type="range" min="500" max="10000" step="100" value={maxPrice} onChange={e=>setMaxPrice(Number(e.target.value))} className="price-slider"/>
          <div className="slider-labels"><span>₹500</span><span>₹10,000</span></div>
        </div>

        <div className="filter-group">
          <label className="avail-toggle">
            <input type="checkbox" checked={onlyAvail} onChange={e=>setOnlyAvail(e.target.checked)}/>
            <span>Available only</span>
          </label>
        </div>
      </aside>

      {/* main content */}
      <main className="cars-main">
        <div className="cars-top-bar">
          <h1 className="cars-title">Browse Vehicles</h1>
          <p className="cars-count">{loading ? "Loading..." : `${cars.length} vehicle${cars.length!==1?"s":""} found`}</p>
        </div>

        {loading ? (
          <div className="cars-loading"><span className="spinner dark"/><p>Finding cars...</p></div>
        ) : cars.length === 0 ? (
          <div className="cars-empty">
            <span>🚗</span>
            <p>No cars found matching your filters.</p>
            <button className="btn-outline" onClick={clearFilters}>Clear Filters</button>
          </div>
        ) : (
          <div className="cars-grid">
            {cars.map((car,i) => <div key={car._id} style={{animationDelay:`${i*0.05}s`}}><CarCard car={car}/></div>)}
          </div>
        )}
      </main>
    </div>
  );
}
