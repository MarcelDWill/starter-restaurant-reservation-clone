import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './layout/Routes';
import './index.css';

// Define the root application
const App = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
