"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react"; 
import Image from "next/image";
import Link from "next/link";
import { FiCheck, FiMail, FiCalendar, FiClock, FiMapPin, FiInfo, FiList, FiFileText, FiEdit, FiX } from "react-icons/fi";
import { FiBriefcase, FiHeart, FiCoffee, FiUsers, FiBook, FiGlobe, FiBox, FiActivity, FiSmile } from "react-icons/fi";
import { MdEvent, MdBusiness } from "react-icons/md";
import Loader from "@components/Loader";

export default function EventDetails() {
  const { data: session } = useSession(); 
  const router = useRouter();
  const { id } = useParams();  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [organizationName, setOrganizationName] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null); 
  const [isEditing, setIsEditing] = useState(false);
  const [tempEvent, setTempEvent] = useState({});
  const [isOrganizer, setIsOrganizer] = useState(false); 
  const [hasApplied, setHasApplied] = useState(false); 
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); 
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [showCancelConfirmationModal, setShowCancelConfirmationModal] = useState(false);
  const [applicationCancelled, setApplicationCancelled] = useState(false); 


  const categoryIcons = {
    Animal_Care: <FiHeart />,
    Arts: <FiSmile />,
    Community: <FiUsers />,
    Education: <FiBook />,
    Environment: <FiGlobe />, 
    Food: <FiCoffee />,
    Health: <FiActivity />,
    Youth: <FiBox />,
  };
  


  useEffect(() => {
    if (!id) return;
  
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/event?id=${id}`);
        if (!response.ok) throw new Error("Failed to fetch event details");
  
        const data = await response.json();
        setEvent(data);
        setTempEvent(data);
  
        console.log("Participants in Event:", data.participants);
  
   
        if (session?.user?.id && data.participants.some(p => p._id === session.user.id)) {
          setHasApplied(true);
          console.log("User has already applied");
        }
  
        if (session?.user?.id && data.organizer === session.user.id) {
          setIsOrganizer(true);
        }
  
        if (data.organizer) {
          const orgResponse = await fetch(`/api/profile?id=${data.organizer}`);
          if (orgResponse.ok) {
            const orgData = await orgResponse.json();
            setOrganizationName(orgData.organizationName);
            setProfilePicture(orgData.profilePicture || "/images/sample_logo.webp"); 
          }
        }
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchEvent();
  }, [id, session]);
  
const isVolunteer = session?.user?.role !== "organizer";
  const handleApply = async () => {
    if (!session) {
      router.push("/login");
      return;
    }
  
    try {
      const response = await fetch(`/api/event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: id,
          userId: session?.user?.id,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to apply to the event");
      }
  
      setApplicationSubmitted(true); 
  
  
      setTimeout(() => {
        window.location.reload(); 
      }, 5000); 
    } catch (err) {
      console.error("Error applying to event:", err);
      alert("An error occurred while submitting your application. Please try again.");
    }
  };
  
  
  const handleDeleteApplication = async () => {
    try {
      const response = await fetch(`/api/event?eventId=${id}&userId=${session?.user?.id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to cancel the application");
      }
  
      const data = await response.json();
      console.log("Application canceled:", data);
      setShowCancelConfirmationModal(false);
      setApplicationCancelled(true); 
  

      setTimeout(() => {
        window.location.reload(); 
      }, 5000); 
    } catch (err) {
      console.error("Error canceling application:", err);
      alert("An error occurred while canceling your application. Please try again.");
    }
  };
  
  


  const handleEditClick = () => setIsEditing(true);

  const handleCancelClick = () => {
    setIsEditing(false);
    setTempEvent(event);
  };

  const handleSaveClick = async () => {

    if (
      !tempEvent.eventName ||
      !tempEvent.date ||
      !tempEvent.startTime ||
      !tempEvent.address ||
      !tempEvent.location
    ) {
      alert("Please fill in all required fields: Event Name, Date, Time, Address, and Location.");
      return;
    }

    try {
      const response = await fetch(`/api/event`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...tempEvent }),
      });
      if (!response.ok) throw new Error("Failed to update event details");

      const updatedEvent = await response.json();
      setEvent(updatedEvent);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating event:", err);
      alert("There was an error saving your changes. Please try again.");
    }
  };

  const handleChange = (field, value) => {
    setTempEvent((prev) => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`; 
  };

  const minDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const formatTime12Hour = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12; 
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const isPastEvent = event && new Date(event.date) < new Date();

  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;
  if (!event) return <p>No event details available.</p>;

  return (
    <main>
      <div className="event-details-container">
        <section className="event-header">
          <div className="back-button">
            <Link href="/event-management"></Link>
          </div>
          <div className="event-logo">
          <Image
              src={profilePicture}  
              alt={`${event.eventName} Logo`}
              width="150"
              height="150"
            />
          </div>
          <div className="event-title-info">
            <header className="event-title-header">
              {isEditing ? (
                <div className="event-title-edit">
                <MdEvent className="event-title-icon" />
                <input
                  type="text"
                  value={tempEvent.eventName || ""}
                  onChange={(e) => handleChange("eventName", e.target.value)}
                  className="event-title-input"
                  required
                />
              </div>
              ) : (
                <div className="event-title">
                <MdEvent className="event-title-icon" /> {event.eventName}
              </div>
                      )}
                    </header>

              <div className="organization-info">
                <MdBusiness className="organization-icon" />
                <p className="organization-name">{organizationName || "Organizer"}</p>
              </div>
            {isEditing ? (
              <select
              
                value={tempEvent.category || ""}
                onChange={(e) => handleChange("category", e.target.value)}
                className="select-field"
                required
              >
                <option value="">Select Category</option>
                <option value="Animal_care">Animal Care</option>
                <option value="Arts">Arts & Culture</option>
                <option value="Community">Community</option>
                <option value="Education">Education</option>
                <option value="Environment">Environment</option>
                <option value="Food">Food</option>
                <option value="Health">Health</option>
                <option value="Youth">Youth</option>
              </select>
            ) : (
             
              <p className="event-category">
                {categoryIcons[event.category]} {event.category.replace(/_/g, ' ')}
              </p>
            )}
            
            <div className="button-group">
              
            {!isPastEvent && !isOrganizer && isVolunteer && !hasApplied && (
                <button
                  className="apply-now-button"
                  onClick={() => {
                    if (!session) {
                      router.push("/login");
                    } else {
                      setShowConfirmationModal(true);
                    }
                  }}
                >
                  <FiCheck /> Apply Now
                </button>
              )}

              
              {!isPastEvent && hasApplied && (
                <button
                  className="cancel-application-button"
                  onClick={() => setShowCancelConfirmationModal(true)}
                >
                  <FiX /> Cancel Application
                </button>
                          
              )}

              <button className="contact-button"><FiMail /> Contact</button>

              
              {!isPastEvent && isOrganizer && (
                isEditing ? (
                  <>
                    <button onClick={handleSaveClick} className="save-button"><FiCheck /> Save</button>
                    <button onClick={handleCancelClick} className="cancel-button"><FiX /> Cancel</button>
                  </>
                ) : (
                  <button onClick={handleEditClick} className="event-edit-button"><FiEdit /> Edit</button>
                )
              )}
            </div>

          </div>
        </section>
        
        <section className="event-info">
          <div className="event-details">
            <header className="overview-heading"><FiInfo className="header-icon" /> Event Overview</header>
            <div className="event-detail">
              <FiCalendar className="event-icon" /> 
              {isEditing ? (
                <input
                  type="date"
                  value={tempEvent.date || ""}
                  placeholder={formatDate(event.date)}
                  min={minDate()}
                  onChange={(e) => handleChange("date", e.target.value)}
                  required
                />
              ) : (
                formatDate(event.date)
              )}
            </div>
            <div className="event-detail">
              <FiClock className="event-icon" /> 
              {isEditing ? (
                <input
                  type="time"
                  value={tempEvent.startTime || ""}
                  onChange={(e) => handleChange("startTime", e.target.value)}
                  required
                />
              ) : (
                formatTime12Hour(tempEvent.startTime)
              )}
            </div>
            <div className="event-detail">
              <FiMapPin className="event-icon" />
              {isEditing ? (
                <div className="address-location-container">
                  <input
                    type="text"
                    className="address-input"
                    value={tempEvent.address || ""}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="Add Address"
                    required
                  />
                  <select
                    
                    value={tempEvent.location || ""}
                    onChange={(e) => handleChange("location", e.target.value)}
                    className="select-field"
                    required
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
              ) : (
                `${event.address}, ${event.location}`
              )}
            </div>


            <div className="event-requirements">
              <header className="requirements-heading"><FiList className="header-icon" /> Requirements</header>
              {isEditing ? (
                <textarea
                  value={tempEvent.requirements?.join("\n") || ""}
                  onChange={(e) => handleChange("requirements", e.target.value.split("\n"))}
                  rows={3}
                  placeholder="Add requirements, one per line"
                />
              ) : event.requirements && event.requirements.length > 0 && event.requirements[0] !== "" ? (
                <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
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
              {isEditing ? (
                <textarea
                  value={tempEvent.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="description-textarea"
                  rows={5}
                  placeholder="Add event description"
                />
              ) : (
                <p className="description-content">{event.description}</p>
              )}
            </div>

        </section>
      </div>
      {showConfirmationModal && (
          <div className="modal-overlay">
            <div className="modal">
              <button
                className="close-modal"
                onClick={() => setShowConfirmationModal(false)}
              >
                &times;
              </button>
              <h2 className="modal-header">Confirm Application</h2>
              <p className="modal-content">Are you sure you want to apply for this event?</p>
              <div className="modal-buttons">
                <button
                  className="confirm-button"
                  onClick={() => {
                    handleApply();
                    setShowConfirmationModal(false);
                  }}
                >
                  Yes
                </button>
                <button
                  className="cancel-button-app"
                  onClick={() => setShowConfirmationModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        
      {showCancelConfirmationModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button
              className="close-modal"
              onClick={() => setShowCancelConfirmationModal(false)}
            >
              &times;
            </button>
            <h2 className="modal-header">Cancel Application</h2>
            <p className="modal-content">Are you sure you want to cancel your application?</p>
            <div className="modal-buttons">
              <button
                className="confirm-button"
                onClick={handleDeleteApplication}
              >
                Yes
              </button>
              <button
                className="cancel-button-app"
                onClick={() => setShowCancelConfirmationModal(false)}
              >
                No
              </button>
            </div>
          </div>
          </div>
      )}


        {applicationSubmitted && (
          <div className="success-message">
            <p>Your application has been submitted successfully!</p>
            <button onClick={() => window.location.reload()}>OK</button>
          </div>
        )}

        {applicationCancelled && (
          <div className="success-message">
            <p>Your application has been successfully cancelled!</p>
            <button onClick={() => window.location.reload()}>OK</button>
          </div>
        )}


    </main>
  );
}
    
