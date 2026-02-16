import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Placeholder imports until we implement the pages
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import Register from './pages/Register';
import Success from './pages/Success';
import Schedule from './pages/Schedule';
import Contact from './pages/Contact';
import Payment from './pages/payment';
import AdminLogin from "./admin/Admin.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import AdminGuard from "./admin/AdminGuard.jsx";






import ScrollToTop from './components/ScrollToTop';
import DesktopPopup from './components/DesktopPopup';
import Preloader from './components/Preloader';
import SmoothScroll from './components/SmoothScroll';
import CircuitBackground from './components/CircuitBackground';

import JoinTeam from './components/Jointeam';

function App() {
  const [loading, setLoading] = useState(true);
  const [isJoinTeamOpen, setIsJoinTeamOpen] = useState(false);

  const openJoinTeam = () => setIsJoinTeamOpen(true);

  return (
    <>
      <CircuitBackground />
      <SmoothScroll />
      {loading && <Preloader onFinish={() => setLoading(false)} />}
      <Router>
        <ScrollToTop />
        <DesktopPopup />
        <JoinTeam isOpen={isJoinTeamOpen} onClose={() => setIsJoinTeamOpen(false)} />
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
          <Navbar openJoinTeam={openJoinTeam} />
          <main style={{ flex: 1, paddingTop: '80px' }}>
            <Routes>


              <Route path="/__altranz_admin_login" element={<AdminLogin />} />
              <Route path="/__altranz_admin_panel" element={<AdminGuard>  <AdminDashboard /></AdminGuard>} />
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/events" element={<Events />} />
              <Route path="/register" element={<Register openJoinTeam={openJoinTeam} />} />
              <Route path="/success" element={<Success />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/payment" element={<Payment />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;
