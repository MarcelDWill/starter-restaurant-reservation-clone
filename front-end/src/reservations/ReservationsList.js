import React from "react";
import { Link } from "react-router-dom";
import { changeReservationStatus } from "../utils/api";

function ReservationsList({ reservations, loadDashboard }) {
  const handleCancel = async (reservationId) => {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This action cannot be undone."
      )
    ) {
      try {
        await changeReservationStatus(reservationId, "cancelled");
        loadDashboard();  // Refresh dashboard after cancellation
      } catch (err) {
        alert(`Failed to update reservation status: ${err.message}`);
      }
    }
  };

  return (
    <div className="reservations-list">
      {reservations.map((reservation) => (
        <div key={reservation.reservation_id} className="reservation-card">
          <div className="status-label">{reservation.status}</div>
          <h3>
            {reservation.first_name} {reservation.last_name}
          </h3>
          <p>Party of {reservation.people}</p>
          <p>
            {new Date(reservation.reservation_date).toLocaleDateString()} at{" "}
            {reservation.reservation_time}
          </p>
          <p>Contact: {reservation.mobile_number}</p>

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

export default ReservationsList;
