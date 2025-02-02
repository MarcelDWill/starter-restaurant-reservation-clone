import React, { useEffect, useState } from "react";
import { listTables } from "../utils/api";
import ListTables from "./ListTables";
import ErrorAlert from "../layout/ErrorAlert";

function TablesPage() {
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    setError(null);

    listTables(abortController.signal)
      .then(setTables)
      .catch(setError);

    return () => abortController.abort();
  }, []);

  return (
    <main>
      <h1>Tables</h1>
      <ErrorAlert error={error} />
      <ListTables tables={tables} finishHandler={() => {}} />
    </main>
  );
}

export default TablesPage;

