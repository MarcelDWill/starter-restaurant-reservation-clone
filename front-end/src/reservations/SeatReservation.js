import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { listTables, updateTableForSeating } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function SeatReservation() {
  const { reservation_id } = useParams();
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const abortController = new AbortController();
    listTables(abortController.signal)
      .then(setTables)
      .catch(setError);

    return () => abortController.abort();
  }, []);

  const handleChange = (event) => {
    setSelectedTable(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      await updateTableForSeating(selectedTable, reservation_id);
      navigate("/dashboard");
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div>
      <h2>Seat Reservation</h2>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit}>
        <label htmlFor="table_id">Select Table:</label>
        <select id="table_id" name="table_id" onChange={handleChange} required>
          <option value="">-- Select a Table --</option>
          {tables.map((table) => (
            <option key={table.table_id} value={table.table_id}>
              {table.table_name} - {table.capacity}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">Seat</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
      </form>
    </div>
  );
}

export default SeatReservation;
