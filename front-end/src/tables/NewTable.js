import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTable, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function NewTable() {
  const initialTableState = { table_name: "", capacity: 1 };
  const [tableData, setTableData] = useState(initialTableState);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = ({ target }) => {
    setTableData({
      ...tableData,
      [target.name]: target.name === "capacity" ? Number(target.value) : target.value,
    });
  };

  const validateForm = () => {
    if (tableData.table_name.length < 2) {
      return "Table name must be at least 2 characters long.";
    }
    if (tableData.capacity < 1) {
      return "Capacity must be at least 1 person.";
    }
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError({ message: validationError });
      return;
    }

    try {
      const existingTables = await listTables(); // Fetch all tables

      // Check if the table name already exists
      if (existingTables.some((table) => table.table_name === tableData.table_name)) {
        setError({ message: `Table "${tableData.table_name}" already exists.` });
        return;
      }

      await createTable(tableData);
      navigate("/dashboard");
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div>
      <h2>Create New Table</h2>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="table_name">Table Name:</label>
          <input
            id="table_name"
            name="table_name"
            type="text"
            onChange={handleChange}
            value={tableData.table_name}
            required
          />
        </div>
        <div>
          <label htmlFor="capacity">Capacity:</label>
          <input
            id="capacity"
            name="capacity"
            type="number"
            min="1"
            onChange={handleChange}
            value={tableData.capacity}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default NewTable;


