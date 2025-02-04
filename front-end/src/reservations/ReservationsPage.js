import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ReservationsList from "./ReservationsList";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  const loadReservations = () => {
    const abortController = new AbortController();
    listReservations({}, abortController.signal)
      .then(setReservations)
      .catch(setError);
    return () => abortController.abort();
  };

  useEffect(() => {
    loadReservations();
  }, []);

  return (
    <div>
      <h1>Reservations</h1>
      <ErrorAlert error={error} />
      <ReservationsList reservations={reservations} loadDashboard={loadReservations} />
    </div>
  );
}

export default ReservationsPage;

