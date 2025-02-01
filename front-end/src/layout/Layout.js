import React from "react";
import Menu from "./Menu";  // Ensure you have a working Menu.js
import "./Layout.css";

function Layout({ children }) {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2 side-bar">
          <Menu />
        </div>
        <div className="col">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;

