// ./front-end/src/reservations/ReservationForm.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createReservation } from "../utils/api";
// If you have a shared error alert component, import it:
import ErrorAlert from "../layout/ErrorAlert";

function ReservationForm() {
  // Initial form values
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
  const navigate = useNavigate();

  // Update form data when an input changes
  const handleChange = ({ target }) => {
    const { name, value } = target;
    setFormData({
      ...formData,
      // For "people", ensure we store a number:
      [name]: name === "people" ? Number(value) : value,
    });
  };

  // Handle cancel by going back to the previous page
  const handleCancel = () => {
    navigate(-1);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors([]);

    // Basic client-side validations (more complex validations are handled on the backend)
    const validationErrors = [];
    if (!formData.first_name) validationErrors.push("First name is required.");
    if (!formData.last_name) validationErrors.push("Last name is required.");
    if (!formData.mobile_number) validationErrors.push("Mobile number is required.");
    if (!formData.reservation_date) validationErrors.push("Reservation date is required.");
    if (!formData.reservation_time) validationErrors.push("Reservation time is required.");
    if (!formData.people || formData.people < 1)
      validationErrors.push("Party size must be at least 1.");

    if (validationErrors.length) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Call the API to create the reservation
      await createReservation(formData);
      // On success, navigate to the dashboard for the given reservation date
      navigate(`/dashboard?date=${formData.reservation_date}`);
    } catch (error) {
      // If the backend returns an error, display it in the form.
      setErrors([error.message || "An error occurred while creating the reservation."]);
    }
  };

  return (
    <div className="container">
      <h2 className="my-3">New Reservation</h2>

      {/* Display errors, if any */}
      {errors.length > 0 && (
        <div className="alert alert-danger">
          {errors.map((err, index) => (
            <div key={index}>{err}</div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="first_name" className="form-label">
            First Name
          </label>
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
          <label htmlFor="last_name" className="form-label">
            Last Name
          </label>
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
          <label htmlFor="mobile_number" className="form-label">
            Mobile Number
          </label>
          <input
            id="mobile_number"
            name="mobile_number"
            type="tel"
            className="form-control"
            value={formData.mobile_number}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="reservation_date" className="form-label">
            Reservation Date
          </label>
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
          <label htmlFor="reservation_time" className="form-label">
            Reservation Time
          </label>
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
          <label htmlFor="people" className="form-label">
            Party Size
          </label>
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

        <button type="submit" className="btn btn-primary me-2">
          Submit
        </button>
        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default ReservationForm;
