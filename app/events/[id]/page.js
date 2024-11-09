"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiCheck, FiMail, FiCalendar, FiClock, FiMapPin, FiInfo, FiList, FiFileText } from "react-icons/fi";
import Loader from "@components/Loader";

export default function EventDetails() {
  const router = useRouter();
  const { id } = useParams();  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/event?id=${id}`);
        if (!response.ok) throw new Error("Failed to fetch event details");

        const data = await response.json();
        setEvent(data);
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

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

  if (loading) return <Loader />
  if (error) return <p>{error}</p>;
  if (!event) return <p>No event details available.</p>;

  return (
    <main>
      <div className="event-details-container">
        <section className="event-header">
          <div className="back-button">
            <Link href="/event-management">
              
            </Link>
          </div>

          <div className="event-logo">
            <Image
              src="/images/sample_logo.webp" 
              alt={`${event.eventName} Logo`} 
              className="round-logo" 
              width="150" 
              height="150"
            />
          </div>
            
          <div className="event-title-info">
            <h1 className="event-title">{event.eventName}</h1>
            <p className="organization-name">{event.organizerName || "Organizer"}</p>
            <div className="button-group">
              <Link href="/apply">
                <button className="apply-now-button">
                  <FiCheck /> Apply Now
                </button>
              </Link>
              <button className="contact-button">
                <FiMail /> Contact
              </button>        
            </div>
          </div>
        </section>

        <section className="event-info">
          <div className="event-details">
            <header className="overview-heading">
              <FiInfo className="header-icon" /> Event Overview
            </header>
            <div className="event-detail">
              <FiCalendar className="event-icon" /> {formatDate(event.date)}
            </div>
            <div className="event-detail">
              <FiClock className="event-icon" /> {formatTime(event.startTime)}
            </div>
            <div className="event-detail">
              <FiMapPin className="event-icon" /> {event.address}, {event.location}
            </div>

           
            <div className="event-requirements">
              <header className="requirements-heading">
                <FiList className="header-icon" /> Requirements
              </header>
              {event.requirements && event.requirements.length > 0 ? (
                <ul>
                  {event.requirements.map((requirement, index) => (
                    <li key={index}>{requirement}</li>
                  ))}
                </ul>
              ) : (
                <p>No specific requirements listed for this event.</p>
              )}
            </div>
          </div>
              
          <div className="event-description">
            <header className="description-heading">
              <FiFileText className="header-icon" /> Description
            </header>
            <p>{event.description}</p>
          </div>
        </section>
      </div>      
    </main>
  );
}
