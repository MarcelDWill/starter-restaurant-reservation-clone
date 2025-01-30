import React from "react";
import { useNavigate } from "react-router-dom";

function ReservationForm({ formData, changeHandler, submitHandler }) {
    const navigate = useNavigate();
  
    return (
      <div>
        <form>
          <label htmlFor="first_name">
            First Name:
            <input
              className="form-control"
              type="text"
              name="first_name"
              id="first_name"
              value={formData.first_name}
              onChange={changeHandler}
              required
            />
          </label>
          <br />
          <label htmlFor="last_name">
            Last Name:
            <input
              className="form-control"
              type="text"
              name="last_name"
              id="last_name"
              value={formData.last_name}
              onChange={changeHandler}
              required
            />
          </label>
          <br />
          <label htmlFor="mobile_number">
            Mobile Number:
            <input
              className="form-control"
              type="tel"
              name="mobile_number"
              id="mobile_number"
              value={formData.mobile_number}
              onChange={changeHandler}
              required
            />
          </label>
          <br />
          <label htmlFor="reservation_date">
            Reservation Date:
            <input
              className="form-control"
              type="date"
              placeholder="YYYY-MM-DD"
              pattern="\d{4}-\d{2}-\d{2}"
              name="reservation_date"
              id="reservation_date"
              value={formData.reservation_date}
              onChange={changeHandler}
              required
            />
          </label>
          <br />
          <label htmlFor="reservation_time">
            Reservation Time:
            <input
              className="form-control"
              type="time"
              placeholder="HH:MM"
              pattern="[0-9]{2}:[0-9]{2}"
              name="reservation_time"
              id="reservation_time"
              value={formData.reservation_time}
              onChange={changeHandler}
              required
            />
          </label>
          <br />
          <label htmlFor="people">
            Number of People:
            <input
              className="form-control"
              type="number"
              name="people"
              id="people"
              value={formData.people}
              onChange={changeHandler}
              required
            />
          </label>
          <br />
          <button type="submit" className="btn btn-primary btn-sm"
            onClick={(event) => submitHandler(event)}>
            Submit
          </button>
          <button className="btn btn-danger btn-sm mr-2"
            onClick={() => navigate(-1)}>
            Cancel
          </button>
        </form>
      </div>
    );
  }
  
  export default ReservationForm;