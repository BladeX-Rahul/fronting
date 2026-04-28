const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
// const BASE = process.env.REACT_APP_API_URL || "https://backending-1.onrender.com/api";
function getToken() {
  const user = localStorage.getItem("rentx_user");
  return user ? JSON.parse(user).token : null;
}

async function request(method, endpoint, body = null, auth = false) {
  const headers = { "Content-Type": "application/json" };
  if (auth) headers["Authorization"] = `Bearer ${getToken()}`;
  const res = await fetch(`${BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const api = {
  // Auth
  register:   (body)       => request("POST", "/auth/register", body),
  login:      (body)       => request("POST", "/auth/login", body),
  getMe:      ()           => request("GET",  "/auth/me", null, true),
  updateProfile: (body)    => request("PUT",  "/auth/profile", body, true),

  // Cars
  getCars:    (query = "") => request("GET",  `/cars${query}`),
  getCar:     (id)         => request("GET",  `/cars/${id}`),
  createCar:  (body)       => request("POST", "/cars", body, true),
  updateCar:  (id, body)   => request("PUT",  `/cars/${id}`, body, true),
  deleteCar:  (id)         => request("DELETE", `/cars/${id}`, null, true),

  // Bookings
  createBooking: (body)    => request("POST", "/bookings", body, true),
  getMyBookings: ()        => request("GET",  "/bookings/my", null, true),
  cancelBooking: (id)      => request("PUT",  `/bookings/${id}/cancel`, null, true),

  // Admin
  getStats:       ()       => request("GET", "/admin/stats", null, true),
  getAllBookings:  ()       => request("GET", "/bookings", null, true),
  updateBookingStatus: (id, status) => request("PUT", `/bookings/${id}/status`, { status }, true),
  getAllUsers:     ()       => request("GET", "/admin/users", null, true),
  toggleUser:     (id)     => request("PUT", `/admin/users/${id}/toggle`, null, true),
  getSubscribers: ()       => request("GET", "/admin/subscribers", null, true),
  subscribe:      (email)  => request("POST", "/admin/newsletter/subscribe", { email }),
};
