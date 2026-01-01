import React from 'react';
import Navbar from '../components/Navbar';
import '../components/CategoryGrid.css'; // Using the same CSS as the home page

// Data for the beaches
const srilankanBeaches = [
  { id: 101, name: 'Unawatuna', description: 'Famous for its horseshoe-shaped beach and coral reefs.' },
  { id: 102, name: 'Mirissa', description: 'Great for whale watching and surfing.' },
  { id: 103, name: 'Arugam Bay', description: 'One of the best surfing spots in the world.' },
  { id: 104, name: 'Nilaveli', description: 'Pristine white sandy beaches in Trincomalee.' }
];

const Beaches = () => {

  // This function sends data to your Spring Boot Backend
  const addToTrip = async (beach) => {
    const tripItem = {
      name: beach.name,
      category: "Beach",
      description: beach.description
    };

    try {
      // Make sure your backend is running on port 8080
      const response = await fetch("http://localhost:8080/api/trip/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(tripItem)
      });

      if (response.ok) {
        alert(`${beach.name} saved to your trip in the database!`);
      } else {
        alert("Failed to save to database.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error connecting to backend. Is Spring Boot running?");
    }
  };

  return (
    <div className="beaches-page">
      <Navbar />
      
      <div className="category-container">
        {/* Header */}
        <div className="category-header">
          <span className="folder-icon">🏖️</span> 
          Sri Lankan Beaches
        </div>

        {/* Grid of Beaches */}
        <div className="category-grid">
          {srilankanBeaches.map((beach) => (
            <div key={beach.id} className="category-card">
              
              {/* Image Placeholder - You can add <img src={...} /> here later */}
              <div className="image-placeholder"></div>
              
              <div className="card-title">{beach.name}</div>
              
              <p style={{fontSize: '12px', color: '#666', textAlign: 'center', marginBottom: '10px'}}>
                {beach.description}
              </p>
              
              {/* The Add Button */}
              <button 
                className="explore-btn" 
                style={{backgroundColor: '#28a745', color: 'white', border: 'none'}}
                onClick={() => addToTrip(beach)}
              >
                + Add to Trip
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Beaches;