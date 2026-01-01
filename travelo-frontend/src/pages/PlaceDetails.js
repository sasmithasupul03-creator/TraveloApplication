import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Form, ListGroup, Carousel } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const PlaceDetails = () => {
    const { planId, placeName } = useParams(); 
    const navigate = useNavigate();
    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);

    // Reviews State
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ user: "Guest", rating: 5, text: "" });

    useEffect(() => {
        const fetchPlaceDetails = async () => {
            // 1. Try finding in LocalStorage first
            const localPlaces = JSON.parse(localStorage.getItem('sitePlaces') || "[]");
            let foundPlace = localPlaces.find(p => p.id.toString() === planId || p.name === placeName);

            if (!foundPlace) {
                // 2. Try API if not local
                try {
                    const res = await api.get(`/places/${planId}`);
                    foundPlace = res.data;
                } catch (err) {
                    console.error("Place not found");
                }
            }
            setPlace(foundPlace);
            setLoading(false);
        };
        fetchPlaceDetails();
    }, [planId, placeName]);

    // --- 🛠️ FIX: ADD TO SPECIFIC USER'S TRIP ---
    const handleAddToTrip = () => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            alert("⚠️ Please log in to add items to your trip!");
            navigate('/login');
            return;
        }

        const userTripKey = `myTrip_${user.email}`; // Unique key per user
        const myTrip = JSON.parse(localStorage.getItem(userTripKey) || "[]");

        // Check if already added
        const exists = myTrip.find(item => item.id === place.id && item.type !== 'hotel');
        if (exists) {
            alert("⚠️ This place is already in your trip list.");
            return;
        }

        // Add to list
        myTrip.push({ ...place, type: 'place', addedAt: new Date().toLocaleDateString() });
        localStorage.setItem(userTripKey, JSON.stringify(myTrip));
        
        alert(`✅ ${place.name} successfully added to your My Trip list!`);
    };

    // Handle Review Submit
    const handleAddReview = (e) => {
        e.preventDefault();
        const review = { ...newReview, id: Date.now(), date: new Date().toLocaleDateString() };
        setReviews([...reviews, review]);
        setNewReview({ user: "Guest", rating: 5, text: "" });
    };

    if (loading) return <div className="d-flex justify-content-center align-items-center vh-100"><Spinner animation="border" /></div>;
    if (!place) return <div className="text-center mt-5"><h3>Place Not Found</h3><Button onClick={()=>navigate(-1)}>Go Back</Button></div>;

    const images = [place.image, place.image2, place.image3].filter(img => img);

    return (
        <div className="animate-page" style={{ backgroundColor: '#f8f9fa', flex: 1 }}>
            
            {/* HERO SECTION */}
            <div style={{ position: 'relative', height: '60vh', minHeight: '400px', width: '100%', overflow: 'hidden' }}>
                {images.length > 1 ? (
                    <Carousel fade interval={3000} controls={false} indicators={false} pause={false} className="h-100">
                        {images.map((img, idx) => (
                            <Carousel.Item key={idx} className="h-100">
                                <img src={img} className="d-block w-100 h-100" style={{ objectFit: 'cover', filter: 'brightness(0.6)' }} alt="Hero" />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                ) : (
                    <img src={place.image} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }} alt="Hero" />
                )}
                
                <div style={{ position: 'absolute', top: 30, left: 30, zIndex: 10 }}>
                    <Button variant="light" className="rounded-pill shadow-sm fw-bold px-4" onClick={() => navigate(-1)}>← Back</Button>
                </div>

                <div className="position-absolute bottom-0 start-0 p-5 text-white w-100" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                    <Badge bg="warning" text="dark" className="mb-2 px-3 py-2 rounded-pill fs-6">{place.category}</Badge>
                    <h1 className="display-3 fw-bold">{place.name}</h1>
                    <p className="fs-4 opacity-75">📍 {place.location}</p>
                </div>
            </div>

            {/* CONTENT */}
            <Container style={{ marginTop: '-60px', position: 'relative', zIndex: 10, paddingBottom: '50px' }}>
                <Row>
                    <Col md={8}>
                        <Card className="border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                            <h3 className="fw-bold mb-3">About this destination</h3>
                            <p className="text-muted fs-5" style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                                {place.description || "No description available for this place."}
                            </p>
                        </Card>

                        <Card className="border-0 shadow-sm rounded-4 p-4 bg-white">
                            <h4 className="fw-bold mb-4">⭐ Reviews & Experiences</h4>
                            {reviews.length > 0 ? (
                                <ListGroup variant="flush" className="mb-4">
                                    {reviews.map((r) => (
                                        <ListGroup.Item key={r.id} className="border-0 bg-light mb-3 rounded-3 p-3">
                                            <div className="d-flex justify-content-between">
                                                <strong>{r.user}</strong>
                                                <span className="text-warning">{"★".repeat(r.rating)}</span>
                                            </div>
                                            <p className="mb-1 mt-1">{r.text}</p>
                                            <small className="text-muted">{r.date}</small>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <p className="text-muted mb-4">No reviews yet. Be the first to share your experience!</p>
                            )}

                            <div className="bg-light p-4 rounded-4">
                                <h5 className="mb-3">Write a Review</h5>
                                <Form onSubmit={handleAddReview}>
                                    <Row>
                                        <Col md={6}><Form.Group className="mb-3"><Form.Control placeholder="Your Name" value={newReview.user} onChange={(e) => setNewReview({...newReview, user: e.target.value})} /></Form.Group></Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Select value={newReview.rating} onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}>
                                                    <option value="5">5 - Excellent</option><option value="4">4 - Good</option><option value="3">3 - Average</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Form.Group className="mb-3"><Form.Control as="textarea" rows={3} placeholder="Share your thoughts..." value={newReview.text} onChange={(e) => setNewReview({...newReview, text: e.target.value})} required /></Form.Group>
                                    <Button variant="primary" type="submit" className="rounded-pill px-4 fw-bold">Post Review</Button>
                                </Form>
                            </div>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card className="border-0 shadow-lg rounded-4 p-4 sticky-top bg-white" style={{ top: '100px' }}>
                            <h4 className="fw-bold mb-2">Plan your trip</h4>
                            <p className="text-muted small mb-4">Interested in visiting {place.name}? Add it to your customized itinerary list.</p>
                            
                            <Button variant="success" size="lg" className="w-100 rounded-pill fw-bold text-white mb-3" onClick={handleAddToTrip}>
                                + Add to Trip
                            </Button>
                            
                            <hr className="my-4 opacity-25" />
                            <div className="d-flex align-items-center justify-content-center text-muted small">
                                <span className="me-2">🛡️</span> Verified Destination
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default PlaceDetails;