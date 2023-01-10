import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement); // TS: Added 'as HTMLElement' declaration
root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);

