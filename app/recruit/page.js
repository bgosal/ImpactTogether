"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaBuilding, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaListAlt, FaTasks, FaInfoCircle } from 'react-icons/fa';

export default function Recruit() {
  const { data: session } = useSession();
  const organizerId = session?.user?.id; 

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    eventName: '',
    category: '',
    date: '',
    startTime: '',
    address: '',
    location: '',
    description: '',
    requirements: ''
  });

  const [error, setError] = useState(null); 
  const [success, setSuccess] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!organizerId) {
      setError("You must be logged in to create an event.");
      return;
    }
  
    
    const formattedRequirements = formData.requirements
      .split('\n')
      .map(line => line.trim())
      .filter(line => line)
      .join('\n');

    
    const formattedDescription = formData.description
      .replace(/\s+/g, ' ') 
      .trim(); 

    

    try {
      const response = await fetch('/api/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          organizer: organizerId,
          requirements: formattedRequirements,
          description: formattedDescription,
         
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "Failed to create event.");
      }

      const result = await response.json();
      console.log("Event created:", result);

      setSuccess(true);
      setError(null);
      setFormData({
        eventName: '',
        category: '',
        date: '',
        startTime: '',
        address: '',
        location: '',
        description: '',
        requirements: ''
      });

    } catch (error) {
      console.error("Error creating event:", error);
      setError(error.message);
      setSuccess(false);
    }
  };
  
  return (
    <main>
      <div className="event-form-container">
        <div className="form-heading">Create New Event</div>
        <form onSubmit={handleSubmit}>
          <section className="event-details-section">
            <div className="section-heading">
              <FaInfoCircle className="icon-heading" />
              <span className="section-heading-text">Event Details</span>
            </div>
            <div className="event-input-group">
              <label htmlFor="eventName"><FaBuilding className="icon-heading" /> Event Name</label>
              <input
                type="text"
                id="eventName"
                name="eventName"
                className="event-input-field"
                placeholder="Enter event name"
                required
                value={formData.eventName}
                onChange={handleChange}
              />
            </div>
            <div className="event-input-group">
              <label htmlFor="category"><FaListAlt className="icon-heading" /> Category</label>
              <select
                id="category"
                name="category"
                className="event-input-field"
                required
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                <option value="Animal_Care">Animal Care</option>
                <option value="Arts">Arts & Culture</option>
                <option value="Community">Community</option>
                <option value="Education">Education</option>
                <option value="Environment">Environment</option>
                <option value="Food">Food</option>
                <option value="Health">Health</option>
                <option value="Youth">Youth</option>
              </select>
            </div>
            <div className="event-input-group">
              <label htmlFor="date"><FaCalendarAlt className="icon-heading" /> Date</label>
              <input
                type="date"
                id="date"
                name="date"
                className="event-input-field"
                min={minDate}
                required
                value={formData.date}
                onChange={handleChange}
              />
            </div>
            <div className="event-input-group">
              <label htmlFor="startTime"><FaClock className="icon-heading" /> Start Time</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                className="event-input-field"
                required
                value={formData.startTime}
                onChange={handleChange}
              />
            </div>
            <div className="event-input-group">
              <label htmlFor="address"><FaMapMarkerAlt className="icon-heading" /> Address</label>
              <input
                type="text"
                id="address"
                name="address"
                className="event-input-field"
                placeholder="Enter address"
                required
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="event-input-group">
              <label htmlFor="location"><FaMapMarkerAlt className="icon-heading" /> Location</label>
              <select
                id="location"
                name="location"
                className="event-input-field"
                required
                value={formData.location}
                onChange={handleChange}
              >
                <option value="">Select Location</option>
                <option value="Abbotsford">Abbotsford</option>
                <option value="Burnaby">Burnaby</option>
                <option value="Coquitlam">Coquitlam</option>
                <option value="Delta">Delta</option>
                <option value="Langley">Langley</option>
                <option value="Richmond">Richmond</option>
                <option value="Surrey">Surrey</option>
                <option value="Vancouver">Vancouver</option>
              </select>
            </div>
          </section>
          <section className="event-description-section">
            <div className="section-heading"><FaTasks className="icon-heading" /> Event Description</div>
            <div className="event-input-group">
              <label htmlFor="description"><FaInfoCircle className="icon-heading" /> Event Description</label>
              <textarea
                id="description"
                name="description"
                className="event-input-field"
                placeholder="Enter a brief description"
                rows="4"
                required
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="event-input-group">
              <label htmlFor="requirements"><FaTasks className="icon-heading" /> Event Requirements</label>
              <textarea
                id="requirements"
                name="requirements"
                className="event-input-field"
                placeholder="Enter event requirements"
                rows="3"
                value={formData.requirements}
                onChange={handleChange}
              ></textarea>
            </div>
            
          </section>
          <button type="submit" className="event-submit-button">Create Listing</button>
        </form>
      </div>
    </main>
  );
}
