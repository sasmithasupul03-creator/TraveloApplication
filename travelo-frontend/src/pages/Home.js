import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Carousel, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    
    // --- DATA STATE ---
    const [notifications, setNotifications] = useState([
        "🔔 Heavy rains expected in the central hills this week.",
        "✨ New 5-Day Express Plan available now!",
        "🐘 Discounts on Yala Safari bookings until Friday."
    ]);
    
    const [intro, setIntro] = useState({
        title: "AN ISLAND ESCAPE AWAITS YOU",
        desc: "Welcome to Sri Lanka! From golden beaches to misty mountains...",
        images: [
            "https://images.unsplash.com/photo-1546708773-e57c6b90703f?ixlib=rb-4.0.3",
            "https://images.unsplash.com/photo-1588258524675-55d6563e414c?ixlib=rb-4.0.3",
            "https://images.unsplash.com/photo-1585675890297-23a4673d6642?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1920"
        ]
    });

    const categoryData = {
        "Beaches": { icon: "🏖️", color: "info", subtitle: "Sun, Sand & Turquoise Waters" },
        "Hill Country": { icon: "⛰️", color: "success", subtitle: "Tea Plantations & Misty Peaks" },
        "Cultural": { icon: "🏛️", color: "warning", subtitle: "Ancient Cities & Sacred Temples" },
        "Wildlife": { icon: "🐘", color: "danger", subtitle: "National Parks & Safaris" },
        "Modern City": { icon: "🏙️", color: "primary", subtitle: "Shopping, Dining & Nightlife" }
    };

    // Default reviews
    const [reviews, setReviews] = useState([
        { id: 1, user: "Sarah", location: "UK", text: "Sigiriya was breathtaking! The climb was tough but worth it.", rating: 5 },
        { id: 2, user: "Chen", location: "China", text: "The 15-day plan was perfect. We saw wild elephants!", rating: 5 },
        { id: 3, user: "Amara", location: "Dubai", text: "Luxury resort recommendations were spot on.", rating: 5 }
    ]);

    // --- LOAD DATA ---
    useEffect(() => {
        const savedIntro = localStorage.getItem('siteIntro');
        if (savedIntro) setIntro(JSON.parse(savedIntro));
        const savedNotes = localStorage.getItem('siteNotifications');
        if (savedNotes) setNotifications(JSON.parse(savedNotes));
        
        const savedReviews = localStorage.getItem('siteReviews');
        if (savedReviews) {
            const userReviews = JSON.parse(savedReviews);
            setReviews([...userReviews, ...reviews]);
        }
    }, []); 

    // --- ANIMATED NOTIFICATION LOGIC ---
    const [currentNotifyIndex, setCurrentNotifyIndex] = useState(0);
    const [notifyAnimating, setNotifyAnimating] = useState(false);

    useEffect(() => {
        if (notifications.length > 0) {
            const interval = setInterval(() => {
                setNotifyAnimating(true); 
                setTimeout(() => {
                    setCurrentNotifyIndex((prevIndex) => (prevIndex + 1) % notifications.length);
                    setNotifyAnimating(false); 
                }, 500); 
            }, 4000); 
            return () => clearInterval(interval);
        }
    }, [notifications]);

    // --- 🆕 SLIM REVIEW ANIMATION LOGIC ---
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
    const [reviewAnimating, setReviewAnimating] = useState(false);

    useEffect(() => {
        if (reviews.length > 0) {
            const interval = setInterval(() => {
                setReviewAnimating(true);
                setTimeout(() => {
                    setCurrentReviewIndex((prevIndex) => (prevIndex + 1) % reviews.length);
                    setReviewAnimating(false);
                }, 600);
            }, 6000);
            return () => clearInterval(interval);
        }
    }, [reviews]);


    // --- SEARCH LOGIC ---
    const handleSearch = (e) => {
        e.preventDefault();
        const query = searchTerm.trim().toLowerCase();
        if (!query) return;

        const places = JSON.parse(localStorage.getItem('sitePlaces') || "[]");
        const hotels = JSON.parse(localStorage.getItem('siteHotels') || "[]");

        const matchedPlace = places.find(p => p.name.toLowerCase().includes(query));
        if (matchedPlace) { navigate(`/place/${matchedPlace.id}/${matchedPlace.name}`); return; }

        const matchedHotel = hotels.find(h => h.name.toLowerCase().includes(query));
        if (matchedHotel) { navigate('/hotel-details', { state: { hotel: matchedHotel } }); return; }

        const matchedLocationPlace = places.find(p => p.location.toLowerCase().includes(query));
        if (matchedLocationPlace) { navigate(`/place/${matchedLocationPlace.id}/${matchedLocationPlace.name}`); return; }

        alert("No specific place or hotel found.");
    };

    const currentReview = reviews[currentReviewIndex];

    return (
        <div className="animate-page" style={{ backgroundColor: '#f8f9fa', paddingBottom: '0', flex: 1, display: 'flex', flexDirection: 'column' }}>
            
            {/* HERO */}
            <div style={{ position: 'relative', height: '80vh', width: '100%', overflow: 'hidden' }}>
                <Carousel controls={false} indicators={false} interval={4000} pause={false} fade>
                    {intro.images.map((img, index) => (
                        <Carousel.Item key={index}>
                            <img className="d-block w-100" src={img} alt={`Slide ${index}`} style={{ height: '80vh', objectFit: 'cover', filter: 'brightness(0.6)' }} />
                        </Carousel.Item>
                    ))}
                </Carousel>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: 'white', zIndex: 10 }}>
                    <Container>
                        <h1 className="fw-bold text-uppercase mb-3 animate-fade-in" style={{ fontSize: '3.5rem', textShadow: '2px 2px 10px rgba(0,0,0,0.8)' }}>{intro.title}</h1>
                        <p className="lead mb-5 fw-bold animate-fade-in" style={{ fontSize: '1.4rem', textShadow: '1px 1px 5px rgba(0,0,0,0.8)' }}>{intro.desc}</p>
                        <Form className="d-flex justify-content-center w-100 animate-fade-in" onSubmit={handleSearch}>
                            <div className="bg-white p-2 rounded-pill shadow-lg d-flex align-items-center" style={{ width: '100%', maxWidth: '600px' }}>
                                <Form.Control type="search" placeholder="Search hotels or locations..." className="border-0 me-2 shadow-none" style={{ borderRadius: '20px', fontSize: '1.1rem', paddingLeft: '20px' }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                <Button variant="primary" type="submit" className="rounded-pill px-4 py-2 fw-bold">Search</Button>
                            </div>
                        </Form>
                    </Container>
                </div>
            </div>

            {/* CONTENT */}
            <Container style={{ marginTop: '-40px', position: 'relative', zIndex: 20 }}>
                
                {/* NOTIFICATIONS */}
                <div className="mb-5 d-flex justify-content-center">
                    <div className="bg-white shadow-sm rounded-pill px-4 py-2 d-flex align-items-center" style={{ maxWidth: '600px', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <Badge bg="danger" className="me-3 rounded-pill">LIVE</Badge>
                        <div style={{ overflow: 'hidden', height: '24px', display: 'flex', alignItems: 'center' }}>
                            <span className={`text-dark fw-bold small text-truncate ${notifyAnimating ? 'fade-out-up' : 'fade-in-up'}`} style={{ transition: 'opacity 0.5s ease, transform 0.5s ease', display: 'block' }}>
                                {notifications.length > 0 ? notifications[currentNotifyIndex] : "Welcome to Sri Lanka!"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* PLANS */}
                <div className="mb-5 pt-2">
                    <div className="text-center mb-5"><h2 className="fw-bold display-6">Curated Travel Plans</h2><p className="text-muted lead">Choose a style that suits your journey</p></div>
                    <Row>
                        <Col md={4} className="mb-4"><Card className="h-100 text-center p-4 shadow-sm border-0 hover-card bg-white rounded-4"><div className="mb-3 text-primary" style={{ fontSize: '3rem' }}>⚡</div><h4 className="fw-bold">5-Day Express</h4><p className="text-muted small mb-3">Colombo • Kandy • Sigiriya</p><Link to="/plan-selection/5" className="btn btn-outline-primary rounded-pill fw-bold stretched-link px-4">View Plans</Link></Card></Col>
                        <Col md={4} className="mb-4"><Card className="h-100 text-center p-4 shadow-sm border-0 hover-card bg-white rounded-4"><div className="mb-3 text-success" style={{ fontSize: '3rem' }}>🌿</div><h4 className="fw-bold">15-Day Explorer</h4><p className="text-muted small mb-3">Culture • Hills • Safari • Beach</p><Link to="/plan-selection/15" className="btn btn-outline-success rounded-pill fw-bold stretched-link px-4">View Plans</Link></Card></Col>
                        <Col md={4} className="mb-4"><Card className="h-100 text-center p-4 shadow-sm border-0 hover-card bg-white rounded-4"><div className="mb-3 text-warning" style={{ fontSize: '3rem' }}>🎒</div><h4 className="fw-bold">30-Day Grand</h4><p className="text-muted small mb-3">The Ultimate Island Tour</p><Link to="/plan-selection/30" className="btn btn-outline-warning text-dark rounded-pill fw-bold stretched-link px-4">View Plans</Link></Card></Col>
                    </Row>
                </div>

                {/* CATEGORIES */}
                <div className="mb-5">
                    <h3 className="mb-4 fw-bold ps-3" style={{ borderLeft: '5px solid #0d6efd' }}>Explore by Interest</h3>
                    <Row className="justify-content-center">
                        {Object.keys(categoryData).map((cat) => {
                            const data = categoryData[cat];
                            return (<Col md={4} sm={6} className="mb-4" key={cat}><Card className="h-100 text-center p-4 shadow-sm border-0 hover-card bg-white rounded-4 d-flex flex-column"><div className={`mb-3 text-${data.color}`} style={{ fontSize: '3.5rem' }}>{data.icon}</div><h4 className="fw-bold">{cat}</h4><p className="text-muted small mb-4">{data.subtitle}</p><Link to={`/places?category=${cat}`} className={`btn btn-outline-${data.color} rounded-pill fw-bold stretched-link px-4 mt-auto`}>Explore</Link></Card></Col>);
                        })}
                    </Row>
                </div>

                {/* 🛠️ UPDATED: ULTRA-COMPACT SLIM REVIEW CARD */}
                <div className="mb-5 pb-4">
                    <h3 className="text-center mb-4 fw-bold text-dark" style={{fontSize: '1.8rem'}}>Traveler Stories</h3>
                    
                    {reviews.length > 0 && currentReview ? (
                        <div className="d-flex justify-content-center">
                            <Card 
                                className={`border-0 bg-white shadow rounded-pill p-3 px-4 d-flex flex-row align-items-center review-card ${reviewAnimating ? 'review-exit' : 'review-enter'}`}
                                style={{ maxWidth: '650px', width: '100%', minHeight: '100px' }}
                            >
                                {/* LEFT: User Avatar & Info */}
                                <div className="d-flex align-items-center me-4" style={{ minWidth: '140px', borderRight: '1px solid #eee', paddingRight: '15px' }}>
                                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2 shadow-sm" style={{ width: '45px', height: '45px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                        {currentReview.user.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ lineHeight: '1.2' }}>
                                        <div className="fw-bold text-dark">{currentReview.user}</div>
                                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{currentReview.location || "Traveler"}</div>
                                    </div>
                                </div>

                                {/* RIGHT: Star Rating & Review Text */}
                                <div className="flex-grow-1 text-start">
                                    <div className="text-warning mb-1" style={{ fontSize: '0.9rem' }}>
                                        {"★".repeat(currentReview.rating || 5)}
                                    </div>
                                    <p className="mb-0 text-secondary fst-italic text-truncate" style={{ maxWidth: '400px' }}>
                                        "{currentReview.text}"
                                    </p>
                                </div>
                            </Card>
                        </div>
                    ) : (
                        <Alert variant="light" className="text-center">No reviews yet.</Alert>
                    )}
                    
                    {/* Tiny Dots */}
                    <div className="d-flex justify-content-center mt-3 gap-2">
                        {reviews.map((_, idx) => (
                            <div 
                                key={idx} 
                                style={{ 
                                    width: idx === currentReviewIndex ? '20px' : '6px', 
                                    height: '6px', 
                                    borderRadius: '10px', 
                                    backgroundColor: idx === currentReviewIndex ? '#0d6efd' : '#e9ecef',
                                    transition: 'all 0.3s ease'
                                }} 
                            />
                        ))}
                    </div>
                </div>

            </Container>

            {/* Custom Styles */}
            <style>{`
                .fade-in-up { opacity: 1; transform: translateY(0); }
                .fade-out-up { opacity: 0; transform: translateY(-10px); }

                /* Modern Slim Review Animation */
                .review-card {
                    transition: all 0.5s ease-in-out;
                }
                .review-enter {
                    opacity: 1;
                    transform: translateX(0);
                }
                .review-exit {
                    opacity: 0;
                    transform: translateX(-20px);
                }
            `}</style>
        </div>
    );
};

export default Home;