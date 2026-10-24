import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddRecord from './pages/AddRecord';
import MothersProfile from './pages/MothersProfile';
import Nutrition from './pages/Nutrition';
import Hygiene from './pages/Hygiene';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import AllRecords from './pages/AllRecords';
import Navbar from './components/Navbar';

const PrivateRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);
  if (loading) return (
    <div className="loader-container">
      <div className="spinner"></div>
    </div>
  );
  return token ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  const { token } = useContext(AuthContext);

  return (
    <Router>
      {token && <Navbar />}
      <div className={token ? "app-container" : ""}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/add-record" element={<PrivateRoute><AddRecord /></PrivateRoute>} />
          <Route path="/mothers" element={<PrivateRoute><MothersProfile /></PrivateRoute>} />
          <Route path="/nutrition" element={<PrivateRoute><Nutrition /></PrivateRoute>} />
          <Route path="/hygiene" element={<PrivateRoute><Hygiene /></PrivateRoute>} />
          <Route path="/alerts" element={<PrivateRoute><Alerts /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
          <Route path="/all-records" element={<PrivateRoute><AllRecords /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
