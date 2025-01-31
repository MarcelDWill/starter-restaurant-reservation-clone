import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import ErrorAlert from "../layout/ErrorAlert";
import { createReservation, updateReservation } from "../utils/api";

function ReservationForm({ initialData = {}, onSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: initialData.first_name || "",
    last_name: initialData.last_name || "",
    mobile_number: initialData.mobile_number || "",
    reservation_date: initialData.reservation_date || "",
    reservation_time: initialData.reservation_time || "",
    people: initialData.people || 1,
  });

  const [error, setError] = useState(null);

  const handleChange = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (initialData.reservation_id) {
        await updateReservation(initialData.reservation_id, formData);
      } else {
        await createReservation(formData);
      }
      onSuccess && onSuccess();
      navigate(`/dashboard?date=${formData.reservation_date}`);
    } catch (error) {
      setError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ErrorAlert error={error} />
      <div>
        <label>First Name:</label>
        <input
          name="first_name"
          type="text"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Last Name:</label>
        <input
          name="last_name"
          type="text"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Mobile Number:</label>
        <input
          name="mobile_number"
          type="text"
          value={formData.mobile_number}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Reservation Date:</label>
        <input
          name="reservation_date"
          type="date"
          value={formData.reservation_date}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Reservation Time:</label>
        <input
          name="reservation_time"
          type="time"
          value={formData.reservation_time}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Party Size:</label>
        <input
          name="people"
          type="number"
          min="1"
          value={formData.people}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Submit</button>
      <button type="button" onClick={() => navigate(-1)}>
        Cancel
      </button>
    </form>
  );
}

export default ReservationForm;
