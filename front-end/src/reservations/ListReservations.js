import React from "react";
import { Link } from "react-router-dom";
import { changeReservationStatus } from "../utils/api";

export default function ReservationsList({ reservations, loadDashboard }) {
  if (!reservations.length) {
    return <p>No reservations found for the selected date.</p>;
  }

  const handleCancel = async (reservationId) => {
    if (
      window.confirm(
        "Do you want to cancel this reservation?\nThis action cannot be undone."
      )
    ) {
      await changeReservationStatus(reservationId, "cancelled");
      loadDashboard(); // Refresh dashboard data
    }
  };

  return (
    <div className="reservations-list">
      {reservations.map((reservation) => (
        <div key={reservation.reservation_id} className="reservation-card">
          <div className={`status-label ${reservation.status}`}>
            {reservation.status}
          </div>
          <div className="reservation-details">
            <h3>
              {reservation.first_name} {reservation.last_name}
            </h3>
            <p>
              <em>Expecting party of {reservation.people}</em>
            </p>
            <p>
              {new Date(reservation.reservation_date).toLocaleDateString()} at{" "}
              {reservation.reservation_time}
            </p>
            <p>Contact: {reservation.mobile_number}</p>
          </div>
          <div className="reservation-actions">
            {reservation.status === "booked" && (
              <>
                <Link
                  to={`/reservations/${reservation.reservation_id}/seat`}
                  className="btn btn-primary"
                >
                  Seat
                </Link>
                <Link
                  to={`/reservations/${reservation.reservation_id}/edit`}
                  className="btn btn-secondary"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleCancel(reservation.reservation_id)}
                  className="btn btn-danger"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
