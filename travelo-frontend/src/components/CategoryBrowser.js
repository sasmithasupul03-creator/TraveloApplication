import React from 'react';
import { Card, Button, Row, Col, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const categories = [
    {
        id: 1,
        title: 'Beaches',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000', // Replace with your image URL
        btnText: 'Explore Beaches'
    },
    {
        id: 2,
        title: 'Hill Country',
        image: 'https://images.unsplash.com/photo-1588663806655-e461b2a95c47?q=80&w=1000', // Replace with your image URL
        btnText: 'Explore Hill Country'
    },
    {
        id: 3,
        title: 'Cultural',
        image: 'https://images.unsplash.com/photo-1625757973713-1466037dfc88?q=80&w=1000', // Replace with your image URL
        btnText: 'Explore Cultural'
    },
    {
        id: 4,
        title: 'Wildlife',
        image: 'https://images.unsplash.com/photo-1535940369971-7c3d60301181?q=80&w=1000', // Replace with your image URL
        btnText: 'Explore Wildlife'
    },
    {
        id: 5,
        title: 'Modern City',
        image: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?q=80&w=1000', // Replace with your image URL
        btnText: 'Explore Modern City'
    }
];

const CategoryBrowser = () => {
    const navigate = useNavigate();

    const handleExploreClick = (categoryTitle) => {
        // Navigate to the Places page with the selected category filter
        navigate(`/places?category=${categoryTitle}`);
    };

    return (
        <Container>
            <h2 className="mb-4 my-4">📂 Browse by Category</h2>
            <Row>
                {categories.map((category) => (
                    <Col key={category.id} md={4} className="mb-4">
                        <Card className="h-100 shadow-sm border-0 hover-effect text-center">
                            <div style={{ height: '200px', overflow: 'hidden' }}>
                                <Card.Img
                                    variant="top"
                                    src={category.image}
                                    alt={category.title}
                                    style={{ height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <Card.Body className="d-flex flex-column align-items-center">
                                <Card.Title className="fw-bold">{category.title}</Card.Title>
                                <Button
                                    variant="outline-primary"
                                    className="mt-3"
                                    onClick={() => handleExploreClick(category.title)}
                                >
                                    {category.btnText}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default CategoryBrowser;