import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../dashboard/Dashboard';
import NewReservation from '../reservations/newReservation';
import EditReservation from '../reservations/EditReservation';
import SeatReservation from '../reservations/SeatReservation';
import SearchReservation from '../reservations/SearchReservation';
import NotFound from './NotFound';
import NewTable from '../tables/NewTable';  // Double-check the file path and name!


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/reservations/new" element={<NewReservation />} />
      <Route path="/reservations/:reservation_id/edit" element={<EditReservation />} />
      <Route path="/reservations/:reservation_id/seat" element={<SeatReservation />} />
      <Route path="/tables/new" element={<NewTable />} />
      <Route path="/search" element={<SearchReservation />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;

