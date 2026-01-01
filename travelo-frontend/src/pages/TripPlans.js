import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const TripPlans = () => {
    const navigate = useNavigate();
    const PLAN_ICONS = ["⚡", "🌿", "🎒"];

    const [plans, setPlans] = useState([
        // FIXED LINKS: All point to /plan-selection/{number}
        { id: 1, duration: "5 Days", title: "Short & Sweet", desc: "Choose from Culture, Nature, or Beach.", link: "/plan-selection/5", icon: "⚡" },
        { id: 2, duration: "15 Days", title: "The Island Loop", desc: "Classic, Adventure, or Relaxing options.", link: "/plan-selection/15", icon: "🌿" },
        { id: 3, duration: "30 Days", title: "The Grand Tour", desc: "Grand Tour, Slow Travel, or Northern Focus.", link: "/plan-selection/30", icon: "🎒" }
    ]);

    // Load saved text from Admin (only updates text, keeps links correct)
    useEffect(() => {
        const savedDurations = localStorage.getItem('siteDurations');
        if (savedDurations) {
            const saved = JSON.parse(savedDurations);
            const merged = saved.map((p, i) => ({
                ...p,
                link: `/plan-selection/${i === 0 ? 5 : i === 1 ? 15 : 30}`,
                icon: PLAN_ICONS[i]
            }));
            setPlans(merged);
        }
        // eslint-disable-next-line
    }, []);

    return (
        <Container className="mt-5 mb-5">
            <div className="text-center mb-5">
                <h1 className="fw-bold text-primary">Select Your Journey</h1>
                <p className="lead text-muted">How much time do you have to explore paradise?</p>
            </div>

            <Row className="justify-content-center">
                {plans.map((plan, index) => (
                    <Col md={4} key={index} className="mb-4">
                        <Card 
                            className="h-100 text-center p-4 shadow-sm hover-card border-0 rounded-4"
                            style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                            onClick={() => navigate(plan.link)}
                        >
                            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                                <div className="display-1 mb-3">{plan.icon || "✈️"}</div>
                                <h2 className="fw-bold text-dark">{plan.duration}</h2>
                                <h5 className="text-primary mb-3">{plan.title}</h5>
                                <Card.Text className="text-muted">{plan.desc}</Card.Text>
                                <Button variant="outline-primary" className="mt-3 rounded-pill px-4 fw-bold">View 3 Options →</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default TripPlans;