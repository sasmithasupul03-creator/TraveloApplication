import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup, Carousel } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

const Hotels = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Search & Data State
    const [searchTerm, setSearchTerm] = useState("");
    const [hotelData, setHotelData] = useState({});
    const [bannerImages, setBannerImages] = useState([]);

    useEffect(() => {
        // 1. Get saved hotels from LocalStorage
        const savedHotels = JSON.parse(localStorage.getItem('siteHotels') || "[]");
        
        if (savedHotels.length > 0) {
            // Group hotels by category for the list
            const grouped = savedHotels.reduce((acc, hotel) => {
                if (!acc[hotel.category]) acc[hotel.category] = [];
                acc[hotel.category].push(hotel);
                return acc;
            }, {});
            setHotelData(grouped);

            // --- 2. EXTRACT IMAGES FOR THE HERO BANNER ---
            // Take the images from the first 5 hotels to create a slideshow
            const images = savedHotels.slice(0, 5).map(h => h.img).filter(img => img);
            setBannerImages(images);
        } else {
            // Default Data if empty
            const defaultHotel = { id: 1, category: "Luxury Resorts 💎", name: "Shangri-La Colombo", location: "Colombo", price: "$250/night", rating: 5, img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3" };
            setHotelData({ "Luxury Resorts 💎": [defaultHotel] });
            setBannerImages([defaultHotel.img]);
        }

        // 3. Handle Search from Home Page redirect
        if (location.state && location.state.searchQuery) {
            setSearchTerm(location.state.searchQuery);
        }

    }, [location.state]);

    const handleViewDetails = (hotel) => { navigate('/hotel-details', { state: { hotel } }); };

    return (
        <div className="animate-page" style={{ backgroundColor: '#f8f9fa', flex: 1 }}>
            
            {/* =================================================================================
               1. DYNAMIC HERO CAROUSEL (Smaller Size)
            ================================================================================= */}
            {/* 🛠️ CHANGED: Reduced height from 60vh to 40vh and minHeight to 300px */}
            <div style={{ position: 'relative', height: '40vh', minHeight: '300px', width: '100%', overflow: 'hidden' }}>
                
                {/* The Slideshow */}
                <Carousel fade interval={4000} controls={false} indicators={false} pause={false} className="h-100">
                    {bannerImages.length > 0 ? (
                        bannerImages.map((img, index) => (
                            <Carousel.Item key={index} className="h-100">
                                <img 
                                    src={img} 
                                    className="d-block w-100 h-100" 
                                    style={{ objectFit: 'cover', filter: 'brightness(0.5)' }} 
                                    alt={`Hotel Slide ${index}`}
                                />
                            </Carousel.Item>
                        ))
                    ) : (
                        // Fallback if no images found
                        <Carousel.Item className="h-100">
                            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945" className="d-block w-100 h-100" style={{ objectFit: 'cover', filter: 'brightness(0.5)' }} alt="Fallback" />
                        </Carousel.Item>
                    )}
                </Carousel>

                {/* Overlay Content & Search Bar */}
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white text-center p-3" style={{ zIndex: 10 }}>
                    
                    <h1 className="display-4 fw-bold text-uppercase mb-2 animate-fade-in" style={{ letterSpacing: '2px', textShadow: '2px 2px 10px rgba(0,0,0,0.8)' }}>
                        STAY IN PARADISE
                    </h1>
                    
                    <p className="lead fs-5 mb-4 animate-fade-in" style={{ maxWidth: '800px', textShadow: '1px 1px 5px rgba(0,0,0,0.8)' }}>
                        From luxury beachfront resorts to cozy hill country hideaways.
                    </p>
                    
                    {/* --- HOTEL SEARCH BAR --- */}
                    <div className="animate-fade-in" style={{ width: '100%', maxWidth: '600px', animationDelay: '0.2s' }}>
                        <InputGroup size="lg" className="shadow-lg">
                            <Form.Control 
                                placeholder="Search hotels or locations..." 
                                className="border-0 rounded-start-pill px-4 py-2" 
                                style={{ fontSize: '1rem' }}
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button 
                                variant="primary" 
                                className="rounded-end-pill px-4 fw-bold"
                                style={{ backgroundColor: '#0d6efd', border: 'none' }}
                            >
                                Search
                            </Button>
                        </InputGroup>
                    </div>

                </div>
            </div>

            {/* =================================================================================
               2. HOTEL LISTINGS
            ================================================================================= */}
            <Container style={{ marginTop: '-40px', position: 'relative', zIndex: 10, paddingBottom: '50px' }}>
                {Object.keys(hotelData).map((category, catIndex) => {
                    
                    // Filter Hotels based on Search Term
                    const filteredHotels = hotelData[category].filter(h => 
                        h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        h.location.toLowerCase().includes(searchTerm.toLowerCase())
                    );

                    if (filteredHotels.length === 0) return null;

                    return (
                        <div key={category} className="mb-5 animate-fade-in" style={{ animationDelay: `${catIndex * 0.2}s` }}>
                            {/* Category Title */}
                            <div className="d-flex align-items-center mb-4 ps-2">
                                <h2 className="fw-bold text-dark mb-0">{category}</h2>
                                <div className="ms-3 flex-grow-1" style={{ height: '2px', backgroundColor: '#dee2e6', borderRadius: '5px' }}></div>
                            </div>

                            {/* Cards Grid */}
                            <Row>
                                {filteredHotels.map((hotel) => (
                                    <Col md={6} lg={4} key={hotel.id} className="mb-4">
                                        <Card 
                                            className="h-100 border-0 shadow-sm hover-card rounded-4 overflow-hidden" 
                                            style={{ cursor: 'pointer', transition: 'transform 0.2s' }} 
                                            onClick={() => handleViewDetails(hotel)}
                                        >
                                            <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                                                <Card.Img 
                                                    src={hotel.img} 
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                    onError={(e) => e.target.src="https://via.placeholder.com/400x250?text=No+Image"} 
                                                />
                                                <Badge bg="light" text="dark" className="position-absolute top-0 end-0 m-3 shadow px-3 py-2 rounded-pill fw-bold">
                                                    ⭐ {hotel.rating}.0
                                                </Badge>
                                            </div>
                                            <Card.Body className="p-4 bg-white d-flex flex-column">
                                                <div className="mb-3">
                                                    <h4 className="fw-bold mb-1">{hotel.name}</h4>
                                                    <p className="text-muted small mb-0">📍 {hotel.location}</p>
                                                </div>
                                                
                                                <div className="mt-auto d-flex justify-content-between align-items-center pt-3 border-top">
                                                    <div>
                                                        <span className="text-muted small d-block">Starting from</span>
                                                        <span className="text-success fw-bold fs-5">{hotel.price}</span>
                                                    </div>
                                                    <Button variant="outline-primary" className="rounded-pill px-4 fw-bold">
                                                        View Deal
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    );
                })}

                {/* No Results Message */}
                {Object.values(hotelData).flat().filter(h => h.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                    <div className="text-center py-5">
                        <h4 className="text-muted">No hotels found matching "{searchTerm}"</h4>
                        <Button variant="link" onClick={() => setSearchTerm("")}>Clear Search</Button>
                    </div>
                )}

            </Container>
        </div>
    );
};

export default Hotels;