import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  const isPlansActive = location.pathname.includes('/trip-plans') || 
                        location.pathname.includes('/plan-selection') || 
                        location.pathname.includes('/plan-details') || 
                        location.pathname.includes('/place/');

  return (
    // 1. WRAPPER FOR AUTO-HIDE ANIMATION
    <div className="nav-hover-wrapper">
        
        {/* 2. NAVBAR (Removed 'sticky-top' to let CSS handle it) */}
        <Navbar bg="primary" variant="dark" expand="lg" className="shadow">
          <Container>
            <Navbar.Brand as={Link} to="/" className="fw-bold" style={{ fontSize: '1.5rem' }}>
              🌴 The Traveler
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto align-items-center">
                
                <NavLink 
                  to="/" 
                  end 
                  className={({ isActive }) => isActive ? "nav-link nav-link-custom active" : "nav-link nav-link-custom"}
                >
                  Home
                </NavLink>

                {user && (
                    <NavLink 
                      to="/hotels" 
                      className={({ isActive }) => isActive ? "nav-link nav-link-custom active" : "nav-link nav-link-custom"}
                    >
                      Hotels
                    </NavLink>
                )}

                {user && (
                    <NavLink 
                      to="/places" 
                      className={({ isActive }) => isActive ? "nav-link nav-link-custom active" : "nav-link nav-link-custom"}
                    >
                      Destinations
                    </NavLink>
                )}

                {user && (
                    <NavLink 
                      to="/mytrip" 
                      className={({ isActive }) => isActive ? "nav-link nav-link-custom active" : "nav-link nav-link-custom"}
                    >
                      My Trip
                    </NavLink>
                )}

                {user && (
                    <NavLink 
                      to="/trip-plans" 
                      className={({ isActive }) => (isActive || isPlansActive) ? "nav-link nav-link-custom active" : "nav-link nav-link-custom"}
                    >
                      Trip Plans
                    </NavLink>
                )}

                {user && user.role === 'ADMIN' && (
                    <NavLink 
                      to="/admin" 
                      className={({ isActive }) => isActive ? "nav-link nav-link-custom active" : "nav-link nav-link-custom"}
                    >
                        👑 Admin Dashboard
                    </NavLink>
                )}
                
              </Nav>
              
              <Nav>
                {user ? (
                    <div className="d-flex align-items-center">
                        <span className="text-white me-3 small">
                            Welcome, <strong>{user.name || user.username}</strong>
                        </span>
                        <Button variant="outline-light" size="sm" onClick={handleLogout}>Logout</Button>
                    </div>
                ) : (
                    <>
                        <Link to="/login"><Button variant="outline-light" className="me-2 btn-sm">Sign In</Button></Link>
                        <Link to="/register"><Button variant="warning" className="text-dark fw-bold btn-sm">Sign Up</Button></Link>
                    </>
                )}
              </Nav>
              
            </Navbar.Collapse>
          </Container>
        </Navbar>
        
    </div>
  );
};

export default Navigation;