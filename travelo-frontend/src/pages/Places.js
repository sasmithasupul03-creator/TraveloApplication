import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Modal, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const Places = () => {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Review Modal State
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(5);

    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    // ... (Existing Fetch Logic) ...
    const searchParams = new URLSearchParams(location.search);
    const currentCategory = searchParams.get('category');
    const categories = ["All", "Beaches", "Cultural", "Wildlife", "Hill Country", "Modern City"];

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const localPlaces = JSON.parse(localStorage.getItem('sitePlaces'));
                if (localPlaces) setPlaces(localPlaces);
                else { const response = await api.get('/places'); setPlaces(response.data); }
            } catch (error) { console.error("Error fetching places:", error); } 
            finally { setLoading(false); }
        };
        fetchPlaces();
    }, []);

    const filteredPlaces = (currentCategory && currentCategory !== "All") ? places.filter(p => p.category === currentCategory) : places;

    // --- UPDATED ADD TO TRIP ---
    const handleAddToTrip = (place) => {
        if (!user) { alert("⚠️ Please log in!"); navigate('/login'); return; }

        const userTripKey = `myTrip_${user.email}`;
        const myTrip = JSON.parse(localStorage.getItem(userTripKey) || "[]");
        
        if (myTrip.find(item => item.id === place.id && item.type !== 'hotel')) {
            alert("⚠️ Already in your trip.");
            return;
        }

        const newTrip = [...myTrip, { ...place, type: 'place', addedAt: new Date().toLocaleDateString() }];
        localStorage.setItem(userTripKey, JSON.stringify(newTrip));
        
        // --- CHECK IF 5th ITEM ADDED ---
        const placeCount = newTrip.filter(i => i.type === 'place').length;
        if (placeCount === 5) {
            setShowReviewModal(true); // <--- TRIGGER REVIEW
        } else {
            alert(`✅ Added! You have ${placeCount} places in your trip.`);
        }
    };

    // --- SUBMIT REVIEW ---
    const handleSubmitReview = () => {
        const newReview = { id: Date.now(), user: user.username, text: reviewText, rating };
        const currentReviews = JSON.parse(localStorage.getItem('siteReviews') || "[]");
        localStorage.setItem('siteReviews', JSON.stringify([newReview, ...currentReviews]));
        alert("❤️ Thanks! Your review is now on the Home Page.");
        setShowReviewModal(false);
    };

    const handleFilterClick = (cat) => { cat === "All" ? navigate('/places') : navigate(`/places?category=${cat}`); };

    if (loading) return <div className="d-flex justify-content-center align-items-center vh-100"><Spinner animation="border" variant="primary" /></div>;

    return (
        <div className="animate-page" style={{ backgroundColor: '#f8f9fa', flex: 1, paddingTop: '40px' }}>
            <Container>
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5">
                    <div>
                        <h2 className="fw-bold display-6 text-dark mb-1">{currentCategory ? `${currentCategory} Destinations` : "Explore Destinations"}</h2>
                        <p className="text-muted">Discover the best spots in Sri Lanka.</p>
                    </div>
                    <div className="d-flex flex-wrap gap-2 mt-3 mt-md-0">
                        {categories.map(cat => (<Button key={cat} variant={currentCategory === cat || (cat === "All" && !currentCategory) ? "dark" : "outline-secondary"} size="sm" className="rounded-pill px-3" onClick={() => handleFilterClick(cat)}>{cat}</Button>))}
                    </div>
                </div>

                <Row>
                    {filteredPlaces.length > 0 ? (
                        filteredPlaces.map((place, index) => (
                            <Col md={6} lg={4} key={place.id} className="mb-4">
                                <Card className="h-100 border-0 shadow-sm hover-card rounded-4 overflow-hidden animate-fade-in" style={{ cursor: 'pointer', animationDelay: `${index * 0.1}s` }} onClick={() => navigate(`/place/${place.id}/${place.name}`)}>
                                    <div style={{ position: 'relative', height: '220px' }}>
                                        <Card.Img variant="top" src={place.image} style={{ height: '100%', width: '100%', objectFit: 'cover' }} onError={(e) => e.target.src="https://via.placeholder.com/400x250?text=No+Image"} />
                                        <div className="position-absolute top-0 end-0 p-3"><Badge bg="light" text="dark" className="shadow-sm border">{place.category}</Badge></div>
                                    </div>
                                    <Card.Body className="d-flex flex-column p-4">
                                        <h5 className="fw-bold mb-1 text-dark">{place.name}</h5>
                                        <p className="text-muted small mb-3">📍 {place.location || "Sri Lanka"}</p>
                                        <Card.Text className="text-secondary small" style={{ flex: 1, lineHeight: '1.6' }}>{place.description ? place.description.substring(0, 90) + "..." : "Explore this amazing destination..."}</Card.Text>
                                        <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                            <Button variant="link" className="p-0 text-decoration-none fw-bold text-primary">View Details</Button>
                                            <Button variant="light" size="sm" className="rounded-circle shadow-sm border" style={{ width: '40px', height: '40px' }} onClick={(e) => { e.stopPropagation(); handleAddToTrip(place); }} title="Add to Trip">+</Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <div className="text-center py-5 w-100"><h4 className="text-muted">No places found.</h4></div>
                    )}
                </Row>
            </Container>

            {/* --- ⭐ REVIEW MODAL (Triggered on 5th Place) --- */}
            <Modal show={showReviewModal} centered backdrop="static">
                <Modal.Header>
                    <Modal.Title className="fw-bold text-success">Wow! You're a Pro Planner! 🎒</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <h4>You've added 5 amazing places!</h4>
                    <p className="text-muted">How are you liking our website so far?</p>
                    <div className="my-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} style={{ fontSize: '2rem', cursor: 'pointer', color: star <= rating ? '#ffc107' : '#e4e5e9' }} onClick={() => setRating(star)}>★</span>
                        ))}
                    </div>
                    <Form.Control as="textarea" rows={3} placeholder="Share your feedback..." value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowReviewModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleSubmitReview}>Post Review</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Places;