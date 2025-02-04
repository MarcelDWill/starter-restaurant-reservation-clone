import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createReservation, readReservation, changeReservationStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { isTuesday, today, formatAsUTCDate } from "../utils/date-time";

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
  const { reservation_id } = useParams();
  const navigate = useNavigate();

  // Load existing reservation if reservation_id is provided (for updates)
  useEffect(() => {
    if (reservation_id) {
      const abortController = new AbortController();
      readReservation(reservation_id, abortController.signal)
        .then((loadedRes) => {
          setFormData({
            ...loadedRes,
            reservation_date: formatAsUTCDate(loadedRes.reservation_date),
          });
        })
        .catch(setBackendError);
      return () => abortController.abort();
    }
  }, [reservation_id]);

  // Format phone numbers as the user types
  const formatPhoneNumber = (num) => {
    if (!num) return num;
    const mobNum = num.replace(/[^\d]/g, "");
    const len = mobNum.length;

    if (len < 4) return mobNum;
    if (len < 7) return `(${mobNum.slice(0, 3)}) ${mobNum.slice(3)}`;
    return `(${mobNum.slice(0, 3)}) ${mobNum.slice(3, 6)}-${mobNum.slice(6, 10)}`;
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    if (target.type === "tel") {
      setFormData({ ...formData, [name]: formatPhoneNumber(value) });
    } else if (target.type === "number") {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors([]);
    setBackendError(null);

    const validationErrors = [];

    // Normalize dates for comparison
    const todayDate = formatAsUTCDate(today());
    const reservationDate = formatAsUTCDate(formData.reservation_date);

    // Check for past dates
    if (reservationDate < todayDate) {
      validationErrors.push("Reservations cannot be made in the past.");
    }

    // Check for same-day reservations with past times
    const [hours, minutes] = formData.reservation_time.split(":");
    const reservationTime = new Date();
    reservationTime.setUTCHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
    const now = new Date();
    if (reservationDate === todayDate && reservationTime < now) {
      validationErrors.push("Reservations cannot be made for earlier times today.");
    }

    // Prevent reservations on Tuesdays
    if (isTuesday(reservationDate)) {
      validationErrors.push("Reservations cannot be made on Tuesdays.");
    }

    if (validationErrors.length) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (reservation_id) {
        await changeReservationStatus(formData);
      } else {
        await createReservation(formData);
      }
      navigate(`/dashboard?date=${formData.reservation_date}`);
    } catch (error) {
      setBackendError(error);
    }
  };

  return (
    <div className="container">
      <h2 className="my-3">Reservation Form</h2>
      <ErrorAlert error={backendError} />
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
            min="1"
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary me-2">
          Submit
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default ReservationForm;
