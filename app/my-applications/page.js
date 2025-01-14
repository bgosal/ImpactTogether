"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { FiCalendar, FiClock, FiMapPin, FiX } from "react-icons/fi";
import Loader from "@/app/components/Loader";

export default function ApplicationManagementList() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState([]);
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

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);




  const applicationsPerPage = 3;

  useEffect(() => {
    const fetchApplications = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(`/api/event?userId=${encodeURIComponent(session.user.id)}`);
        if (!response.ok) throw new Error("Failed to fetch applications");

        const data = await response.json();
        setApplications(data);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [session]);

  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;

  const currentDate = new Date();

  const filteredApplications = applications.filter((application) => {
    const eventDate = new Date(application.date);
    const matchesLocation = locationFilter === "All" || application.location === locationFilter;
    const matchesType = typeFilter === "All" || application.type === typeFilter;
    const withinDateRange =
      (!startDate || new Date(startDate) <= eventDate) && (!endDate || new Date(endDate) >= eventDate);
    return matchesLocation && matchesType && withinDateRange;
  });

  const sortedApplications = filteredApplications.sort((a, b) => {
    if (sortBy === "date") return new Date(a.date) - new Date(b.date);
    if (sortBy === "name") return a.eventName.localeCompare(b.eventName);
    if (sortBy === "location") return a.location.localeCompare(b.location);
    return 0;
  });

  const upcomingApplications = sortedApplications.filter((application) => new Date(application.date) >= currentDate);
  const pastApplications = sortedApplications.filter((application) => new Date(application.date) < currentDate);

  const totalUpcomingPages = Math.ceil(upcomingApplications.length / applicationsPerPage);
  const paginatedUpcomingApplications = upcomingApplications.slice(
    (upcomingPage - 1) * applicationsPerPage,
    upcomingPage * applicationsPerPage
  );

  const totalPastPages = Math.ceil(pastApplications.length / applicationsPerPage);
  const paginatedPastApplications = pastApplications.slice(
    (pastPage - 1) * applicationsPerPage,
    pastPage * applicationsPerPage
  );

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
    return date.toISOString().split('T')[0]; 
  ß};

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

  const handleCancelApplication = async (eventId) => {
    try {
      const response = await fetch(`/api/event?eventId=${encodeURIComponent(eventId)}&userId=${encodeURIComponent(session.user.id)}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to cancel application");

      setApplications(applications.filter((application) => application._id !== eventId));
    } catch (err) {
      console.error("Error canceling application:", err);
      alert("Failed to cancel application. Please try again.");
    }
  };


  const openCancelModal = (applicationId) => {
    setSelectedApplicationId(applicationId);
    setShowCancelModal(true);
  };
  
  const closeCancelModal = () => {
    setSelectedApplicationId(null);
    setShowCancelModal(false);
  };
  
  const confirmCancelApplication = async () => {
    try {
      const response = await fetch(
        `/api/event?eventId=${encodeURIComponent(selectedApplicationId)}&userId=${encodeURIComponent(session.user.id)}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to cancel application");
  
      
      setApplications(applications.filter((application) => application._id !== selectedApplicationId));
      closeCancelModal(); 
  
      
      setShowSuccessMessage(true);
  
      
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000); 
    } catch (err) {
      console.error("Error canceling application:", err);
      alert("Failed to cancel application. Please try again.");
    }
  };
  

  return (
    <main>
      <div className="title-container">
        <header className="manage-events-heading">Manage Applications</header>
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
        <header
          className="events-section-heading upcoming-heading"
          onClick={() => setShowUpcoming(!showUpcoming)}
        >
          Upcoming Events {showUpcoming ? "▲" : "▼"}
        </header>
        {showUpcoming && paginatedUpcomingApplications.length > 0 ? (
          <>
            <ul className="events-section-list">
              {paginatedUpcomingApplications.map((application) => (
                <li key={application._id} className="event-item">
                  <Link href={`/events/${application._id}`}>
                    <h3>{application.eventName}</h3>
                  </Link>
                  <div className="event-detail">
                    <FiCalendar /> {formatDate(application.date)}
                  </div>
                  <div className="event-detail">
                    <FiClock /> {formatTime(application.startTime)}
                  </div>
                  <div className="event-detail">
                    <FiMapPin /> {application.location}
                  </div>
                  <button
                    className="cancel-app-event-button"
                    onClick={() => openCancelModal(application._id)}
                  >
                    <FiX /> Cancel Application
                  </button>

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
        {showPast && paginatedPastApplications.length > 0 ? (
          <>
            <ul className="events-section-list">
              {paginatedPastApplications.map((application) => (
                <li key={application._id} className="event-item">
                  <Link href={`/events/${application._id}`}>
                    <h3>{application.eventName}</h3>
                  </Link>
                  <div className="event-detail">
                    <FiCalendar /> {formatDate(application.date)}
                  </div>
                  <div className="event-detail">
                    <FiClock /> {formatTime(application.startTime)}
                  </div>
                  <div className="event-detail">
                    <FiMapPin /> {application.location}
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

        {showCancelModal && (
          <div className="modal-overlay">
            <div className="modal">
              <p>Are you sure you want to cancel this application?</p>
              <div className="modal-buttons">
                <button onClick={confirmCancelApplication} className="confirm-button">
                  Yes
                </button>
                <button onClick={closeCancelModal} className="cancel-button-app">
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {showSuccessMessage && (
          <div className="success-message">
            <p>Your application has been successfully canceled!</p>
          </div>
        )}


      </section>
    </main>
  );
}
