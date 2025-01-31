import React from "react";
import NewReservation from "../reservations/newReservation";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";


/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function AppRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard date={today()} />} />
      <Route path="/reservations/new" element={<NewReservation />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    
  );
}

export default AppRoutes;
