import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsList from "../reservations/ReservationsList";
import TablesList from "../tables/TablesList";
import { useNavigate, useLocation } from "react-router-dom";
import { previous, next, today } from "../utils/date-time";

function Dashboard({ date = today() }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const abortController = new AbortController();
    setError(null);

    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch((err) => setError({ message: err.message || "Failed to load reservations" }));

    listTables(abortController.signal)
      .then(setTables)
      .catch((err) => setError({ message: err.message || "Failed to load tables" }));

    return () => abortController.abort();
  }, [date, location]);

  return (
    <main>
      <h1>Dashboard</h1>
      <ErrorAlert error={error} />
      <button onClick={() => navigate(`/dashboard?date=${previous(date)}`)}>Previous</button>
      <button onClick={() => navigate(`/dashboard?date=${today()}`)}>Today</button>
      <button onClick={() => navigate(`/dashboard?date=${next(date)}`)}>Next</button>

      
      <ReservationsList reservations={reservations} />

      
      <TablesList tables={tables} />
    </main>
  );
}

export default Dashboard;
