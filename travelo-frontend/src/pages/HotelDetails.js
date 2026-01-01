import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

const HotelDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    
    // --- STATE ---
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false); // New Review Modal
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    
    // Review State
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(5);

    // Booking Dates State
    const [dates, setDates] = useState({ checkIn: "", checkOut: "" });

    const hotel = location.state?.hotel;

    if (!hotel) return <div className="text-center mt-5"><h3>Hotel not found.</h3><Button onClick={() => navigate('/hotels')}>Back</Button></div>;

    const description = hotel.description || `Experience world-class service at ${hotel.name}. Situated in the heart of ${hotel.location}.`;
    const amenities = (hotel.amenities && hotel.amenities.length > 0) ? hotel.amenities : ["Free WiFi", "Swimming Pool", "Spa", "Airport Shuttle"];

    // --- 1. HANDLE BOOKING ---
    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        
        if (!user) {
            alert("⚠️ Please login to book a hotel.");
            navigate('/login');
            return;
        }

        setIsProcessing(true);

        setTimeout(() => {
            setIsProcessing(false);
            setPaymentSuccess(true);
            
            // Save Booking
            const userTripKey = `myTrip_${user.email}`;
            const currentTrip = JSON.parse(localStorage.getItem(userTripKey) || "[]");
            const newBooking = { ...hotel, type: 'hotel', bookingId: Date.now(), checkIn: dates.checkIn, checkOut: dates.checkOut, status: 'Confirmed ✅' };
            localStorage.setItem(userTripKey, JSON.stringify([...currentTrip, newBooking]));

            // --- TRIGGER REVIEW MODAL AFTER SUCCESS ---
            setTimeout(() => {
                setShowPaymentModal(false);
                setPaymentSuccess(false);
                setShowReviewModal(true); // <--- OPEN REVIEW MODAL
            }, 2000);
        }, 2000);
    };

    // --- 2. HANDLE REVIEW SUBMISSION ---
    const handleSubmitReview = () => {
        const newReview = {
            id: Date.now(),
            user: user.username || "Traveler",
            text: reviewText,
            rating: rating
        };

        // Save to Site Reviews (For Home Page)
        const currentReviews = JSON.parse(localStorage.getItem('siteReviews') || "[]");
        localStorage.setItem('siteReviews', JSON.stringify([newReview, ...currentReviews]));

        alert("❤️ Thank you for your review! It will now appear on our Home Page.");
        setShowReviewModal(false);
        navigate('/mytrip');
    };

    const handleSkipReview = () => {
        navigate('/mytrip');
    };

    return (
        <div className="animate-page" style={{ backgroundColor: '#f8f9fa', flex: 1 }}>
            
            <div style={{ position: 'relative', height: '60vh', minHeight: '400px', overflow: 'hidden' }}>
                <img src={hotel.img} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 20, left: 20 }}>
                    <Button variant="light" className="rounded-pill fw-bold" onClick={() => navigate(-1)}>← Back</Button>
                </div>
                <div className="position-absolute bottom-0 start-0 p-5 text-white w-100" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                    <Badge bg="warning" text="dark" className="mb-2">⭐ {hotel.rating} Star Hotel</Badge>
                    <h1 className="display-4 fw-bold">{hotel.name}</h1>
                    <p className="fs-4">📍 {hotel.location}</p>
                </div>
            </div>

            <Container style={{ marginTop: '-50px', position: 'relative', zIndex: 10, paddingBottom: '50px' }}>
                <Row>
                    <Col md={8}>
                        <Card className="border-0 shadow-sm rounded-4 p-4 mb-4">
                            <h3 className="fw-bold mb-3">About this stay</h3>
                            <p className="text-muted fs-5">{description}</p>
                            <h5 className="fw-bold mt-4">Amenities</h5>
                            <Row>{amenities.map((a, i) => <Col xs={6} md={4} key={i} className="mb-2 text-secondary">✔ {a}</Col>)}</Row>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card className="border-0 shadow-lg rounded-4 p-4 sticky-top" style={{ top: '100px' }}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-success fw-bold display-6">{hotel.price}</span>
                            </div>
                            <Form>
                                <Form.Group className="mb-2"><Form.Label>Check-in</Form.Label><Form.Control type="date" value={dates.checkIn} onChange={(e) => setDates({...dates, checkIn: e.target.value})} /></Form.Group>
                                <Form.Group className="mb-3"><Form.Label>Check-out</Form.Label><Form.Control type="date" value={dates.checkOut} onChange={(e) => setDates({...dates, checkOut: e.target.value})} /></Form.Group>
                                <Button variant="primary" size="lg" className="w-100 rounded-pill fw-bold" onClick={() => { if(!dates.checkIn || !dates.checkOut) alert("Please select dates!"); else setShowPaymentModal(true); }}>Book Now</Button>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* PAYMENT MODAL */}
            <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered backdrop="static">
                <Modal.Header closeButton><Modal.Title>🔒 Secure Payment</Modal.Title></Modal.Header>
                <Modal.Body>
                    {paymentSuccess ? (
                        <div className="text-center py-5">
                            <div className="mb-3 text-success" style={{ fontSize: '4rem' }}>✅</div>
                            <h3 className="fw-bold text-success">Booking Confirmed!</h3>
                            <Spinner animation="border" size="sm" /> <small>Processing...</small>
                        </div>
                    ) : (
                        <Form onSubmit={handlePaymentSubmit}>
                            <Alert variant="primary">Total to Pay: <strong>{hotel.price}</strong></Alert>
                            <Form.Group className="mb-3"><Form.Control required placeholder="Card Name" /></Form.Group>
                            <Form.Group className="mb-3"><Form.Control required placeholder="Card Number" maxLength="19" /></Form.Group>
                            <Row><Col><Form.Control required placeholder="MM/YY" maxLength="5" /></Col><Col><Form.Control required placeholder="CVV" type="password" maxLength="3" /></Col></Row>
                            <Button variant="success" type="submit" size="lg" className="w-100 mt-4" disabled={isProcessing}>{isProcessing ? "Processing..." : `Pay & Book`}</Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>

            {/* --- ⭐ REVIEW WEBSITE MODAL --- */}
            <Modal show={showReviewModal} centered backdrop="static">
                <Modal.Header>
                    <Modal.Title className="fw-bold text-primary">🎉 Booking Successful!</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <h4>How was your experience using TravelO?</h4>
                    <p className="text-muted">Your review helps other travelers and will be featured on our Home Page!</p>
                    
                    <div className="my-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} style={{ fontSize: '2rem', cursor: 'pointer', color: star <= rating ? '#ffc107' : '#e4e5e9' }} onClick={() => setRating(star)}>★</span>
                        ))}
                    </div>

                    <Form.Group>
                        <Form.Control as="textarea" rows={3} placeholder="Write a short review..." value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleSkipReview}>Maybe Later</Button>
                    <Button variant="primary" onClick={handleSubmitReview}>Submit Review</Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default HotelDetails;