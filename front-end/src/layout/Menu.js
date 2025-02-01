import React from 'react';
import { Link } from 'react-router-dom';

function Menu() {
  return (
    <nav className="nav flex-column">
      <Link className="nav-link" to="/dashboard">Dashboard</Link>
      <Link className="nav-link" to="/search">Search</Link>
      <Link className="nav-link" to="/reservations/new">New Reservation</Link>
      <Link className="nav-link" to="/tables/new">New Table</Link>
    </nav>
  );
}

export default Menu;
