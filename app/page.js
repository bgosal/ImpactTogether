"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/event");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main>
      <section className="item-container">
        <div className="filter-section">
          <input type="text" placeholder="Search..." className="filter-input" />
          <select className="filter-dropdown">
            <option value="">Select City</option>
            <option value="langley">Langley</option>
            <option value="vancouver">Vancouver</option>
            <option value="abbotsford">Abbotsford</option>
            <option value="surrey">Surrey</option>
          </select>
          <select className="filter-dropdown">
            <option value="">Select Category</option>
            <option value="health">Health</option>
            <option value="food">Food</option>
            <option value="community">Community</option>
          </select>
          <button className="filter-button">Apply Filters</button>
        </div>

        <div className="item-list">
          {events.map((event) => (
            <div key={event._id} className="item">
              <img
                src="https://dummyimage.com/100" 
                alt={event.eventName}
                className="item-img"
              />
              <h3 className="item-title">
                <Link href={`/events/${event._id}`}>{event.eventName}</Link> 
              </h3>
              <p className="item-description">
                {`Event in ${event.location} on ${new Date(event.date).toLocaleDateString()}`}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
