const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

console.log("REACT_APP_API_BASE_URL:", BASE_URL);

if (!BASE_URL) {
  throw new Error("REACT_APP_API_BASE_URL is not defined");
}

const headers = new Headers();
headers.append("Content-Type", "application/json");

async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);
    if (response.status === 204) {
      return null;
    }
    const payload = await response.json();
    if (payload.error) {
      throw new Error(payload.error);
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error("Fetch Error:", error);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

export async function listReservations(params, signal) {
  const url = new URL(`${BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );

  return await fetchJson(url, { signal }).then(
    (data) => data.filter((res) => res.status !== "cancelled")  // Filter cancelled here
  );
}


export async function listTables(signal) {
  const url = new URL(`/tables`, BASE_URL);

  return await fetch(url, { signal })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch tables: ${res.statusText}`);
      }
      return res.json();
    })
    .then((data) => data.data || []);
}


export async function createReservation(reservation) {
  const url = `${BASE_URL}/reservations`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: reservation }),
  };

  return await fetchJson(url, options);
}

export async function createTable(table, signal) {
  const url = `${BASE_URL}/tables`;
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: table }),
    signal,
  };
  return await fetchJson(url, options);
}

export async function readReservation(reservation_id, signal) {
  const url = new URL(`${BASE_URL}/reservations/${reservation_id}`);
  return await fetchJson(url, { headers, signal }, []);
}

export async function searchByMobileNumber(mobile_number, signal) {
  const url = `${BASE_URL}/reservations?mobile_number=${mobile_number}`;
  return await fetch(url, { signal })
    .then((res) => res.json())
    .then((data) => data.data || []);
}

export async function updateTableForSeating(table_id, reservation_id) {
  const url = `${process.env.REACT_APP_API_BASE_URL}/tables/${table_id}/seat`;
  const options = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: { reservation_id } }),
  };
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Failed to seat reservation: ${response.statusText}`);
  }
  return await response.json();
}

export async function updateReservation(reservation_id, reservationData) {
  const url = `${process.env.REACT_APP_API_BASE_URL}/reservations/${reservation_id}`;
  const options = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: reservationData }),
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    const errorResponse = await response.json();  // Capture server error response
    throw new Error(errorResponse.message || `Failed to update reservation: ${response.statusText}`);
  }
  return response.json();
}



export async function changeReservationStatus(reservationId, status) {
  const url = `${process.env.REACT_APP_API_BASE_URL}/reservations/${reservationId}/status`;
  const options = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: { status } }),
  };
  return await fetchJson(url, options);
}

export async function finishTable(table_id) {
  const url = `${process.env.REACT_APP_API_BASE_URL}/tables/${table_id}/seat`;
  const options = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  };
  return await fetch(url, options);
}

