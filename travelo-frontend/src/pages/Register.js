import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', adminPasscode: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', formData);
            alert("Registration successful! Please login.");
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card style={{ width: '400px' }} className="p-4 shadow">
                <h2 className="text-center mb-4">Create Account</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control type="text" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Admin Passcode (Optional)</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Only for site admins"
                            onChange={(e) => setFormData({...formData, adminPasscode: e.target.value})} 
                        />
                        <Form.Text className="text-muted">Leave blank if you are a visitor.</Form.Text>
                    </Form.Group>
                    <Button variant="success" type="submit" className="w-100">Sign Up</Button>
                </Form>
                <div className="text-center mt-3">
                    Already have an account? <Link to="/login">Sign In</Link>
                </div>
            </Card>
        </Container>
    );
};

export default Register;