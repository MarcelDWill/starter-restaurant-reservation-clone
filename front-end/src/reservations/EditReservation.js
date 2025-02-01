import React, { useEffect, useState } from "react";
import { useParams, useNavigate  } from "react-router-dom";
import { readReservation } from "../utils/api";

import ReservationForm from "./ReservationForm";
import ErrorAlert from "../layout/ErrorAlert";

function EditReservation() {
  const { reservation_id } = useParams();
  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const abortController = new AbortController();
    readReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setError);
    return () => abortController.abort();
  }, [reservation_id]);

  if (!reservation) {
    return <ErrorAlert error={error} />;
  }

  return (
    <ReservationForm
      initialData={reservation}
      onSuccess={() => navigate(`/dashboard?date=${reservation.reservation_date}`)}
    />
  );
}

export default EditReservation;
