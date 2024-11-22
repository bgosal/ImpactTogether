"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { FiCalendar, FiClock, FiMapPin, FiTrash } from "react-icons/fi";
import Loader from "@components/Loader";

export default function OrganizerEventsList() {
  const { data: session } = useSession();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showUpcoming, setShowUpcoming] = useState(false);
  const [showPast, setShowPast] = useState(false);

  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);

  const [locationFilter, setLocationFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("date");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);

  const [event, setEvent] = useState();

  const eventsPerPage = 3;

  useEffect(() => {
    const fetchEvents = async () => {
      if (!session?.user?.id) return;
  
      try {
        const response = await fetch(`/api/event?organizerId=${encodeURIComponent(session.user.id)}`);
        if (!response.ok) throw new Error("Failed to fetch events");
  
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchEvents();
  }, [session]);
  

  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;

  const currentDate = new Date();


  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    const matchesLocation = locationFilter === "All" || event.location === locationFilter;
    const matchesType = typeFilter === "All" || event.type === typeFilter;
    const withinDateRange = (!startDate || new Date(startDate) <= eventDate) && (!endDate || new Date(endDate) >= eventDate);
    return matchesLocation && matchesType && withinDateRange;
  });

  const sortedEvents = filteredEvents.sort((a, b) => {
    if (sortBy === "date") return new Date(a.date) - new Date(b.date);
    if (sortBy === "name") return a.eventName.localeCompare(b.eventName);
    if (sortBy === "location") return a.location.localeCompare(b.location);
    return 0;
  });

  const upcomingEvents = sortedEvents.filter((event) => new Date(event.date) >= currentDate);
  const pastEvents = sortedEvents.filter((event) => new Date(event.date) < currentDate);

  const totalUpcomingPages = Math.ceil(upcomingEvents.length / eventsPerPage);
  const paginatedUpcomingEvents = upcomingEvents.slice((upcomingPage - 1) * eventsPerPage, upcomingPage * eventsPerPage);

  const totalPastPages = Math.ceil(pastEvents.length / eventsPerPage);
  const paginatedPastEvents = pastEvents.slice((pastPage - 1) * eventsPerPage, pastPage * eventsPerPage);

  const handleNextPage = (section) => {
    if (section === "upcoming" && upcomingPage < totalUpcomingPages) setUpcomingPage(upcomingPage + 1);
    if (section === "past" && pastPage < totalPastPages) setPastPage(pastPage + 1);
  };

  const handlePreviousPage = (section) => {
    if (section === "upcoming" && upcomingPage > 1) setUpcomingPage(upcomingPage - 1);
    if (section === "past" && pastPage > 1) setPastPage(pastPage - 1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  };

  const toggleFilterPanel = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleParticipants = async (selectedEvent) => {
    
    try {
      const response = await fetch(`/api/event?id=${encodeURIComponent(selectedEvent._id)}`);
      if (response.ok) {
        const eventData = await response.json();
        setEvent(eventData);  
        setIsParticipantsOpen(true);
      } else {
        console.error("Failed to fetch participants");
      }
    } catch (err) {
      console.error("Error fetching participants:", err);
    }
  };


  const closeParticipants = () => {
    setIsParticipantsOpen(false);
  };

  
  

  return (
    <main>
      
      {isParticipantsOpen && (
  <div className="popup-overlay">
    <div className="popup">
      <button className="close-popup" onClick={closeParticipants}>
        X
      </button>

      <h2 style={{ background: "none" }}>Participants</h2>

      <div className="participants-list">
        {event?.participants?.length > 0 ? (
          event.participants.map((participant) => (
            <div key={participant._id} className="participant-item">
              <Image
                src={participant.profilePicture || "/images/stock_pp.png"}
                alt={`${participant.firstname} ${participant.lastname}`}
                width={100}
                height={100}
                className="participant-image"
              />
              <div className="participant-info">
                <h3 className="participant-name">
                  <Link href={`/account-management?id=${participant._id}`}>
                    {participant.firstname} {participant.lastname}
                  </Link>
                </h3>
              </div>
            </div>
          ))
        ) : (
          <p>No participants yet.</p>
        )}
      </div>

          </div>
        </div>
      )}

            

      <div className="title-container">
        <header className="manage-events-heading">Manage Events</header>
      </div>
      
      <div className="filter-header">
        <button className="filter-toggle" onClick={toggleFilterPanel}>
          Filter
        </button>
      </div>
     
      {isFilterOpen && (
        <div className="filter-panel">
          <label>
            Location:
            <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="Abbotsford">Abbotsford</option>
                <option value="Burnaby">Burnaby</option>
                <option value="Coquitlam">Coquitlam</option>
                <option value="Delta">Delta</option>
                <option value="Langley">Langley</option>
                <option value="Richmond">Richmond</option>
                <option value="Surrey">Surrey</option>
                <option value="Vancouver">Vancouver</option>
            </select>
          </label>

          {/* <label>
            Event Type:
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="Animal_Care">Animal Care</option>
                <option value="Arts">Arts & Culture</option>
                <option value="Community">Community</option>
                <option value="Education">Education</option>
                <option value="Environment">Environment</option>
                <option value="Food">Food</option>
                <option value="Health">Health</option>
                <option value="Youth">Youth</option>
            </select>
          </label> */}

          <label>
            Start Date:
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </label>

          <label>
            End Date:
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </label>

          <label>
            Sort By:
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date">Date</option>
              <option value="name">Name</option>
              <option value="location">Location</option>
            </select>
          </label>
        </div>
      )}
    
      <section className="events-section">
        <header className="events-section-heading upcoming-heading" onClick={() => setShowUpcoming(!showUpcoming)}>
          Upcoming Events {showUpcoming ? "▲" : "▼"}
        </header>
        {showUpcoming && paginatedUpcomingEvents.length > 0 ? (
          <>
            <ul className="events-section-list">
              {paginatedUpcomingEvents.map((event) => (
                <li key={event._id} className="event-item">
                  <Link href={`/events/${event._id}`}>
                    <h3>{event.eventName}</h3>
                  </Link>
                  <div className="event-detail">
                    <FiCalendar /> {formatDate(event.date)}
                  </div>
                  <div className="event-detail">
                    <FiClock /> {formatTime(event.startTime)}
                  </div>
                  <div className="event-detail">
                    <FiMapPin /> {event.location}
                  </div>
                  <div className="event-buttons">
                                        {/* <div>
                                      <Link href={`/events/${event._id}?edit=true`}>
                    
                        <button className="edit-event-button">Edit Event</button>
                      
                    </Link>
                    </div> */}

                    <button 
                      onClick={() => handleParticipants(event)}  
                      className="view-participants-button"
                    >
                      View Participants
                    </button>
                    {/* <button className="cancel-event-button">Cancel Event</button> */}
                  </div>

                </li>
              ))}
            </ul>
            <div className="pagination-container">
              <div className="pagination">
                <button onClick={() => handlePreviousPage("upcoming")} disabled={upcomingPage === 1}>
                  Previous
                </button>
                <span>Page {upcomingPage} of {totalUpcomingPages}</span>
                <button onClick={() => handleNextPage("upcoming")} disabled={upcomingPage === totalUpcomingPages}>
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          showUpcoming && <p>No upcoming events.</p>
        )}
      </section>

      <section className="events-section">
        <header className="events-section-heading past-heading" onClick={() => setShowPast(!showPast)}>
          Past Events {showPast ? "▲" : "▼"}
        </header>
        {showPast && paginatedPastEvents.length > 0 ? (
          <>
            <ul className="events-section-list">
              {paginatedPastEvents.map((event) => (
                <li key={event._id} className="event-item">
                  <Link href={`/events/${event._id}`}>
                    <h3>{event.eventName}</h3>
                  </Link>
                  <div className="event-detail">
                    <FiCalendar /> {formatDate(event.date)}
                  </div>
                  <div className="event-detail">
                    <FiClock /> {formatTime(event.startTime)}
                  </div>
                  <div className="event-detail">
                    <FiMapPin /> {event.location}
                  </div>
                  <div className="event-buttons">
                    
                    <button 
                      onClick={() => handleParticipants(event)}  
                      className="view-participants-button"
                    >
                      View Participants
                    </button>
                    
                  </div>
                </li>
              ))}
            </ul>
            <div className="pagination-container">
              <div className="pagination">
                <button onClick={() => handlePreviousPage("past")} disabled={pastPage === 1}>
                  Previous
                </button>
                <span>Page {pastPage} of {totalPastPages}</span>
                <button onClick={() => handleNextPage("past")} disabled={pastPage === totalPastPages}>
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          showPast && <p>No past events.</p>
        )}
      </section>
    </main>
  );
}
