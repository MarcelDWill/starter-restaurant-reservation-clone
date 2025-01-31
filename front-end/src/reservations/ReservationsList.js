import React from "react";

function ReservationsList({ reservations }) {
  return (
    <div>
      <h2>Reservations</h2>
      <ul>
        {reservations.map((reservation) => (
          <li key={reservation.reservation_id}>
            {reservation.first_name} {reservation.last_name} - {reservation.reservation_time}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReservationsList;
