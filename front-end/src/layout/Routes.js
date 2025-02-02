import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../layout/Layout";
import Dashboard from "../dashboard/Dashboard";
import NewReservation from "../reservations/NewReservation";
import EditReservation from "../reservations/EditReservation";
import SeatReservation from "../reservations/SeatReservation";
import SearchReservation from "../reservations/SearchReservation";
import NewTable from "../tables/NewTable";
import NotFound from "../layout/NotFound";
import TablesPage from "../tables/TablesPage";
import ReservationsPage from "../reservations/ReservationsPage";

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/tables" element={<TablesPage />} />
        <Route path="/dashboard/reservations" element={<ReservationsPage />} />
        <Route path="/reservations/new" element={<NewReservation />} />
        <Route path="/reservations/:reservation_id/edit" element={<EditReservation />} />
        <Route path="/reservations/:reservation_id/seat" element={<SeatReservation />} />
        <Route path="/search" element={<SearchReservation />} />
        <Route path="/tables/new" element={<NewTable />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default AppRoutes;



