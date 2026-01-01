import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const AddPlace = () => {
    const navigate = useNavigate();
    const [place, setPlace] = useState({
        name: '',
        description: '',
        location: '',
        category: '',
        images: ''
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setPlace({ ...place, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/places', place);
            alert("Place added successfully!");
            navigate('/places'); // Go back to the list after adding
        } catch (err) {
            console.error(err);
            setError("Failed to add place. Check your backend console.");
        }
    };

    return (
        <Container className="mt-4">
            <h2>Add a New Destination</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Place Name</Form.Label>
                    <Form.Control 
                        type="text" name="name" placeholder="e.g. Grand Hotel" 
                        value={place.name} onChange={handleChange} required 
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control 
                        type="text" name="location" placeholder="e.g. Paris, France" 
                        value={place.location} onChange={handleChange} 
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Control 
                        type="text" name="category" placeholder="e.g. Hotel, Beach, Mountain" 
                        value={place.category} onChange={handleChange} 
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control 
                        type="text" name="images" placeholder="Paste an image link here" 
                        value={place.images} onChange={handleChange} 
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control 
                        as="textarea" rows={3} name="description" 
                        value={place.description} onChange={handleChange} 
                    />
                </Form.Group>

                <Button variant="success" type="submit">
                    Add Place
                </Button>
            </Form>
        </Container>
    );
};

export default AddPlace;