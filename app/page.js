"use client";

import { useState, useEffect } from "react";
import Item from "@components/Item";
import Loader from "@components/Loader";
import Fuse from "fuse.js";
import Link from "next/link";
import {FiCalendar,FiMapPin,FiHeart,FiCoffee,FiUsers,FiBook,FiGlobe,FiActivity,FiSmile,FiInfo, FiBox} from "react-icons/fi";


export default function Home() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
 
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryIcons = {
    Animal_Care: <span className="event-icon"><FiHeart /></span>,
    Arts: <span className="event-icon"><FiSmile /></span>,
    Community: <span className="event-icon"><FiUsers /></span>,
    Education: <span className="event-icon"><FiBook /></span>,
    Environment: <span className="event-icon"><FiGlobe /></span>,
    Food: <span className="event-icon"><FiCoffee /></span>,
    Health: <span className="event-icon"><FiActivity /></span>,
    Youth: <span className="event-icon"><FiBox /></span>,
  };
  



  // Fetches events from database and removes any that have expired (Only runs on intial render)
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/event");
        
        if (!response.ok) { throw new Error("Failed to fetch events"); }
        
        const data = await response.json();

        // Filters out events with expired dates
        const upcomingEvents = data.filter(
          (event) => new Date(event.date) >= new Date()
        );

        setEvents(upcomingEvents);
        setFilteredEvents(upcomingEvents);
      } catch (err) {
        console.error(err);
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const fuse = new Fuse(events, {
      keys: ["eventName", "organizer.organizationName", "location"],
      threshold: 0.1, 
    });

    const filteredBySearch = search
      ? fuse.search(search).map((result) => result.item)
      : events;

    const filtered = filteredBySearch.filter((event) => {
      const matchesCity = city ? event.location === city : true;
      const matchesCategory = category ? event.category === category : true;   
      return matchesCity && matchesCategory;
    });

    setFilteredEvents(filtered);
  }, [search, city, category, events]);

  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;

  return (
    <main className="home-page">
      <section className="item-container">
        <div className="filter-section">
          <input
            type="text"
            placeholder="Search..."
            className="filter-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="filter-dropdown"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">Select City</option>
            <option value="Abbotsford">Abbotsford</option>
            <option value="Burnaby">Burnaby</option>
            <option value="Coquitlam">Coquitlam</option>
            <option value="Delta">Delta</option>
            <option value="Langley">Langley</option>
            <option value="Richmond">Richmond</option>
            <option value="Surrey">Surrey</option>
            <option value="Vancouver">Vancouver</option>
          </select>
          <select
            className="filter-dropdown"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="Animal_Care">Animal Care</option>
            <option value="Arts">Arts</option>
            <option value="Community">Community</option>
            <option value="Education">Education</option>
            <option value="Environment">Environment</option>
            <option value="Food">Food</option>
            <option value="Health">Health</option>
            <option value="Youth">Youth</option>
          </select>
        </div>

        <div className="item-list">
          {filteredEvents.length === 0 ? (
            <p>No events match your criteria.</p>
          ) : (
            filteredEvents.map((event) => (
              <Link href={`/events/${event._id}`} key={event._id} className="event-link">
                <div className="event-card">
                <div className="organizer-picture">
                  <img
                    src={event.organizer?.profilePicture  || "/images/org.png"} 
                    alt={`${event.eventName} Organizer`}
                    className="organizer-image"
                  />
                </div>

               
                <div className="event-content">
                  
                  <div className="front-event-name">
          {event.eventName.length > 15
            ? `${event.eventName.substring(0, 15)}...`
            : event.eventName}
        </div>


          <div className="front-organization-name">
           {event.organizer?.organizationName }
          </div>

          
          <div className="front-event-details-vertical">
            <div className="front-event-details">
              <FiCalendar className="event-icon" /> {new Date(event.date).toLocaleDateString()}
            </div>
            <div className="front-event-details">
              <FiMapPin className="event-icon" /> {event.location}
            </div>
            <div className="front-event-details">
              {categoryIcons[event.category]} {event.category.replace(/_/g, " ")}
            </div>
          </div>
        </div>
      </div>
      </Link>
    ))
  )}
</div>


      </section>
    </main>
  )
}
