import React from "react";
import { finishTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function ListTables({ tables, loadDashboard }) {
  const handleFinish = async (table_id) => {
    if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
      try {
        await finishTable(table_id);
        loadDashboard(); // Refresh the dashboard after finishing the table
      } catch (err) {
        console.error("Error finishing table:", err);
      }
    }
  };

  return (
    <div>
      <ErrorAlert />
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Table ID</th>
            <th>Table Name</th>
            <th>Capacity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table) => (
            <tr key={table.table_id}>
              <td>{table.table_id}</td>
              <td>{table.table_name}</td>
              <td>{table.capacity}</td>
              <td data-table-id-status={table.table_id}>
                {table.reservation_id ? "Occupied" : "Free"}
              </td>
              <td>
                {table.reservation_id && (
                  <button
                    className="btn btn-danger"
                    data-table-id-finish={table.table_id}
                    onClick={() => handleFinish(table.table_id)}
                  >
                    Finish
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListTables;


