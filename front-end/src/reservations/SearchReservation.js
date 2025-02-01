import React, { useState } from "react";
import { searchByMobileNumber } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function SearchReservation() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  const handleNumberInput = (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");  // Allow only digits
    setMobileNumber(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      const results = await searchByMobileNumber(mobileNumber);
      setReservations(results);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div>
      <h2>Search Reservations</h2>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="mobile_number">Mobile Number:</label>
          <input
            id="mobile_number"
            name="mobile_number"
            type="tel"
            value={mobileNumber}
            onInput={handleNumberInput}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Find</button>
      </form>

      {reservations.length > 0 ? (
        <ul>
          {reservations.map((reservation) => (
            <li key={reservation.reservation_id}>
              {reservation.first_name} {reservation.last_name} - {reservation.reservation_time}
            </li>
          ))}
        </ul>
      ) : (
        <p>No reservations found</p>
      )}
    </div>
  );
}

export default SearchReservation;

