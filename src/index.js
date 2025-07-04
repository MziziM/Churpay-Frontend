import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import './App.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);db.run(`CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  name TEXT NOT NULL,
  amount TEXT NOT NULL,
  status TEXT NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id)
)`);