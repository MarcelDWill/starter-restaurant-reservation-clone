/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsList from "../reservations/ReservationsList";
import TablesList from "../tables/TablesList";
import { useNavigate , useLocation } from "react-router-dom";
import { previous, next, today } from "../utils/date-time";

function Dashboard({ date }) {
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
      .catch(setError);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setError);
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
