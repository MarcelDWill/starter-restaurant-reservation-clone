import React, { useState } from "react";
import { searchByMobileNumber } from "../utils/api";
import ReservationsList from "./ReservationsList";
import ErrorAlert from "../layout/ErrorAlert";
import { useNavigate } from "react-router-dom";

function SearchReservation() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const results = await searchByMobileNumber(mobileNumber);
      if (results.length === 0) {
        alert("No reservations found.");
        navigate("/dashboard");  // Redirect if no reservations are found
      }
      setReservations(results);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div>
      <h1>Search Reservations</h1>
      <ErrorAlert error={error} />
      <form onSubmit={handleSearch}>
        <label htmlFor="mobileNumber">Mobile Number</label>
        <input
          id="mobileNumber"
          type="tel"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>

      {reservations.length > 0 && (
        <ReservationsList reservations={reservations} loadDashboard={window.location.reload} />
      )}
    </div>
  );
}

export default SearchReservation;

