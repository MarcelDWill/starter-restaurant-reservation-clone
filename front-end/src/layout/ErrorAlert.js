import React from "react";

/**
 * Defines the error alert component.
 * If no error is provided, no alert is rendered.
 */
function ErrorAlert({ error }) {
  if (!error || !error.message) {
    return null;  // Safely handle cases where error is undefined
  }

  return (
    <div className="alert alert-danger">
      <strong>Error:</strong> {error.message}
    </div>
  );
}

export default ErrorAlert;

