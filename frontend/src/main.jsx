import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios'

// Define the Base URL dynamically for all API calls
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
