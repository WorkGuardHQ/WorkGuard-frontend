// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App'
// import { BrowserRouter } from 'react-router-dom'
// import 'bootstrap/dist/css/bootstrap.min.css';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <BrowserRouter>
//     <App />
//   </BrowserRouter>
// )


import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import 'toastr/build/toastr.min.css';

import "./i18n"; 
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
    <ToastProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </ToastProvider>
  </React.StrictMode>
);