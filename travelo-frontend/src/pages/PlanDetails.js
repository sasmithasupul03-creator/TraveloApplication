import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Carousel } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const PlanDetails = () => {
    const navigate = useNavigate();
    const { planId } = useParams();
    const [selectedPlan, setSelectedPlan] = useState(null);

    // Default Hero if specific plan image is missing
    const defaultHeroImage = "https://images.unsplash.com/photo-1588258524675-55d6563e414c?ixlib=rb-4.0.3";

    useEffect(() => {
        const savedPlans = localStorage.getItem('sitePlans');
        let parsedPlans = {};
        if (savedPlans) parsedPlans = JSON.parse(savedPlans);

        const defaultData = {
            "5-day-culture": { 
                title: "5-Day Cultural Triangle", 
                intro: "Immerse yourself in 2,500 years of history. Visit ancient kingdoms, sacred temples, and the legendary Sigiriya Rock Fortress.", 
                googleMapLink: "#", 
                itinerary: [
                    { day: 1, place: "Anuradhapura", desc: "Explore the first ancient capital.", img: "https://images.unsplash.com/photo-1588258524675-55d6563e414c?ixlib=rb-4.0.3" },
                    { day: 2, place: "Polonnaruwa", desc: "Cycle through the ruins of the second kingdom.", img: "https://images.unsplash.com/photo-1625736300986-7956ea76ec86?ixlib=rb-4.0.3" },
                    { day: 3, place: "Sigiriya", desc: "Climb the Lion Rock fortress.", img: "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?ixlib=rb-4.0.3" },
                    { day: 4, place: "Dambulla & Kandy", desc: "Visit the Golden Cave Temple.", img: "https://images.unsplash.com/photo-1580887137882-7360e2ce327e?ixlib=rb-4.0.3" },
                    { day: 5, place: "Colombo", desc: "End your journey with a city tour.", img: "https://images.unsplash.com/photo-1548057997-7c7333c5092a?ixlib=rb-4.0.3" }
                ]
            },
            "15-day-classic": { title: "15-Day Island Loop", intro: "The perfect two-week journey.", googleMapLink: "#", itinerary: Array.from({length:15}, (_,i)=>({ day: i+1, place: `Day ${i+1}`, desc: "Explore...", img: `https://source.unsplash.com/800x600/?srilanka,travel,${i}` })) },
            "30-day-grand": { title: "30-Day Grand Tour", intro: "The ultimate adventure.", googleMapLink: "#", itinerary: Array.from({length:30}, (_,i)=>({ day: i+1, place: `Day ${i+1}`, desc: "Discover...", img: `https://source.unsplash.com/800x600/?srilanka,nature,${i}` })) }
        };

        // If plan is not in defaults, create empty structure
        if (!defaultData[planId]) defaultData[planId] = { title: "Custom Plan", intro: "Your journey.", itinerary: [] };

        const mergedPlans = { ...defaultData, ...parsedPlans };
        setSelectedPlan(mergedPlans[planId]);

    }, [planId]);

    if (!selectedPlan) return <div className="d-flex justify-content-center align-items-center vh-100"><Spinner animation="border" variant="primary" /></div>;

    // --- 🛠️ FIX: USE UPLOADED COVER IMAGE IF AVAILABLE ---
    const firstValidImage = selectedPlan.itinerary.find(item => item.img);
    const heroBanner = selectedPlan.coverImg || (firstValidImage ? firstValidImage.img : defaultHeroImage);

    return (
        <div className="animate-page" style={{ backgroundColor: '#f8f9fa', flex: 1 }}>
            
            {/* 1. HERO HEADER */}
            <div style={{ position: 'relative', height: '60vh', minHeight: '400px', overflow: 'hidden' }}>
                <img 
                    src={heroBanner} 
                    alt="Plan Banner" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }} 
                />
                 <div className="position-absolute top-0 start-0 p-4" style={{ zIndex: 20 }}>
                    <Button variant="light" onClick={() => navigate(-1)} className="rounded-pill px-4 py-2 fw-bold shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(5px)', border: 'none' }}>
                        ← Back
                    </Button>
                </div>
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white text-center p-3" style={{ zIndex: 10 }}>
                    <h1 className="display-3 fw-bold text-uppercase animate-fade-in" style={{ letterSpacing: '3px' }}>{selectedPlan.title}</h1>
                    <div style={{ width: '100px', height: '4px', background: '#ffc107', margin: '20px auto' }}></div>
                    <p className="lead fs-4 animate-fade-in" style={{ maxWidth: '800px' }}>{selectedPlan.intro}</p>
                </div>
            </div>

            {/* 2. ZIG-ZAG ITINERARY LIST */}
            <Container style={{ marginTop: '-80px', position: 'relative', zIndex: 20, paddingBottom: '50px' }}>
                {selectedPlan.itinerary.map((stop, index) => {
                    const dayImages = [stop.img, stop.img2, stop.img3].filter(u => u);
                    const displayImage = dayImages.length > 0 ? dayImages : ["https://via.placeholder.com/800x400?text=No+Image"];
                    const isEven = index % 2 === 0;

                    return (
                        <Row key={index} className="mb-5 align-items-center justify-content-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                            <Col md={6} className={`mb-4 mb-md-0 ${isEven ? 'order-md-1' : 'order-md-2'}`}>
                                <Card className="border-0 shadow-lg rounded-4 overflow-hidden hover-card h-100" onClick={() => navigate(`/plan-day/${planId}/${stop.day}`)} style={{ cursor: 'pointer' }}>
                                    <div style={{ height: '350px' }}>
                                        {displayImage.length > 1 ? (
                                            <Carousel fade interval={3000} controls={false} indicators={false} className="h-100">
                                                {displayImage.map((u, i) => (
                                                    <Carousel.Item key={i} className="h-100">
                                                        <img src={u} className="d-block w-100 h-100" style={{ objectFit: 'cover' }} alt={`day-${index}`} />
                                                    </Carousel.Item>
                                                ))}
                                            </Carousel>
                                        ) : (
                                            <img src={displayImage[0]} className="d-block w-100 h-100" style={{ objectFit: 'cover' }} alt={stop.place} />
                                        )}
                                    </div>
                                </Card>
                            </Col>
                            <Col md={6} className={`px-4 ${isEven ? 'order-md-2' : 'order-md-1 text-md-end'}`}>
                                <div className="p-2">
                                    <Badge bg="primary" className="mb-2 px-3 py-2 rounded-pill">Day {stop.day}</Badge>
                                    <h2 className="fw-bold display-6 mb-3">{stop.place}</h2>
                                    
                                    {/* ❌ DESCRIPTION REMOVED AS REQUESTED */}
                                    {/* <p className="text-muted fs-5 mb-4">{stop.desc}</p> */}

                                    <Button variant={isEven ? "outline-primary" : "outline-dark"} className="rounded-pill px-4 fw-bold" onClick={() => navigate(`/plan-day/${planId}/${stop.day}`)}>Explore Day {stop.day} →</Button>
                                </div>
                            </Col>
                        </Row>
                    );
                })}

                {/* 3. GOOGLE MAP CTA */}
                <div className="text-center mt-5 pt-4">
                    <Card className="p-5 border-0 shadow rounded-5 text-white" style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)' }}>
                        <h2 className="fw-bold">Ready to start the adventure?</h2>
                        <p className="lead opacity-75 mb-4">Open the full itinerary on Google Maps and hit the road.</p>
                        <a href={selectedPlan.googleMapLink || "#"} target="_blank" rel="noopener noreferrer" className="btn btn-light btn-lg px-5 rounded-pill fw-bold text-primary shadow">📍 Open Map</a>
                    </Card>
                </div>
            </Container>
        </div>
    );
};

export default PlanDetails;