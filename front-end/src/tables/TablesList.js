import React from "react";

function TablesList({ tables }) {
  return (
    <div>
      <h2>Tables</h2>
      <ul>
        {tables.map((table) => (
          <li key={table.table_id}>
            {table.table_name} - {table.capacity} - {table.reservation_id ? "Occupied" : "Free"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TablesList;
