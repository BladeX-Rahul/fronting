import { useNavigate } from "react-router-dom";
import "./CarCard.css";

export default function CarCard({ car }) {
  const navigate = useNavigate();
  return (
    <div className="car-card" onClick={() => navigate(`/cars/${car._id}`)}>
      <div className="car-card-img">
        <img src={car.image || `https://placehold.co/600x380/2563eb/white?text=${car.brand}+${car.name}`} alt={car.name} />
        <span className={`car-avail-badge ${car.isAvailable ? "avail" : "unavail"}`}>
          {car.isAvailable ? "Available" : "Booked"}
        </span>
      </div>
      <div className="car-card-body">
        <div className="car-card-top">
          <div>
            <p className="car-brand">{car.brand}</p>
            <h3 className="car-name">{car.name}</h3>
          </div>
          <div className="car-rating">⭐ {car.rating}</div>
        </div>
        <div className="car-tags">
          <span className="car-tag">{car.category}</span>
          <span className="car-tag">{car.fuelType}</span>
          <span className="car-tag">{car.transmission}</span>
          <span className="car-tag">👥 {car.seats}</span>
        </div>
        <div className="car-card-footer">
          <div className="car-price">
            <span className="price-amt">₹{car.pricePerDay.toLocaleString()}</span>
            <span className="price-per">/day</span>
          </div>
          <button className="btn-primary car-book-btn">Book Now</button>
        </div>
      </div>
    </div>
  );
}
