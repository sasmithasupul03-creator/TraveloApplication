import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; 

// --- COMPONENTS ---
import Navigation from './components/Navigation';
import Footer from './components/Footer'; // <--- 1. IMPORT FOOTER

// --- PAGES ---
import Home from './pages/Home';
import Places from './pages/Places';
import AddPlace from './pages/AddPlace';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import PlanSelection from './pages/PlanSelection'; 
import PlanDetails from './pages/PlanDetails';
import PlaceDetails from './pages/PlaceDetails';
import TripPlans from './pages/TripPlans'; 
import MyTrip from './pages/MyTrip';
import DayDetails from './pages/DayDetails';
import ItemDetails from './pages/ItemDetails';
import Hotels from './pages/Hotels'; 
import HotelDetails from './pages/HotelDetails';

const PrivateRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.role === 'ADMIN' ? children : <Navigate to="/" />;
};

function App() {
  return (
    // 1. FLEX WRAPPER FOR STICKY FOOTER
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <Navigation />
      
      {/* 2. MAIN CONTENT GROWS TO FILL SPACE */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/hotels" element={<PrivateRoute><Hotels /></PrivateRoute>} />

          {/* User Routes */}
          <Route path="/places" element={<PrivateRoute><div className="container mt-4 animate-fade-in"><Places /></div></PrivateRoute>} />
          <Route path="/mytrip" element={<PrivateRoute><MyTrip /></PrivateRoute>} />
          <Route path="/trip-plans" element={<PrivateRoute><TripPlans /></PrivateRoute>} /> 
          <Route path="/plan-selection/:duration" element={<PrivateRoute><PlanSelection /></PrivateRoute>} />
          <Route path="/plan-details/:planId" element={<PrivateRoute><PlanDetails /></PrivateRoute>} />
          <Route path="/place/:planId/:placeName" element={<PrivateRoute><PlaceDetails /></PrivateRoute>} />
          <Route path="/plan-day/:planId/:dayNum" element={<PrivateRoute><DayDetails /></PrivateRoute>} />
          <Route path="/item-details" element={<PrivateRoute><ItemDetails /></PrivateRoute>} />
          <Route path="/hotel-details" element={<PrivateRoute><HotelDetails /></PrivateRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/add-place" element={<AdminRoute><div className="container mt-4"><AddPlace /></div></AdminRoute>} />
        </Routes>
      </div>
      
      {/* 3. DYNAMIC FOOTER COMPONENT (Replaces hardcoded footer) */}
      <Footer />
      
    </div>
  );
}

export default App;