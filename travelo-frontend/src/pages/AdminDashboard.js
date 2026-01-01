import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Tab, Nav, ListGroup, Accordion, Modal, Badge, Table } from 'react-bootstrap';

const AdminDashboard = () => {
    // --- STATE MANAGEMENT ---
    const [notifications, setNotifications] = useState([]);
    const [newNotify, setNewNotify] = useState("");
    const [intro, setIntro] = useState({ title: "", desc: "", images: [] });
    const [newIntroUrl, setNewIntroUrl] = useState(""); 
    
    // Default Banners (Using URLs to save space)
    const [planBanners, setPlanBanners] = useState({
        "5": "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?ixlib=rb-4.0.3&q=90&fm=jpg&crop=entropy&cs=srgb&w=1200",
        "15": "https://images.unsplash.com/photo-1588258524675-55d6563e414c?ixlib=rb-4.0.3",
        "30": "https://images.unsplash.com/photo-1535121612729-1c422f281e69?ixlib=rb-4.0.3"
    });

    const [reviews, setReviews] = useState([]);
    const [footerData, setFooterData] = useState({ about: "", email: "", phone: "", address: "", facebook: "", instagram: "", twitter: "", copyright: "" });
    const [travelPlans, setTravelPlans] = useState({});
    
    // View & Editing States
    const [viewMode, setViewMode] = useState('MAIN'); 
    const [selectedDuration, setSelectedDuration] = useState(null); 
    const [editingPlanId, setEditingPlanId] = useState(null); 
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [currentDayIndex, setCurrentDayIndex] = useState(null);
    const [detailTab, setDetailTab] = useState("attractions");
    
    // Form Inputs
    const [newItem, setNewItem] = useState({ name: "", desc: "", price: "", stars: 5, img: "", story: "" });
    const [places, setPlaces] = useState([]);
    const [showPlaceModal, setShowPlaceModal] = useState(false);
    const [currentPlace, setCurrentPlace] = useState({ id: null, name: '', category: 'Beaches', location: '', description: '', image: '', image2: '', image3: '' });
    const [hotels, setHotels] = useState([]);
    const [showHotelModal, setShowHotelModal] = useState(false);
    const [currentHotel, setCurrentHotel] = useState({ id: null, category: "Luxury Resorts 💎", name: "", location: "", price: "", rating: 5, img: "", description: "", amenities: [] });
    
    const amenityOptions = ["Free WiFi", "Swimming Pool", "Spa & Wellness", "Airport Shuttle", "Breakfast Included", "Ocean View", "Fitness Center", "Bar & Lounge"];

    // --- INITIAL LOAD ---
    useEffect(() => {
        const savedIntro = localStorage.getItem('siteIntro');
        if (savedIntro) setIntro(JSON.parse(savedIntro));
        
        const savedNotes = localStorage.getItem('siteNotifications');
        if (savedNotes) setNotifications(JSON.parse(savedNotes));
        
        const savedBanners = localStorage.getItem('sitePlanBanners');
        if (savedBanners) setPlanBanners(JSON.parse(savedBanners));

        const savedReviews = localStorage.getItem('siteReviews');
        if (savedReviews) setReviews(JSON.parse(savedReviews));

        const savedFooter = localStorage.getItem('siteFooter');
        if (savedFooter) setFooterData(JSON.parse(savedFooter));

        const savedHotels = localStorage.getItem('siteHotels');
        if (savedHotels) setHotels(JSON.parse(savedHotels));

        const savedPlaces = localStorage.getItem('sitePlaces');
        if (savedPlaces) setPlaces(JSON.parse(savedPlaces));

        loadTravelPlans();
    }, []);

   // --- ⚠️ UPDATED EMERGENCY RESET (CLEARS EVERYTHING) ---
    const handleResetPlans = () => {
        if(window.confirm("⚠️ This will DELETE ALL DATA (Plans, Destinations, Hotels) to fix the 'Storage Full' error. Are you sure?")) {
            // Clear Plans
            localStorage.removeItem('sitePlans');
            // Clear Destinations (This fixes your "rfff" issue)
            localStorage.removeItem('sitePlaces');
            // Clear Hotels
            localStorage.removeItem('siteHotels');
            
            // Reload the page
            window.location.reload(); 
        }
    };

    // --- LOAD DEFAULT PLANS ---
    const loadTravelPlans = () => {
        const emptyDay = (i) => ({ day: i+1, place: `Day ${i+1}`, desc: "Edit description...", img: "", img2: "", img3: "", subPlaces: [], hotels: [] });
        const allDefaultPlans = {
            "5-day-culture": { id: "5-day-culture", title: "5-Day Culture", googleMapLink: "", coverImg: "", itinerary: Array.from({length:5}, (_,i)=>emptyDay(i)) },
            "5-day-nature": { id: "5-day-nature", title: "5-Day Hill Country", googleMapLink: "", coverImg: "", itinerary: Array.from({length:5}, (_,i)=>emptyDay(i)) },
            "5-day-beach": { id: "5-day-beach", title: "5-Day Southern Sun", googleMapLink: "", coverImg: "", itinerary: Array.from({length:5}, (_,i)=>emptyDay(i)) },
            
            "15-day-classic": { id: "15-day-classic", title: "15-Day Classic", googleMapLink: "", coverImg: "", itinerary: Array.from({length:15}, (_,i)=>emptyDay(i)) },
            "15-day-adventure": { id: "15-day-adventure", title: "15-Day Adventure", googleMapLink: "", coverImg: "", itinerary: Array.from({length:15}, (_,i)=>emptyDay(i)) },
            "15-day-relax": { id: "15-day-relax", title: "15-Day Relax", googleMapLink: "", coverImg: "", itinerary: Array.from({length:15}, (_,i)=>emptyDay(i)) },
            
            "30-day-grand": { id: "30-day-grand", title: "30-Day Grand", googleMapLink: "", coverImg: "", itinerary: Array.from({length:30}, (_,i)=>emptyDay(i)) },
            "30-day-slow": { id: "30-day-slow", title: "30-Day Slow Travel", googleMapLink: "", coverImg: "", itinerary: Array.from({length:30}, (_,i)=>emptyDay(i)) },
            "30-day-north": { id: "30-day-north", title: "30-Day North & East", googleMapLink: "", coverImg: "", itinerary: Array.from({length:30}, (_,i)=>emptyDay(i)) }
        };
        const savedPlans = localStorage.getItem('sitePlans');
        if (savedPlans) setTravelPlans({ ...allDefaultPlans, ...JSON.parse(savedPlans) });
        else setTravelPlans(allDefaultPlans);
    };

    // --- SAVING LOGIC ---
    const savePlans = () => { 
        try { 
            localStorage.setItem('sitePlans', JSON.stringify(travelPlans)); 
            alert("✅ Plans Saved Successfully!"); 
        } catch(e) { 
            alert("❌ Storage Full! Please click 'Reset All Plans' button at the top."); 
        } 
    };

    // --- COMPRESSION HELPERS (If file is absolutely needed) ---
    const resizeImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800; 
                    let width = img.width; let height = img.height;
                    if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                    canvas.width = width; canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.6)); 
                };
            };
        });
    };
    const handleImageUpload = async (e, callback) => {
        const file = e.target.files[0];
        if (file) { try { const compressedBase64 = await resizeImage(file); callback(compressedBase64); } catch (error) { alert("Error."); } }
    };

    // --- EVENT HANDLERS ---
    const selectDuration = (d) => { setSelectedDuration(d); setViewMode('LIST'); };
    const selectPlanToEdit = (id) => { setEditingPlanId(id); setViewMode('EDITOR'); };
    const goBack = () => { viewMode === 'EDITOR' ? setViewMode('LIST') : setViewMode('MAIN'); };
    const handlePlanChange = (f, v) => { const u={...travelPlans}; u[editingPlanId][f]=v; setTravelPlans(u); };
    const handleItineraryChange = (idx, f, v) => { const u={...travelPlans}; u[editingPlanId].itinerary[idx][f]=v; setTravelPlans(u); };
    
    // --- UPLOAD / URL HANDLERS ---
    const handleBannerUpload = (e, type) => { handleImageUpload(e, (base64) => { const updated = { ...planBanners, [type]: base64 }; setPlanBanners(updated); localStorage.setItem('sitePlanBanners', JSON.stringify(updated)); }); };
    const handleBannerUrl = (val, type) => { const updated = { ...planBanners, [type]: val }; setPlanBanners(updated); localStorage.setItem('sitePlanBanners', JSON.stringify(updated)); };
    
    const handleIntroImageUpload = (e) => { handleImageUpload(e, (base64) => setIntro({...intro, images:[...intro.images, base64]})); };
    const addIntroUrl = () => { if(newIntroUrl) { setIntro({...intro, images:[...intro.images, newIntroUrl]}); setNewIntroUrl(""); } };
    
    const handleItineraryImageUpload = (idx, e, field) => { handleImageUpload(e, (base64) => handleItineraryChange(idx, field, base64)); };
    const handleNewItemImageUpload = (e) => { handleImageUpload(e, (base64) => setNewItem({ ...newItem, img: base64 })); };
    const handlePlanCoverUpload = (e) => { handleImageUpload(e, (base64) => { const updatedPlans = { ...travelPlans }; updatedPlans[editingPlanId].coverImg = base64; setTravelPlans(updatedPlans); }); };
    
    // --- OTHER ACTIONS ---
    const handleSaveHome = (e) => { e.preventDefault(); localStorage.setItem('siteIntro', JSON.stringify(intro)); alert("✅ Home Saved!"); };
    const handleAddNotification = () => { if(newNotify){ const u=[...notifications,newNotify]; setNotifications(u); localStorage.setItem('siteNotifications',JSON.stringify(u)); setNewNotify(""); }};
    const handleDeleteNotification = (i) => { const u=notifications.filter((_,x)=>x!==i); setNotifications(u); localStorage.setItem('siteNotifications',JSON.stringify(u)); };
    const handleDeleteIntroImage = (i) => { const u=intro.images.filter((_,x)=>x!==i); setIntro({...intro, images:u}); };
    const handleDeleteReview = (id) => { if(window.confirm("Delete?")) { const u = reviews.filter(r => r.id !== id); setReviews(u); localStorage.setItem('siteReviews', JSON.stringify(u)); } };
    const handleSaveFooter = (e) => { e.preventDefault(); localStorage.setItem('siteFooter', JSON.stringify(footerData)); alert("✅ Footer Saved!"); };
    
    // --- ITEM/PLACE/HOTEL ACTIONS ---
    const openDetailModal = (i) => { setCurrentDayIndex(i); setNewItem({name:"",desc:"",price:"",stars:5,img:"", story:""}); setShowDetailModal(true); };
    const handleAddItem = () => { const u={...travelPlans}; const day=u[editingPlanId].itinerary[currentDayIndex]; if(!day.subPlaces) day.subPlaces=[]; if(!day.hotels) day.hotels=[]; const list = detailTab==="attractions" ? day.subPlaces : day.hotels; list.push({...newItem, id:Date.now()}); setTravelPlans(u); setNewItem({name:"",desc:"",price:"",stars:5,img:"", story:""}); };
    const handleDeleteItem = (idx, type) => { const u={...travelPlans}; const day=u[editingPlanId].itinerary[currentDayIndex]; if(type==='attraction') day.subPlaces=day.subPlaces.filter((_,i)=>i!==idx); else day.hotels=day.hotels.filter((_,i)=>i!==idx); setTravelPlans(u); };
    const handleSavePlace = () => { let u; if (currentPlace.id) u = places.map(p => p.id === currentPlace.id ? currentPlace : p); else u = [...places, { ...currentPlace, id: Date.now() }]; setPlaces(u); localStorage.setItem('sitePlaces', JSON.stringify(u)); setShowPlaceModal(false); };
    const handleDeletePlace = (id) => { if (window.confirm("Delete?")) { const u = places.filter(p => p.id !== id); setPlaces(u); localStorage.setItem('sitePlaces', JSON.stringify(u)); } };
    const openPlaceModal = (place = null) => { if (place) setCurrentPlace(place); else setCurrentPlace({ id: null, name: '', category: 'Beaches', location: '', description: '', image: '', image2: '', image3: '' }); setShowPlaceModal(true); };
    const handleSaveHotel = () => { let u; if (currentHotel.id) u = hotels.map(h => h.id === currentHotel.id ? currentHotel : h); else u = [...hotels, { ...currentHotel, id: Date.now() }]; setHotels(u); localStorage.setItem('siteHotels', JSON.stringify(u)); setShowHotelModal(false); };
    const handleDeleteHotel = (id) => { if (window.confirm("Delete?")) { const u = hotels.filter(h => h.id !== id); setHotels(u); localStorage.setItem('siteHotels', JSON.stringify(u)); } };
    const openHotelModal = (hotel = null) => { if (hotel) setCurrentHotel({ ...hotel, amenities: hotel.amenities || [] }); else setCurrentHotel({ id: null, category: "Luxury Resorts 💎", name: "", location: "", price: "", rating: 5, img: "", description: "", amenities: [] }); setShowHotelModal(true); };
    const handleAmenityChange = (amenity) => { const c = currentHotel.amenities || []; if (c.includes(amenity)) setCurrentHotel({ ...currentHotel, amenities: c.filter(a => a !== amenity) }); else setCurrentHotel({ ...currentHotel, amenities: [...c, amenity] }); };
    
    // --- UPLOAD HANDLERS FOR PLACE/HOTEL ---
    const handlePlaceImageUpload = (e, field) => { handleImageUpload(e, (base64) => setCurrentPlace({ ...currentPlace, [field]: base64 })); };
    const handleHotelImageUpload = (e) => { handleImageUpload(e, (base64) => setCurrentHotel({ ...currentHotel, img: base64 })); };

    const currentItinerary = travelPlans[editingPlanId]?.itinerary || [];
    const getPlansForDuration = () => { if (!selectedDuration) return []; return Object.values(travelPlans).filter(p => p.id.startsWith(`${selectedDuration}-day`)); };

    return (
        <Container className="mt-4 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary">👑 Admin Control Center</h2>
                {/* ⚠️ THE RESET BUTTON IS HERE */}
                <Button variant="danger" onClick={handleResetPlans}>⚠️ Reset All Plans (Fix Storage)</Button>
            </div>
            
            <Tab.Container id="admin-tabs" defaultActiveKey="travel-plans">
                <Row>
                    <Col sm={3}>
                        <Nav variant="pills" className="flex-column shadow-sm p-3 bg-white rounded">
                            <Nav.Item><Nav.Link eventKey="home-updates" className="fw-bold mb-2">1. Home Updates</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="reviews" className="fw-bold mb-2 text-warning">2. Manage Reviews</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="travel-plans" className="fw-bold mb-2">3. Edit Travel Plans</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="destinations" className="fw-bold mb-2">4. Manage Destinations</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="hotels" className="fw-bold mb-2 text-success">5. Manage Hotels</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="footer" className="fw-bold mb-2 text-info">6. Footer Settings</Nav.Link></Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey="home-updates">
                                <Card className="p-4 shadow-sm border-0">
                                    <h4 className="text-warning">🔔 Notifications</h4>
                                    <ListGroup className="mb-3">{notifications.map((n, i) => (<ListGroup.Item key={i}>{n} <Button variant="outline-danger" size="sm" onClick={() => handleDeleteNotification(i)}>X</Button></ListGroup.Item>))}</ListGroup>
                                    <div className="d-flex"><Form.Control value={newNotify} onChange={(e)=>setNewNotify(e.target.value)} /><Button onClick={handleAddNotification}>Add</Button></div>
                                    <hr/>
                                    <h4 className="text-success">🌴 Intro Section</h4>
                                    <Form onSubmit={handleSaveHome}>
                                        <Form.Group className="mb-2"><Form.Label>Main Title</Form.Label><Form.Control value={intro.title} onChange={(e)=>setIntro({...intro, title: e.target.value})} /></Form.Group>
                                        <Form.Group className="mb-2"><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={3} value={intro.desc} onChange={(e)=>setIntro({...intro, desc: e.target.value})} /></Form.Group>
                                        <Row><Col><Form.Control type="file" onChange={handleIntroImageUpload} /></Col><Col><div className="d-flex"><Form.Control placeholder="Or URL..." value={newIntroUrl} onChange={(e)=>setNewIntroUrl(e.target.value)} /><Button onClick={addIntroUrl}>Add</Button></div></Col></Row>
                                        <Row className="mb-3">{intro.images.map((img, i) => (<Col xs={4} key={i} className="mb-2 position-relative"><img src={img} className="img-fluid rounded" style={{height:'80px', width:'100%', objectFit:'cover'}} alt="i"/><Button variant="danger" size="sm" className="position-absolute top-0 end-0" onClick={() => handleDeleteIntroImage(i)}>x</Button></Col>))}</Row>
                                        <Button type="submit">Save Home</Button>
                                    </Form>
                                    <hr/>
                                    <h4 className="text-info">🖼️ Plan Banners</h4>
                                    <Row>
                                        <Col md={4}><img src={planBanners["5"]} style={{width:'100%',height:'60px'}}/><Form.Control type="text" size="sm" placeholder="URL Only" onChange={(e)=>handleBannerUrl(e.target.value, "5")} /></Col>
                                        <Col md={4}><img src={planBanners["15"]} style={{width:'100%',height:'60px'}}/><Form.Control type="text" size="sm" placeholder="URL Only" onChange={(e)=>handleBannerUrl(e.target.value, "15")} /></Col>
                                        <Col md={4}><img src={planBanners["30"]} style={{width:'100%',height:'60px'}}/><Form.Control type="text" size="sm" placeholder="URL Only" onChange={(e)=>handleBannerUrl(e.target.value, "30")} /></Col>
                                    </Row>
                                </Card>
                            </Tab.Pane>

                            <Tab.Pane eventKey="reviews">
                                <Card className="p-4 shadow-sm border-0"><div className="d-flex justify-content-between"><h4 className="text-warning">⭐ Reviews</h4><Badge bg="secondary">{reviews.length}</Badge></div><Table striped bordered hover responsive><thead><tr><th>User</th><th>Rating</th><th>Review</th><th>Action</th></tr></thead><tbody>{reviews.map((r) => (<tr key={r.id}><td>{r.user}</td><td>{"★".repeat(r.rating || 5)}</td><td><small>{r.text}</small></td><td><Button variant="outline-danger" size="sm" onClick={() => handleDeleteReview(r.id)}>Del</Button></td></tr>))}</tbody></Table></Card>
                            </Tab.Pane>
                            
                            <Tab.Pane eventKey="travel-plans">
                                {viewMode === 'MAIN' && (<div><h4 className="mb-4 text-primary">Select Duration</h4><Row>{['5', '15', '30'].map(day => (<Col md={4} key={day}><Card className="h-100 shadow-sm text-center p-4 hover-card" onClick={() => selectDuration(day)} style={{cursor:'pointer', border:'2px solid #0d6efd'}}><h3>{day} Days</h3><Button variant="primary">Select</Button></Card></Col>))}</Row></div>)}
                                {viewMode === 'LIST' && (<div><div className="d-flex align-items-center mb-4"><Button variant="outline-secondary" className="me-3" onClick={goBack}>← Back</Button><h4>Select {selectedDuration}-Day Plan</h4></div><Row>{getPlansForDuration().map((plan) => (<Col md={4} key={plan.id} className="mb-3"><Card className="h-100 text-center p-3 shadow-sm" onClick={() => selectPlanToEdit(plan.id)} style={{cursor:'pointer'}}><h5 className="fw-bold">{plan.title}</h5><Button variant="outline-primary" size="sm">Edit Plan</Button></Card></Col>))}</Row><Button variant="success" className="mt-3" onClick={savePlans}>💾 Save All Plans</Button></div>)}
                                {viewMode === 'EDITOR' && (<Card className="p-4 shadow-sm border-0"><div className="d-flex justify-content-between align-items-center mb-4"><h4 className="text-primary m-0">Editing: {travelPlans[editingPlanId]?.title}</h4><Button variant="secondary" size="sm" onClick={goBack}>← Back</Button></div>
                                <Form.Group className="mb-3"><Form.Label className="fw-bold text-success">🖼️ Plan Cover (PASTE URL ONLY)</Form.Label><div className="mb-2" style={{height: '150px', overflow:'hidden', borderRadius:'10px', border:'1px solid #ccc'}}><img src={travelPlans[editingPlanId]?.coverImg} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="Cover"/></div>
                                {/* 🔴 CHANGED: Priority to URL Input */}
                                <Form.Control placeholder="Paste High-Res URL Here..." onChange={(e) => handlePlanChange('coverImg', e.target.value)} className="mb-2" />
                                <Form.Text className="text-muted">Do NOT use 'Choose File'. Copy & Paste a link instead.</Form.Text>
                                </Form.Group>
                                <Form.Group className="mb-2"><Form.Label>Title</Form.Label><Form.Control value={travelPlans[editingPlanId]?.title} onChange={(e) => handlePlanChange('title', e.target.value)} /></Form.Group><Accordion defaultActiveKey="0">{currentItinerary.map((day, index) => (<Accordion.Item eventKey={index.toString()} key={index}><Accordion.Header>Day {day.day}: {day.place}</Accordion.Header><Accordion.Body><Row className="mb-3"><Col><Form.Control placeholder="Name" value={day.place} onChange={(e) => handleItineraryChange(index, 'place', e.target.value)} /></Col><Col><Form.Control placeholder="Desc" as="textarea" rows={1} value={day.desc} onChange={(e) => handleItineraryChange(index, 'desc', e.target.value)} /></Col></Row><Row className="mb-3"><Col><Form.Label className="small">Main Img (URL)</Form.Label><Form.Control type="text" size="sm" placeholder="Paste URL" value={day.img} onChange={(e) => handleItineraryChange(index, 'img', e.target.value)} />{day.img && <img src={day.img} alt="1" style={{width: '50px'}} />}</Col><Col><Form.Label className="small">Img 2 (URL)</Form.Label><Form.Control type="text" size="sm" placeholder="Paste URL" value={day.img2} onChange={(e) => handleItineraryChange(index, 'img2', e.target.value)} />{day.img2 && <img src={day.img2} alt="2" style={{width: '50px'}} />}</Col><Col><Form.Label className="small">Img 3 (URL)</Form.Label><Form.Control type="text" size="sm" placeholder="Paste URL" value={day.img3} onChange={(e) => handleItineraryChange(index, 'img3', e.target.value)} />{day.img3 && <img src={day.img3} alt="3" style={{width: '50px'}} />}</Col></Row><Button variant="outline-primary" className="w-100 fw-bold" onClick={() => openDetailModal(index)}>Manage Places & Hotels</Button></Accordion.Body></Accordion.Item>))}</Accordion><Button variant="success" size="lg" className="mt-4 w-100" onClick={savePlans}>💾 Save Changes</Button></Card>)}
                            </Tab.Pane>

                            <Tab.Pane eventKey="destinations">
                                <Card className="p-4 shadow-sm border-0"><div className="d-flex justify-content-between align-items-center mb-4"><h4 className="text-info">🗺️ Destinations</h4><Button variant="success" onClick={() => openPlaceModal()}>+ Add New</Button></div><Table striped bordered hover responsive><thead><tr><th>Img</th><th>Name</th><th>Cat</th><th>Act</th></tr></thead><tbody>{places.map((p) => (<tr key={p.id}><td><img src={p.image} style={{width:'40px'}} alt="p"/></td><td>{p.name}</td><td>{p.category}</td><td><Button variant="danger" size="sm" onClick={() => handleDeletePlace(p.id)}>Del</Button></td></tr>))}</tbody></Table></Card>
                            </Tab.Pane>

                            <Tab.Pane eventKey="hotels">
                                <Card className="p-4 shadow-sm border-0"><div className="d-flex justify-content-between align-items-center mb-4"><h4 className="text-success">🏨 Hotels</h4><Button variant="success" onClick={() => openHotelModal()}>+ Add New</Button></div><Table striped bordered hover responsive><thead><tr><th>Img</th><th>Name</th><th>Loc</th><th>$$</th><th>Act</th></tr></thead><tbody>{hotels.map((h) => (<tr key={h.id}><td><img src={h.img} style={{width:'40px'}} alt="h"/></td><td>{h.name}</td><td>{h.location}</td><td>{h.price}</td><td><Button variant="danger" size="sm" onClick={() => handleDeleteHotel(h.id)}>Del</Button></td></tr>))}</tbody></Table></Card>
                            </Tab.Pane>

                            <Tab.Pane eventKey="footer">
                                <Card className="p-4 shadow-sm border-0"><h4 className="text-info mb-4">🦶 Footer</h4><Form onSubmit={handleSaveFooter}><Form.Control as="textarea" rows={3} value={footerData.about} onChange={(e) => setFooterData({...footerData, about: e.target.value})} className="mb-3" placeholder="About..." /><Row><Col><Form.Control value={footerData.email} onChange={(e) => setFooterData({...footerData, email: e.target.value})} placeholder="Email" /></Col><Col><Form.Control value={footerData.phone} onChange={(e) => setFooterData({...footerData, phone: e.target.value})} placeholder="Phone" /></Col></Row><Form.Control value={footerData.copyright} onChange={(e) => setFooterData({...footerData, copyright: e.target.value})} className="mt-3" placeholder="Copyright" /><Button type="submit" variant="primary" className="mt-3">Save Footer</Button></Form></Card>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>

            {/* Modals */}
            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered><Modal.Header closeButton><Modal.Title>Manage Details</Modal.Title></Modal.Header><Modal.Body><Nav variant="tabs" className="mb-3"><Nav.Item><Nav.Link active={detailTab === 'attractions'} onClick={() => setDetailTab('attractions')}>Attractions</Nav.Link></Nav.Item><Nav.Item><Nav.Link active={detailTab === 'hotels'} onClick={() => setDetailTab('hotels')}>Hotels</Nav.Link></Nav.Item></Nav><Card className="p-3 bg-light mb-3"><h6>Add New {detailTab === 'attractions' ? 'Attraction' : 'Hotel'}</h6><Row className="g-2"><Col md={6}><Form.Control placeholder="Name" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} /></Col><Col md={6}><Form.Control placeholder="Desc / Price" value={detailTab === 'hotels' ? newItem.price : newItem.desc} onChange={(e) => detailTab === 'hotels' ? setNewItem({...newItem, price: e.target.value}) : setNewItem({...newItem, desc: e.target.value})} /></Col><Col md={12}><Form.Control as="textarea" rows={3} placeholder="Full Story..." value={newItem.story} onChange={(e) => setNewItem({...newItem, story: e.target.value})} /></Col><Col md={12}><Form.Control type="text" placeholder="Paste Image URL Here (DO NOT UPLOAD)" value={newItem.img} onChange={(e)=>setNewItem({...newItem, img: e.target.value})}/></Col><Col md={12}><Button variant="primary" size="sm" className="w-100 mt-2" onClick={handleAddItem}>+ Add Item</Button></Col></Row></Card><ListGroup>{(travelPlans[editingPlanId]?.itinerary[currentDayIndex]?.[detailTab === 'attractions' ? 'subPlaces' : 'hotels'] || []).map((item, idx) => (<ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center"><div className="d-flex align-items-center">{item.img && <img src={item.img} alt="mini" style={{width: '40px', height: '40px', marginRight: '10px', objectFit: 'cover'}} />}<div><strong>{item.name}</strong><br/><small>{detailTab === 'hotels' ? item.price : item.desc}</small></div></div><Button variant="danger" size="sm" onClick={() => handleDeleteItem(idx, detailTab === 'attractions' ? 'attraction' : 'hotel')}>Delete</Button></ListGroup.Item>))}</ListGroup></Modal.Body><Modal.Footer><Button variant="secondary" onClick={() => setShowDetailModal(false)}>Close</Button></Modal.Footer></Modal>
            <Modal show={showPlaceModal} onHide={() => setShowPlaceModal(false)} size="lg"><Modal.Header closeButton><Modal.Title>Place</Modal.Title></Modal.Header><Modal.Body><Form><Form.Control value={currentPlace.name} onChange={(e) => setCurrentPlace({...currentPlace, name: e.target.value})} placeholder="Name" className="mb-2"/><Form.Select value={currentPlace.category} onChange={(e) => setCurrentPlace({...currentPlace, category: e.target.value})} className="mb-2"><option>Beaches</option><option>Hill Country</option><option>Cultural</option><option>Wildlife</option><option>Modern City</option></Form.Select><Form.Control value={currentPlace.location} onChange={(e) => setCurrentPlace({...currentPlace, location: e.target.value})} placeholder="Location" className="mb-2"/><Form.Control type="text" placeholder="Img URL 1" value={currentPlace.image} onChange={(e) => setCurrentPlace({...currentPlace, image: e.target.value})} className="mb-2"/><Form.Control as="textarea" rows={4} value={currentPlace.description} onChange={(e) => setCurrentPlace({...currentPlace, description: e.target.value})} placeholder="Description" /></Form></Modal.Body><Modal.Footer><Button variant="secondary" onClick={() => setShowPlaceModal(false)}>Cancel</Button><Button variant="primary" onClick={handleSavePlace}>Save</Button></Modal.Footer></Modal>
            <Modal show={showHotelModal} onHide={() => setShowHotelModal(false)} size="lg" centered><Modal.Header closeButton><Modal.Title>Hotel</Modal.Title></Modal.Header><Modal.Body><Form><Form.Select value={currentHotel.category} onChange={(e) => setCurrentHotel({...currentHotel, category: e.target.value})} className="mb-2"><option>Luxury Resorts 💎</option><option>Boutique Villas 🌿</option><option>Eco & Nature Lodges 🐘</option></Form.Select><Form.Control value={currentHotel.name} onChange={(e) => setCurrentHotel({...currentHotel, name: e.target.value})} placeholder="Name" className="mb-2"/><Form.Control value={currentHotel.location} onChange={(e) => setCurrentHotel({...currentHotel, location: e.target.value})} placeholder="Location" className="mb-2"/><Form.Control placeholder="Price" value={currentHotel.price} onChange={(e) => setCurrentHotel({...currentHotel, price: e.target.value})} className="mb-2"/><Form.Control as="textarea" rows={4} value={currentHotel.description} onChange={(e) => setCurrentHotel({...currentHotel, description: e.target.value})} placeholder="Desc" className="mb-2"/><Form.Control type="text" placeholder="Image URL" value={currentHotel.img} onChange={(e) => setCurrentHotel({...currentHotel, img: e.target.value})} /></Form></Modal.Body><Modal.Footer><Button variant="secondary" onClick={() => setShowHotelModal(false)}>Close</Button><Button variant="primary" onClick={handleSaveHotel}>Save</Button></Modal.Footer></Modal>
        </Container>
    );
};
export default AdminDashboard;