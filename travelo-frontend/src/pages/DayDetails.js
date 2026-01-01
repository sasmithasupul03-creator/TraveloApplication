import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Tabs, Tab, Spinner, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const DayDetails = () => {
    const { planId, dayNum } = useParams(); 
    const navigate = useNavigate();
    
    const [dayData, setDayData] = useState(null);
    const [planTitle, setPlanTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Default Fallback Image
    const defaultHero = "https://images.unsplash.com/photo-1588258524675-55d6563e414c?ixlib=rb-4.0.3";

    useEffect(() => {
        setLoading(true);
        setError(null);

        // 1. Get Data from LocalStorage
        const savedPlans = localStorage.getItem('sitePlans');
        let parsedPlans = {};
        if (savedPlans) {
            parsedPlans = JSON.parse(savedPlans);
        }

        // 2. Define DEFAULTS (Same as PlanDetails)
        const defaultData = {
            "5-day-culture": { title: "5-Day Culture", itinerary: Array.from({length:5}, (_,i)=>({day:i+1, place:`Day ${i+1} Location`, desc:"Description...", img:""})) },
            "5-day-nature": { title: "5-Day Nature", itinerary: Array.from({length:5}, (_,i)=>({day:i+1, place:`Day ${i+1} Location`, desc:"Description...", img:""})) },
            "5-day-beach": { title: "5-Day Beach", itinerary: Array.from({length:5}, (_,i)=>({day:i+1, place:`Day ${i+1} Location`, desc:"Description...", img:""})) },
            "15-day-classic": { title: "15-Day Classic", itinerary: Array.from({length:15}, (_,i)=>({day:i+1, place:`Day ${i+1} Place`, desc:"Desc...", img:""})) },
            "15-day-adventure": { title: "15-Day Adventure", itinerary: Array.from({length:15}, (_,i)=>({day:i+1, place:`Day ${i+1} Adventure`, desc:"Active day.", img:""})) },
            "15-day-relax": { title: "15-Day Relax", itinerary: Array.from({length:15}, (_,i)=>({day:i+1, place:`Day ${i+1} Beach`, desc:"Relaxing day.", img:""})) },
            "30-day-grand": { title: "30-Day Grand", itinerary: Array.from({length:30}, (_,i)=>({day:i+1, place:`Day ${i+1} Stop`, desc:"Desc...", img:""})) },
            "30-day-slow": { title: "30-Day Slow", itinerary: Array.from({length:30}, (_,i)=>({day:i+1, place:`Day ${i+1}`, desc:"Slow travel.", img:""})) },
            "30-day-north": { title: "30-Day North", itinerary: Array.from({length:30}, (_,i)=>({day:i+1, place:`Day ${i+1}`, desc:"Exploration.", img:""})) }
        };

        // 3. Merge Data
        const mergedPlans = { ...defaultData, ...parsedPlans };
        const currentPlan = mergedPlans[planId];

        // 4. Check if Plan Exists
        if (!currentPlan) {
            setError(`Plan "${planId}" not found.`);
            setLoading(false);
            return;
        }

        setPlanTitle(currentPlan.title);

        // 5. Check if Day Exists
        const dayIndex = parseInt(dayNum) - 1;
        const foundDay = currentPlan.itinerary[dayIndex];

        if (!foundDay) {
            setError(`Day ${dayNum} not found in this plan.`);
            setLoading(false);
            return;
        }

        setDayData(foundDay);
        setLoading(false);

    }, [planId, dayNum]);

    if (loading) return <div className="d-flex justify-content-center align-items-center vh-100"><Spinner animation="border" variant="primary" /></div>;
    
    if (error) return (
        <Container className="mt-5 text-center">
            <Alert variant="danger"><h4>⚠️ Error</h4><p>{error}</p></Alert>
            <Button variant="primary" onClick={() => navigate('/')}>Go Home</Button>
        </Container>
    );

    const heroImage = (dayData.img && dayData.img.trim() !== "") ? dayData.img : defaultHero;

    // --- HELPER: Render List Items (Attractions/Hotels) ---
    const renderList = (items, type) => {
        if (!items || items.length === 0) return (
            <div className="text-center p-5 bg-white rounded-4 shadow-sm border-0">
                <h5 className="text-muted">No {type} added for this day yet.</h5>
                <p className="small text-secondary">Check back later or explore the area map!</p>
            </div>
        );
        
        return (
            <Row>
                {items.map((item, idx) => (
                    <Col md={6} lg={4} key={idx} className="mb-4">
                        <Card 
                            className="h-100 shadow border-0 hover-card rounded-4 overflow-hidden animate-fade-in"
                            style={{ cursor: 'pointer', transition: '0.3s', animationDelay: `${idx * 0.1}s` }}
                            onClick={() => navigate('/item-details', { state: { item } })}
                        >
                            <div style={{ position: 'relative', height: '220px' }}>
                                <Card.Img 
                                    src={item.img} 
                                    style={{ height: '100%', width: '100%', objectFit: 'cover' }} 
                                    onError={(e) => e.target.src="https://via.placeholder.com/400?text=No+Image"}
                                />
                                <div className="position-absolute top-0 end-0 p-3">
                                    {item.stars && <Badge bg="light" text="dark" className="shadow-sm fw-bold">⭐ {item.stars}</Badge>}
                                </div>
                            </div>
                            <Card.Body className="p-4">
                                <h5 className="fw-bold mb-1">{item.name}</h5>
                                <p className="text-muted small mb-3">{item.desc ? item.desc.substring(0, 60) + "..." : item.price}</p>
                                <div className="d-flex justify-content-between align-items-center mt-auto">
                                    <span className="text-primary fw-bold small">View Details</span>
                                    <div className="bg-light rounded-circle p-2 d-flex align-items-center justify-content-center" style={{width: '35px', height: '35px'}}>
                                        ➔
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        );
    };

    return (
        <div className="animate-page" style={{ backgroundColor: '#f8f9fa', flex: 1 }}>
            
            {/* =================================================================================
               1. IMMERSIVE HERO HEADER
            ================================================================================= */}
            <div style={{ position: 'relative', height: '60vh', minHeight: '400px', width: '100%', overflow: 'hidden' }}>
                <img 
                    src={heroImage} 
                    alt={dayData.place} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }} 
                />
                
                {/* Floating Back Button */}
                <div className="position-absolute top-0 start-0 p-4" style={{ zIndex: 20 }}>
                     <Button 
                        variant="light" 
                        onClick={() => navigate(-1)}
                        className="rounded-pill shadow-sm fw-bold px-4 py-2"
                        style={{ backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(5px)', border: 'none' }}
                     >
                        ← Back
                     </Button>
                </div>

                {/* Bottom Overlay Text */}
                <div className="position-absolute bottom-0 start-0 w-100 p-4 p-md-5" 
                     style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)' }}>
                    <Container>
                        <Badge bg="warning" text="dark" className="mb-2 px-3 py-2 rounded-pill fw-bold fs-6 animate-fade-in">
                            DAY {dayNum}
                        </Badge>
                        <h1 className="display-3 fw-bold text-white mb-2 animate-fade-in" style={{ textShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}>
                            {dayData.place}
                        </h1>
                        <p className="lead text-white-50 mb-0 animate-fade-in" style={{ maxWidth: '600px' }}>
                            {planTitle}
                        </p>
                    </Container>
                </div>
            </div>

            {/* =================================================================================
               2. CONTENT SECTION (Overlapping)
            ================================================================================= */}
            <Container style={{ marginTop: '-40px', position: 'relative', zIndex: 10, paddingBottom: '80px' }}>
                
                {/* Intro Card */}
                <Card className="border-0 shadow-lg rounded-4 p-4 mb-5 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <Row className="align-items-center">
                        <Col md={10}>
                            <h4 className="fw-bold mb-3 text-primary">About Today's Journey</h4>
                            <p className="text-muted fs-5 mb-0" style={{ lineHeight: '1.7' }}>
                                {dayData.desc || "Explore the wonders of this location. Immerse yourself in the local culture, taste the food, and enjoy the scenery."}
                            </p>
                        </Col>
                    </Row>
                </Card>

                {/* Tabs for Attractions & Hotels */}
                <Tabs defaultActiveKey="attractions" id="day-tabs" className="mb-4 custom-modern-tabs border-0 justify-content-center">
                    <Tab eventKey="attractions" title={<span className="px-3 py-2 d-block">🏛️ Attractions ({dayData.subPlaces?.length || 0})</span>}>
                        <div className="mt-4">{renderList(dayData.subPlaces, "Attractions")}</div>
                    </Tab>
                    <Tab eventKey="hotels" title={<span className="px-3 py-2 d-block">🏨 Stays ({dayData.hotels?.length || 0})</span>}>
                         <div className="mt-4">{renderList(dayData.hotels, "Hotels")}</div>
                    </Tab>
                </Tabs>

            </Container>

            {/* CSS for Custom Tabs (Optional Inline Style for this component) */}
            <style>{`
                .custom-modern-tabs .nav-link {
                    border: none;
                    color: #6c757d;
                    font-weight: 600;
                    font-size: 1.1rem;
                    background: transparent;
                    border-bottom: 3px solid transparent;
                    transition: 0.3s;
                }
                .custom-modern-tabs .nav-link.active {
                    color: #0d6efd;
                    background: transparent;
                    border-bottom: 3px solid #0d6efd;
                }
                .custom-modern-tabs .nav-link:hover {
                    color: #0d6efd;
                }
            `}</style>
        </div>
    );
};

export default DayDetails;