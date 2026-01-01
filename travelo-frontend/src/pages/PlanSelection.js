import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const PlanSelection = () => {
    const { duration } = useParams();
    const navigate = useNavigate();
    const [banners, setBanners] = useState({});

    // 1. Load the Saved Banners from LocalStorage
    useEffect(() => {
        try {
            const savedBanners = localStorage.getItem('sitePlanBanners');
            if (savedBanners) {
                setBanners(JSON.parse(savedBanners));
            }
        } catch (error) {
            console.error("Error parsing banners:", error);
        }
    }, []);

    // 2. Default Fallback Images (If admin hasn't uploaded any)
    const defaults = {
        "5": "https://images.unsplash.com/photo-1546708773-e57c6b90703f?ixlib=rb-4.0.3",
        "15": "https://images.unsplash.com/photo-1588258524675-55d6563e414c?ixlib=rb-4.0.3",
        "30": "https://images.unsplash.com/photo-1535121612729-1c422f281e69?ixlib=rb-4.0.3"
    };

    // 3. Determine which banner to use (Saved > Default)
    // The "duration" variable comes from the URL (e.g., "5", "15", "30")
    const currentBanner = banners[duration] || defaults[duration] || defaults["5"];

    const pageConfig = {
        "5": {
            title: "5-Day Quick Escapes",
            desc: "Short on time? These curated trips pack the best punch.",
            plans: [
                { id: "5-day-culture", name: "The Cultural Triangle", icon: "🏛️", color: "warning", desc: "Anuradhapura, Polonnaruwa & Sigiriya." },
                { id: "5-day-nature", name: "Hill Country & Tea", icon: "⛰️", color: "success", desc: "Kandy, Nuwara Eliya & Ella train ride." },
                { id: "5-day-beach", name: "Southern Sun", icon: "🏖️", color: "info", desc: "Galle Fort, Unawatuna & Mirissa." }
            ]
        },
        "15": {
            title: "15-Day Explorer",
            desc: "The classic loop. Experience a bit of everything.",
            plans: [
                { id: "15-day-classic", name: "Classic Island Loop", icon: "🐘", color: "primary", desc: "Culture, Hills, Safari & Beach mix." },
                { id: "15-day-adventure", name: "Adventure Seeker", icon: "🥾", color: "danger", desc: "Hiking, Rafting & Surfing." },
                { id: "15-day-relax", name: "Slow Travel", icon: "🧘", color: "secondary", desc: "Extended stays in key relaxing spots." }
            ]
        },
        "30": {
            title: "30-Day Grand Tour",
            desc: "Live like a local. The ultimate Sri Lankan odyssey.",
            plans: [
                { id: "30-day-grand", name: "All-Island Grand Tour", icon: "🎒", color: "dark", desc: "North, East, South & West." },
                { id: "30-day-slow", name: "Digital Nomad", icon: "💻", color: "success", desc: "Work-friendly stays with great views." },
                { id: "30-day-north", name: "Unseen North & East", icon: "🗺️", color: "info", desc: "Jaffna, Trinco & Pasikuda." }
            ]
        }
    };

    const config = pageConfig[duration] || pageConfig["5"];

    return (
        <div className="animate-page" style={{ backgroundColor: '#f8f9fa', flex: 1 }}>
            
            {/* HERO HEADER */}
            <div style={{ position: 'relative', height: '50vh', minHeight: '350px', overflow: 'hidden' }}>
                <img 
                    src={currentBanner} 
                    alt="Hero" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }} 
                    // This fixes the issue if a broken image was saved:
                    onError={(e) => { e.target.onerror = null; e.target.src = defaults[duration] || defaults["5"]; }}
                />
                <div className="position-absolute top-0 start-0 p-4">
                    <Button variant="light" className="rounded-pill shadow-sm fw-bold" onClick={() => navigate(-1)}>← Back</Button>
                </div>
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white text-center p-3">
                    <h1 className="display-3 fw-bold text-uppercase animate-fade-in" style={{ textShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}>
                        {config.title}
                    </h1>
                    <p className="lead fs-3 animate-fade-in" style={{ maxWidth: '700px', textShadow: '1px 1px 5px rgba(0,0,0,0.5)' }}>
                        {config.desc}
                    </p>
                </div>
            </div>

            {/* PLAN CARDS */}
            <Container style={{ marginTop: '-60px', position: 'relative', zIndex: 10, paddingBottom: '50px' }}>
                <Row className="justify-content-center">
                    {config.plans.map((plan, idx) => (
                        <Col md={4} key={plan.id} className="mb-4">
                            <Card className="h-100 border-0 shadow hover-card text-center p-4 rounded-4 animate-fade-in" 
                                  style={{ animationDelay: `${idx * 0.1}s`, cursor: 'pointer' }}
                                  onClick={() => navigate(`/plan-details/${plan.id}`)}>
                                
                                <div className={`mx-auto mb-3 bg-light rounded-circle d-flex align-items-center justify-content-center text-${plan.color}`} 
                                     style={{ width: '80px', height: '80px', fontSize: '2.5rem' }}>
                                    {plan.icon}
                                </div>
                                <h3 className="fw-bold mb-2">{plan.name}</h3>
                                <p className="text-muted mb-4">{plan.desc}</p>
                                <Button variant={`outline-${plan.color}`} className="rounded-pill px-4 fw-bold stretched-link">
                                    View Itinerary
                                </Button>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default PlanSelection;