import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ReservationsList from "./ReservationsList";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    setError(null);

    listReservations({}, abortController.signal)
      .then(setReservations)
      .catch(setError);

    return () => abortController.abort();
  }, []);

  return (
    <div>
      <h1>Reservations</h1>
      <ErrorAlert error={error} />
      <ReservationsList reservations={reservations} />
    </div>
  );
}

export default ReservationsPage;
