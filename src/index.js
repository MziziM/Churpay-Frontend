import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import './App.css';
import { NotificationProvider } from "./components/NotificationContext";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <NotificationProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </NotificationProvider>
);