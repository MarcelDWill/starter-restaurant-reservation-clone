import React from 'react';
import Menu from './Menu';
import './Layout.css';

function Layout({ children }) {
  return (
    <div className="container-fluid">
      <div className="row h-100">
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
