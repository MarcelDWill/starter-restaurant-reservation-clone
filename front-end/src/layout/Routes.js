import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../dashboard/Dashboard';
import NewReservation from '../reservations/newReservation';
import EditReservation from '../reservations/EditReservation';
import SeatReservation from '../reservations/SeatReservation';
import SearchReservation from '../reservations/SearchReservation';
import NewTable from '../tables/NewTable';
import NotFound from '../layout/NotFound';


function AppRoutes() {
  return (
    <Routes>
      {/* Redirect root path to the dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" />} />

      {/* Main routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/reservations/new" element={<NewReservation />} />
      <Route path="/reservations/:reservation_id/edit" element={<EditReservation />} />
      <Route path="/reservations/:reservation_id/seat" element={<SeatReservation />} />
      <Route path="/search" element={<SearchReservation />} />
      <Route path="/tables/new" element={<NewTable />} />

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;


