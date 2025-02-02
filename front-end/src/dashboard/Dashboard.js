import React, { useEffect, useState } from 'react';
import { listReservations, listTables } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import ReservationsList from '../reservations/ReservationsList';
import TablesList from '../tables/TablesList';
import { previous, next, today } from '../utils/date-time';

function Dashboard({ date: initialDate }) {
  const [date, setDate] = useState(initialDate || today());
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboard = () => {
      const abortController = new AbortController();
      setError(null);

      listReservations({ date }, abortController.signal)
        .then(setReservations)
        .catch((err) => {
          console.error("Error fetching reservations:", err);
          setError(err);
        });

      listTables(abortController.signal)
        .then(setTables)
        .catch((err) => {
          console.error("Error fetching tables:", err);
          setError(err);
        });

      return () => abortController.abort();
    };

    loadDashboard();
  }, [date]);

  return (
    <main>
      <h1>Dashboard</h1>
      <ErrorAlert error={error} />
      <div>
        <button onClick={() => setDate(previous(date))}>Previous</button>
        <button onClick={() => setDate(today())}>Today</button>
        <button onClick={() => setDate(next(date))}>Next</button>
      </div>
      <ReservationsList reservations={reservations} />
      <TablesList tables={tables} />
    </main>
  );
}

export default Dashboard;