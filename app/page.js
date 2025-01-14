"use client";

import { useState, useEffect } from "react";
import EventCard from "@/app/components/EventCard";
import Loader from "@/app/components/Loader";
import Fuse from "fuse.js";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortOption, setSortOption] = useState("soonest");

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
      keys: ["eventName", "organizer.organizationName", "location"], // Search fields
      threshold: 0.1, // Match sensitivity (0.1 is strictest)
    });

    const filteredBySearch = search
      ? fuse.search(search).map((result) => result.item)
      : events;

    const filtered = filteredBySearch.filter((event) => {
      const matchesCity = city ? event.location === city : true;
      const matchesCategory = category ? event.category === category : true;
      return matchesCity && matchesCategory;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortOption === "soonest") return new Date(a.date) - new Date(b.date);
      if (sortOption === "farthest") return new Date(b.date) - new Date(a.date);
      if (sortOption === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOption === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortOption === "category") return a.category.localeCompare(b.category);
      if (sortOption === "organization")
        return a.organizer?.organizationName?.localeCompare(
          b.organizer?.organizationName
        );
      if (sortOption === "city") return a.location.localeCompare(b.location);
      return 0; 
    });

    setFilteredEvents(sorted);
  }, [search, city, category, events, sortOption]);


  

  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;

  return (
    <main className="home-page">
      <section className="events-container">
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
          <select
            className="filter-dropdown"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="soonest">Sort: Near Future</option>
            <option value="farthest">Sort: Distant Future</option>
            <option value="newest">Sort: Recently Added</option>
            <option value="oldest">Sort: Oldest Added</option>
            <option value="category">Sort: Category</option>
            <option value="organization">Sort: Organization</option>
            <option value="city">Sort: City</option>
          </select>
        </div>

        <div className="events-list">
          {filteredEvents.length === 0 ? (
            <p>No events match your criteria.</p>
          ) : (
            [...filteredEvents]
              .map((event) => (
                <EventCard 
                  key={event._id}
                  img={event.organizer?.profilePicture}
                  title={event.eventName}
                  org={event.organizer?.organizationName}
                  date={event.date}
                  category={event.category}
                  location={event.location}
                  link={`/events/${event._id}`}
                />
              ))
          )}
        </div>

      </section>
    </main>
  )
}