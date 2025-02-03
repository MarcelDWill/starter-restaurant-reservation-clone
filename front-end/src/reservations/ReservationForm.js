import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";  // Correctly using ErrorAlert now
import { isTuesday, today } from "../utils/date-time";

function ReservationForm() {
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState([]);
  const [backendError, setBackendError] = useState(null);
  const navigate = useNavigate();

  const handleNumberInput = (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");  // Allow only digits
    handleChange(e);
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setFormData({
      ...formData,
      [name]: name === "people" ? Number(value) : value,
    });
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors([]);
    setBackendError(null);
  
    // Client-side validations
    const validationErrors = [];
  
    // Check for required fields
    if (!formData.first_name) validationErrors.push("First name is required.");
    if (!formData.last_name) validationErrors.push("Last name is required.");
    if (!formData.mobile_number) validationErrors.push("Mobile number is required.");
    if (!formData.reservation_date) validationErrors.push("Reservation date is required.");
    if (!formData.reservation_time) validationErrors.push("Reservation time is required.");
    if (!formData.people || formData.people < 1) validationErrors.push("Party size must be at least 1.");
  
    const reservationDate = new Date(formData.reservation_date);
  
    // Prevent reservations on Tuesdays
    if (isTuesday(reservationDate)) {
      validationErrors.push("Reservations cannot be made on Tuesdays.");
    }
  
    // Prevent reservations in the past
    const todayDate = new Date(today());
const formattedReservationDate = new Date(formData.reservation_date);
todayDate.setHours(0, 0, 0, 0);  // Ensure both dates are at midnight
formattedReservationDate.setHours(0, 0, 0, 0);

if (formattedReservationDate < todayDate) {
  validationErrors.push("Reservations cannot be made in the past.");
}


  
    if (validationErrors.length) {
      setErrors(validationErrors);
      return;
    }
  
    try {
      await createReservation(formData);
      navigate(`/dashboard?date=${formData.reservation_date}`);
    } catch (error) {
      setBackendError(error);
    }
  };
  

  return (
    <div className="container">
      <h2 className="my-3">New Reservation</h2>

      {/* Display backend error using ErrorAlert */}
      <ErrorAlert error={backendError} />

      {/* Display client-side validation errors */}
      {errors.length > 0 && (
        <div className="alert alert-danger">
          {errors.map((err, index) => (
            <div key={index}>{err}</div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="first_name" className="form-label">First Name</label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            className="form-control"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="last_name" className="form-label">Last Name</label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            className="form-control"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="mobile_number" className="form-label">Mobile Number</label>
          <input
            id="mobile_number"
            name="mobile_number"
            type="tel"
            className="form-control"
            value={formData.mobile_number}
            onInput={handleNumberInput}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="reservation_date" className="form-label">Reservation Date</label>
          <input
            id="reservation_date"
            name="reservation_date"
            type="date"
            className="form-control"
            value={formData.reservation_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="reservation_time" className="form-label">Reservation Time</label>
          <input
            id="reservation_time"
            name="reservation_time"
            type="time"
            className="form-control"
            value={formData.reservation_time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="people" className="form-label">Party Size</label>
          <input
            id="people"
            name="people"
            type="number"
            className="form-control"
            value={formData.people}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary me-2">Submit</button>
        <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
}

export default ReservationForm;
