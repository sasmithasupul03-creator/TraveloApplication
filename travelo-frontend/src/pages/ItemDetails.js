import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, ListGroup, Modal, Spinner, Alert, InputGroup } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

const ItemDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Get the item data passed from the previous page
    const item = location.state?.item;
    
    // Reviews State
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ user: "Guest", rating: 5, text: "" });

    // --- PAYMENT MODAL STATE ---
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // 1. Load Reviews specific to this item
    useEffect(() => {
        if (!item) return;
        const allReviews = JSON.parse(localStorage.getItem('subItemReviews') || "[]");
        const itemReviews = allReviews.filter(r => r.itemId === item.id);
        setReviews(itemReviews);
    }, [item]);

    // 2. Handle Adding a Review
    const handleAddReview = (e) => {
        e.preventDefault();
        const reviewObject = {
            id: Date.now(),
            itemId: item.id,
            user: newReview.user,
            rating: newReview.rating,
            text: newReview.text,
            date: new Date().toLocaleDateString()
        };
        const allReviews = JSON.parse(localStorage.getItem('subItemReviews') || "[]");
        const updatedReviews = [...allReviews, reviewObject];
        localStorage.setItem('subItemReviews', JSON.stringify(updatedReviews));
        setReviews([...reviews, reviewObject]);
        setNewReview({ user: "Guest", rating: 5, text: "" });
        alert("✅ Review Added!");
    };

    // 3. Handle Payment Submission
    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setPaymentSuccess(true);
            setTimeout(() => {
                setShowPaymentModal(false);
                setPaymentSuccess(false);
                alert(`🎉 Booking Confirmed for ${item.name}!`);
            }, 3000);
        }, 2000);
    };

    if (!item) return <Container className="mt-5"><h3 className="text-danger">Item not found.</h3><Button onClick={() => navigate(-1)}>Go Back</Button></Container>;

    return (
        <div className="animate-page" style={{ backgroundColor: '#f8f9fa', flex: 1 }}>
            
            {/* 1. HERO IMAGE SECTION */}
            <div style={{ position: 'relative', height: '50vh', minHeight: '400px', width: '100%', overflow: 'hidden' }}>
                <img 
                    src={item.img} 
                    alt={item.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    onError={(e) => e.target.src="https://via.placeholder.com/800?text=No+Image"}
                />
                <div style={{ position: 'absolute', top: 20, left: 20 }}>
                    <Button variant="light" className="rounded-pill shadow-sm fw-bold" onClick={() => navigate(-1)}>← Back</Button>
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}></div>
                
                <div className="position-absolute bottom-0 start-0 p-4 p-md-5 text-white">
                    {item.stars && <Badge bg="warning" text="dark" className="mb-2 fs-6">⭐ {item.stars} Stars</Badge>}
                    <h1 className="display-4 fw-bold">{item.name}</h1>
                    <p className="fs-4">{item.price || "Free Entry"}</p>
                </div>
            </div>

            <Container style={{ marginTop: '-50px', position: 'relative', zIndex: 10, paddingBottom: '50px' }}>
                <Row>
                    {/* LEFT: Info & Reviews */}
                    <Col md={8}>
                        <Card className="border-0 shadow-sm rounded-4 p-4 mb-4">
                            <h3 className="fw-bold mb-3">About this place</h3>
                            <p className="text-muted fs-5" style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                                {item.story ? item.story : (item.desc || "No description available.")}
                            </p>
                        </Card>

                        {/* REVIEWS SECTION */}
                        <Card className="shadow-sm border-0 p-4 bg-white rounded-4">
                            <h3 className="mb-4">⭐ Reviews ({reviews.length})</h3>
                            <div className="mb-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {reviews.length === 0 ? <p className="text-muted">No reviews yet.</p> : (
                                    <ListGroup variant="flush">
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
                                )}
                            </div>
                            <hr />
                            <h5>Write a Review</h5>
                            <Form onSubmit={handleAddReview}>
                                <Row>
                                    <Col md={6}><Form.Group className="mb-2"><Form.Label>Name</Form.Label><Form.Control value={newReview.user} onChange={(e) => setNewReview({...newReview, user: e.target.value})} /></Form.Group></Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-2"><Form.Label>Rating</Form.Label>
                                            <Form.Select value={newReview.rating} onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}>
                                                <option value="5">5 - Excellent</option><option value="4">4 - Good</option><option value="3">3 - Average</option><option value="2">2 - Poor</option><option value="1">1 - Terrible</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3"><Form.Label>Review</Form.Label><Form.Control as="textarea" rows={3} value={newReview.text} onChange={(e) => setNewReview({...newReview, text: e.target.value})} required /></Form.Group>
                                <Button variant="primary" type="submit">Submit Review</Button>
                            </Form>
                        </Card>
                    </Col>

                    {/* RIGHT: Booking Card (Only show if there is a price) */}
                    {item.price && !item.price.toLowerCase().includes("free") && (
                        <Col md={4}>
                            <Card className="border-0 shadow-lg rounded-4 p-4 sticky-top" style={{ top: '100px' }}>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div><span className="text-success fw-bold display-6">{item.price}</span></div>
                                </div>
                                <div className="d-grid gap-2">
                                    {/* BOOK BUTTON OPENS MODAL */}
                                    <Button variant="primary" size="lg" className="rounded-pill fw-bold" onClick={() => setShowPaymentModal(true)}>Book Now</Button>
                                </div>
                                <hr className="my-4" />
                                <small className="text-center text-muted d-block">Secure booking via TravelO.</small>
                            </Card>
                        </Col>
                    )}
                </Row>
            </Container>

            {/* === PAYMENT MODAL === */}
            <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered backdrop="static">
                <Modal.Header closeButton><Modal.Title>🔒 Secure Payment</Modal.Title></Modal.Header>
                <Modal.Body>
                    {paymentSuccess ? (
                        <div className="text-center py-5">
                            <div className="mb-3 text-success" style={{ fontSize: '4rem' }}>✅</div>
                            <h3 className="fw-bold text-success">Payment Successful!</h3>
                            <p className="text-muted">Your booking for <strong>{item.name}</strong> is confirmed.</p>
                            <Spinner animation="border" size="sm" /> <small>Closing...</small>
                        </div>
                    ) : (
                        <Form onSubmit={handlePaymentSubmit}>
                            <Alert variant="primary" className="d-flex justify-content-between align-items-center">
                                <span>Total to Pay:</span><span className="fw-bold fs-5">{item.price}</span>
                            </Alert>
                            <Form.Group className="mb-3"><Form.Label>Cardholder Name</Form.Label><Form.Control required type="text" placeholder="John Doe" /></Form.Group>
                            <Form.Group className="mb-3"><Form.Label>Card Number</Form.Label><InputGroup><InputGroup.Text>💳</InputGroup.Text><Form.Control required type="text" placeholder="0000 0000 0000 0000" maxLength="19" /></InputGroup></Form.Group>
                            <Row>
                                <Col><Form.Group className="mb-3"><Form.Label>Expiry</Form.Label><Form.Control required type="text" placeholder="MM/YY" maxLength="5" /></Form.Group></Col>
                                <Col><Form.Group className="mb-3"><Form.Label>CVV</Form.Label><Form.Control required type="password" placeholder="123" maxLength="3" /></Form.Group></Col>
                            </Row>
                            <div className="d-grid mt-3">
                                <Button variant="success" type="submit" size="lg" disabled={isProcessing}>
                                    {isProcessing ? <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />Processing...</> : `Pay ${item.price} Now`}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>

        </div>
    );
};

export default ItemDetails;