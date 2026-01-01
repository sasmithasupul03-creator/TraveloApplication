import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
    const [footerData, setFooterData] = useState({
        about: "Your trusted partner for exploring the beautiful island of Sri Lanka. We curate the best experiences just for you.",
        email: "hello@travelsrilanka.com",
        phone: "+94 77 123 4567",
        address: "123 Galle Road, Colombo 03, Sri Lanka",
        facebook: "",
        instagram: "",
        twitter: "",
        copyright: "© 2025 Travel Sri Lanka. All rights reserved."
    });

    useEffect(() => {
        const savedData = localStorage.getItem('siteFooter');
        if (savedData) {
            setFooterData(JSON.parse(savedData));
        }
    }, []);

    return (
        <footer className="bg-dark text-white pt-5 pb-3 mt-auto">
            <Container>
                <Row>
                    {/* COLUMN 1: BRAND & ABOUT */}
                    <Col md={4} className="mb-4">
                        <h4 className="fw-bold text-warning mb-3">The Traveler</h4>
                        <p className="text-white-50 small">
                            {footerData.about}
                        </p>
                        {/* Social Icons */}
                        <div className="d-flex gap-3 mt-3">
                            {footerData.facebook && <a href={footerData.facebook} target="_blank" rel="noreferrer" className="text-white fs-5"><i className="bi bi-facebook"></i> F</a>}
                            {footerData.instagram && <a href={footerData.instagram} target="_blank" rel="noreferrer" className="text-white fs-5"><i className="bi bi-instagram"></i> I</a>}
                            {footerData.twitter && <a href={footerData.twitter} target="_blank" rel="noreferrer" className="text-white fs-5"><i className="bi bi-twitter"></i> T</a>}
                        </div>
                    </Col>

                    {/* COLUMN 2: QUICK LINKS */}
                    <Col md={4} className="mb-4">
                        <h5 className="fw-bold mb-3">Quick Links</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2"><Link to="/" className="text-white-50 text-decoration-none hover-light">Home</Link></li>
                            <li className="mb-2"><Link to="/places" className="text-white-50 text-decoration-none hover-light">Destinations</Link></li>
                            <li className="mb-2"><Link to="/hotels" className="text-white-50 text-decoration-none hover-light">Hotels</Link></li>
                            <li className="mb-2"><Link to="/mytrip" className="text-white-50 text-decoration-none hover-light">My Trip</Link></li>
                        </ul>
                    </Col>

                    {/* COLUMN 3: CONTACT INFO */}
                    <Col md={4} className="mb-4">
                        <h5 className="fw-bold mb-3">Contact Us</h5>
                        <ul className="list-unstyled text-white-50">
                            <li className="mb-2">📍 {footerData.address}</li>
                            <li className="mb-2">📧 {footerData.email}</li>
                            <li className="mb-2">📞 {footerData.phone}</li>
                        </ul>
                    </Col>
                </Row>

                <hr className="border-secondary my-4" />

                <Row>
                    <Col className="text-center text-white-50 small">
                        {footerData.copyright}
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;