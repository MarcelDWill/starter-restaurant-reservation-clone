import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NewReservation from "../reservations/newReservation";
import EditReservation from "../reservations/EditReservation";
import SearchReservation from "../reservations/SearchReservation";
import SeatReservation from "../tables/SeatReservation";
import NotFound from "./NotFound";


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
      <Route exact path="/reservations/new">
        <NewReservation />
      </Route>
      <Route exact path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>
      <Route exact path="/reservations/:reservation_id/seat">
        <SeatReservation />
      </Route>
      <Route exact path="/search">
        <SearchReservation />
      </Route>
      <Route exact path={["/dashboard", "/dashboard/:date"]}>
        <Dashboard />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
