import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Tabs, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const MyTrip = () => {
    const [tripItems, setTripItems] = useState([]);
    const navigate = useNavigate();
    
    // Get user from storage
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        // 1. Redirect if not logged in
        if (!user) {
            navigate('/login');
            return;
        }

        // 2. Load USER SPECIFIC trip data
        const userTripKey = `myTrip_${user.email}`;
        const savedTrip = JSON.parse(localStorage.getItem(userTripKey) || "[]");
        setTripItems(savedTrip);

    }, [navigate, user?.email]); 

    const handleRemove = (itemToRemove) => {
        if(!window.confirm("Remove this item?")) return;

        // Filter out the specific item
        const updatedTrip = tripItems.filter(item => item !== itemToRemove);
        setTripItems(updatedTrip);
        
        // Save back to local storage
        if (user) {
            const userTripKey = `myTrip_${user.email}`;
            localStorage.setItem(userTripKey, JSON.stringify(updatedTrip));
        }
    };

    const handleClearAll = () => {
        if(window.confirm("Are you sure you want to clear your entire trip?")) { 
            localStorage.removeItem(`myTrip_${user.email}`); 
            setTripItems([]); 
        } 
    };

    // Separate Data
    const hotels = tripItems.filter(item => item.type === 'hotel');
    const places = tripItems.filter(item => item.type !== 'hotel');

    if (!user) return null;

    return (
        <div className="animate-page" style={{ backgroundColor: '#f8f9fa', flex: 1, paddingTop: '40px' }}>
            <Container>
                {/* HEADER */}
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <div>
                        <h2 className="fw-bold display-6 mb-1">My Trip 🎒</h2>
                        <p className="text-muted">Hey {user.username}, manage your bookings and saved spots.</p>
                    </div>
                    {tripItems.length > 0 && (
                        <Button variant="outline-danger" size="sm" onClick={handleClearAll}>Clear All</Button>
                    )}
                </div>

                {tripItems.length === 0 ? (
                    <div className="text-center py-5 bg-white rounded-4 shadow-sm">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
                        <h4 className="text-muted">Your trip is empty.</h4>
                        <p className="text-secondary">Start adding hotels and destinations to build your perfect journey.</p>
                        <Button variant="primary" className="mt-3 rounded-pill px-4" onClick={() => navigate('/places')}>Explore Destinations</Button>
                    </div>
                ) : (
                    <Tabs 
                        defaultActiveKey={hotels.length > 0 ? "hotels" : "places"} 
                        id="mytrip-tabs" 
                        className="mb-4 border-0 custom-tabs"
                        fill
                    >
                        {/* TAB 1: BOOKED HOTELS */}
                        <Tab eventKey="hotels" title={<span className="py-2 d-block">🏨 Booked Stays ({hotels.length})</span>}>
                            {hotels.length === 0 ? (
                                <div className="text-center py-5 text-muted">No hotels booked yet.</div>
                            ) : (
                                <Row>
                                    {hotels.map((hotel, index) => (
                                        <Col md={12} key={index} className="mb-3">
                                            <Card className="border-0 shadow-sm rounded-4 overflow-hidden animate-fade-in">
                                                <Row className="g-0">
                                                    <Col md={3} style={{ minHeight: '150px' }}>
                                                        <img 
                                                            src={hotel.img} 
                                                            alt={hotel.name} 
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                            onError={(e) => e.target.src="https://via.placeholder.com/300?text=Hotel"}
                                                        />
                                                    </Col>
                                                    <Col md={9}>
                                                        <Card.Body className="d-flex flex-column h-100 justify-content-center">
                                                            <div className="d-flex justify-content-between align-items-start">
                                                                <div>
                                                                    <Badge bg="success" className="mb-2">Confirmed ✅</Badge>
                                                                    <h4 className="fw-bold mb-1">{hotel.name}</h4>
                                                                    <p className="text-muted small mb-2">📍 {hotel.location}</p>
                                                                </div>
                                                                <h3 className="text-success fw-bold">{hotel.price}</h3>
                                                            </div>
                                                            
                                                            <div className="d-flex align-items-center bg-light p-2 rounded border mt-2" style={{ maxWidth: 'fit-content' }}>
                                                                <span className="fw-bold text-dark mx-2">📅 Check-in: {hotel.checkIn}</span>
                                                                <span className="text-muted">➔</span>
                                                                <span className="fw-bold text-dark mx-2">Check-out: {hotel.checkOut}</span>
                                                            </div>

                                                            <div className="mt-3 text-end">
                                                                <Button variant="outline-danger" size="sm" onClick={() => handleRemove(hotel)}>Cancel Booking</Button>
                                                            </div>
                                                        </Card.Body>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                        </Tab>

                        {/* TAB 2: SAVED PLACES */}
                        <Tab eventKey="places" title={<span className="py-2 d-block">📍 Saved Places ({places.length})</span>}>
                            {places.length === 0 ? (
                                <div className="text-center py-5 text-muted">No places saved yet.</div>
                            ) : (
                                <Row>
                                    {places.map((place, index) => (
                                        <Col md={6} lg={4} key={index} className="mb-4">
                                            <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                                <div style={{ height: '200px', position: 'relative' }}>
                                                    <Card.Img 
                                                        src={place.image} 
                                                        style={{ height: '100%', objectFit: 'cover' }} 
                                                        onError={(e) => e.target.src="https://via.placeholder.com/300?text=Place"}
                                                    />
                                                    <Button 
                                                        variant="danger" 
                                                        size="sm" 
                                                        className="position-absolute top-0 end-0 m-2 rounded-circle shadow" 
                                                        style={{width:'32px', height:'32px', padding:0, display:'flex', alignItems:'center', justifyContent:'center'}} 
                                                        onClick={() => handleRemove(place)}
                                                        title="Remove"
                                                    >
                                                        ✕
                                                    </Button>
                                                    <Badge bg="dark" className="position-absolute bottom-0 start-0 m-3">{place.category}</Badge>
                                                </div>
                                                <Card.Body>
                                                    <h5 className="fw-bold">{place.name}</h5>
                                                    <p className="text-muted small mb-3">📍 {place.location || "Sri Lanka"}</p>
                                                    <Button 
                                                        variant="outline-primary" 
                                                        className="w-100 rounded-pill fw-bold" 
                                                        onClick={() => navigate(`/place/${place.id}/${place.name}`)}
                                                    >
                                                        View Details
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                        </Tab>
                    </Tabs>
                )}
            </Container>

            {/* Custom CSS for Tabs */}
            <style>{`
                .custom-tabs .nav-link {
                    color: #6c757d;
                    font-weight: 600;
                    font-size: 1.1rem;
                    border: none;
                    background-color: transparent;
                    border-bottom: 3px solid transparent;
                    transition: all 0.3s ease;
                }
                .custom-tabs .nav-link:hover {
                    color: #0d6efd;
                    background-color: rgba(13, 110, 253, 0.05);
                }
                .custom-tabs .nav-link.active {
                    color: #0d6efd;
                    background-color: transparent;
                    border-bottom: 3px solid #0d6efd;
                }
            `}</style>
        </div>
    );
};

export default MyTrip;