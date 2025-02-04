import React, { useEffect, useState, useCallback } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsList from "../reservations/ReservationsList";
import TablesList from "../tables/ListTables";
import { previous, next, today, formatAsUTCDate } from "../utils/date-time";

function Dashboard({ date: initialDate }) {
  const [date, setDate] = useState(initialDate || today());
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);

  const loadDashboard = useCallback(() => {
    const abortController = new AbortController();
    setError(null);

    listReservations({ date: formatAsUTCDate(date) }, abortController.signal)
      .then(setReservations)
      .catch(setError);

    listTables(abortController.signal)
      .then(setTables)
      .catch(setError);

    return () => abortController.abort();
  }, [date]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <main>
      <h1>Dashboard</h1>
      <h2>Date: {formatAsUTCDate(date)}</h2>  {/* Display UTC date */}
      <ErrorAlert error={error} />
      <div>
        <button onClick={() => setDate(previous(date))}>Previous</button>
        <button onClick={() => setDate(today())}>Today</button>
        <button onClick={() => setDate(next(date))}>Next</button>
      </div>
      <ReservationsList reservations={reservations} loadDashboard={loadDashboard} />
      <TablesList tables={tables} loadDashboard={loadDashboard} />
    </main>
  );
}

export default Dashboard;
