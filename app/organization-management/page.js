"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams} from "next/navigation";
import { FiTrash2, FiCamera, FiEdit, FiCheck, FiX, FiMail, FiPhone, FiMapPin, FiGlobe, FiUser } from "react-icons/fi";
import { MdEvent, MdHistory, MdStar, MdBusiness } from "react-icons/md";
import Loader from "@components/Loader";



export default function OrganizerProfile() {
  const { data: session } = useSession();
  
  const searchParams = useSearchParams();
  const organizerId = searchParams.get("id")|| session?.user?.id;;
  const [organizer, setOrganizer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState({});
  const [isEditingAchievements, setIsEditingAchievements] = useState(false);
  const [tempAchievements, setTempAchievements] = useState("");
  const [file, setFile] = useState([]);
  const DEFAULT_PICTURE = "/images/org.png";
  const fileInputRef = useRef(null); 
  const router = useRouter();

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

    useEffect(() => {
    const fetchEvents = async () => {
        try {
            const fetchUpcoming = fetch(`/api/event-preview?organizerId=${organizerId}&type=upcoming&limit=3`);
            const fetchPast = fetch(`/api/event-preview?organizerId=${organizerId}&type=past&limit=3`);

        const [upcomingRes, pastRes] = await Promise.all([fetchUpcoming, fetchPast]);

        if (!upcomingRes.ok || !pastRes.ok) {
            throw new Error("Failed to fetch events");
        }

        const upcomingData = await upcomingRes.json();
        const pastData = await pastRes.json();

        setUpcomingEvents(upcomingData);
        setPastEvents(pastData);
        } catch (error) {
        console.error("Error fetching events:", error);
        }
    };

    fetchEvents();
    }, [organizerId]);

    useEffect(() => {
        const fetchOrganizerProfile = async () => {
            if (session === undefined) return;

            if (!session?.user?.id) {
                router.push("/login");
                return;
            }

            try {
                const response = await fetch(`/api/profile?id=${organizerId}`);
                
                if (!response.ok) {
                    throw new Error("Failed to fetch organizer data");
                }

                const data = await response.json();
                setOrganizer(data);
                setTempProfile({
                    organizationName: data.organizationName,
                    email: data.email,
                    phone: data.phone,
                    location: data.location,
                    bio: data.bio,
                    website: data.website || "",
                    profilePicture: data.profilePicture || DEFAULT_PICTURE
                });
            } catch (error) {
                console.error("Error fetching organizer data:", error);
                setError("Failed to load organizer data.");
            } finally {
                setLoading(false);
            }

        };

        fetchOrganizerProfile();
    }, [session, organizerId, router]);


    const isOwner = session?.user?.id === organizerId;

    const handleFileButtonClick = () => {
        fileInputRef.current.click();  
    };

    const handleProfilePictureChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64String = reader.result;
            setTempProfile((prev) => ({ ...prev, profilePicture: base64String }));
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleProfileEditClick = () => {
        setIsEditingProfile(true);
    };

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const isValidWebsite = (url) => {
        const urlPattern = /^(https?:\/\/)?(www\.)?([\w-]+\.)+(com|ca|net|org|edu|gov|mil|io|info|biz)(\/\S*)?$/i;
        return urlPattern.test(url);
    };
    
    const handleProfileSaveClick = async () => {
        if (tempProfile.organizationName === "") {
            alert("Organization name cannot be left blank.");
            return;
        }
    
        if (!isValidEmail(tempProfile.email)) {
            alert("Please enter a valid email address.");
            return;
        }
    
        if (tempProfile.website) {
            if (!isValidWebsite(tempProfile.website)) {
                alert("Please enter a valid website URL.");
                return;
            }
    
            if (!tempProfile.website.startsWith("http://") && !tempProfile.website.startsWith("https://")) {
                tempProfile.website = `https://${tempProfile.website}`;
            }
        }
        
        try {
            const response = await fetch(`/api/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: session.user.id, ...tempProfile }),
            });
    
            if (!response.ok) {
                if (response.status === 409) {
                    const data = await response.json();
                    alert(data.message); 
                } else {
                    console.error("Failed to update profile:", await response.text());
                    throw new Error("Failed to update profile");
                }
                return;
            }
    
            const updatedData = await response.json();
            setOrganizer(updatedData); 
            setIsEditingProfile(false); 
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("There was an error saving your profile. Please try again.");
        }
    };
    
    const handleProfileCancelClick = () => {
        setTempProfile({
            organizationName: organizer.organizationName,
            email: organizer.email,
            phone: organizer.phone,
            location: organizer.location,
            bio: organizer.bio,
            website: organizer.website || "",
            profilePicture: organizer.profilePicture || DEFAULT_PICTURE
        });
        setIsEditingProfile(false);
    };

    const handleProfileChange = (field, value) => {
        setTempProfile((prev) => ({ ...prev, [field]: value }));
    };

    const handleEditAchievementsClick = () => {
        setIsEditingAchievements(true);
        setTempAchievements(organizer.achievements?.join("\n"));
    };

    const handleSaveAchievementsClick = async () => {
        try {
            const updatedAchievements = tempAchievements
                .split("\n")
                .map(item => item.trim())
                .filter(item => item !== ""); 
    
            const response = await fetch(`/api/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: session.user.id,
                    achievements: updatedAchievements.length ? updatedAchievements : null, 
                }),
            });
    
            if (!response.ok) {
                console.error("Failed to update achievements:", await response.text());
                throw new Error("Failed to update achievements");
            }
    
            const updatedData = await response.json();
            setOrganizer((prev) => ({
                ...prev,
                achievements: updatedAchievements.length ? updatedAchievements : null,
            }));
            setIsEditingAchievements(false);
        } catch (error) {
            console.error("Error updating achievements:", error);
            alert("There was an error saving your achievements. Please try again.");
        }
    };
    
    const handleCancelAchievementsClick = () => {
        setIsEditingAchievements(false);
        setTempAchievements(organizer.achievements?.join("\n"));
    };

    const handleDeleteProfilePicture = async () => {
        try {
            const response = await fetch(`/api/profile`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: session.user.id, profilePicture: DEFAULT_PICTURE }),
            });

            if (!response.ok) throw new Error("Failed to delete profile picture");

            setOrganizer((prev) => ({ ...prev, profilePicture: DEFAULT_PICTURE }));
            setTempProfile((prev) => ({ ...prev, profilePicture: DEFAULT_PICTURE }));
        } catch (error) {
            console.error("Error deleting profile picture:", error);
            alert("Failed to delete profile picture. Please try again.");
        }
    };

    

    if (loading) return <Loader />
    if (error) return <p>{error}</p>;
    if (!organizer) return <p>No organizer data available.</p>;

    return (
        <div className="profile-page-wrapper">
        <main className="profile-page">
            <section className="profile-card">
                <div className="profile-picture">
                    <img src={tempProfile.profilePicture || DEFAULT_PICTURE} alt="Organizer Profile" />
                    
                   
                    {isOwner && isEditingProfile && (
                        <>
                            <button className="change-picture-button" onClick={handleFileButtonClick}>
                                <FiCamera style={{ marginRight: "8px" }} /> Change Profile Picture
                            </button>
                            <button className="delete-picture-button" onClick={() => setTempProfile((prev) => ({ ...prev, profilePicture: DEFAULT_PICTURE }))}>
                                <FiTrash2 /> Reset Profile Picture
                            </button>
                        </>
                    )}
                    
                   
                    <input
                        type="file"
                        className="filepond"
                        name="filepond"
                        accept="image/png, image/jpeg, image/gif"
                        ref={fileInputRef}
                        onChange={handleProfilePictureChange}
                        style={{ display: 'none' }}
                    />

                    
                    </div>


                    <div className="profile-info">
                    <h1 className="profile-name">
                        <MdBusiness className="icon name-icon" /> 
                        {isOwner && isEditingProfile ? (
                            <input
                                type="text"
                                value={tempProfile.organizationName || ""}
                                onChange={(e) => setTempProfile((prev) => ({ ...prev, organizationName: e.target.value }))}
                            />
                        ) : (
                            organizer.organizationName || (
                                <span className="placeholder-text">
                                    {isOwner ? "Add Organization Name" : "No Organization Name"}
                                </span>
                            )
                        )}
                    </h1>

                    <div className="contact-info">
                        <p>
                            <FiMail className="icon" />
                            {isEditingProfile ? (
                                <input
                                    type="email"
                                    value={tempProfile.email || ""}
                                    onChange={(e) => handleProfileChange("email", e.target.value)}
                                />
                            ) : (
                                organizer.email || (
                                    <span className="placeholder-text">
                                        {isOwner ? "Add Email" : "No Email"}
                                    </span>
                                )
                            )}
                        </p>
                        <p>
                            <FiPhone className="icon" />
                            {isEditingProfile ? (
                                <input
                                    type="text"
                                    value={tempProfile.phone || ""}
                                    onChange={(e) => handleProfileChange("phone", e.target.value)}
                                    placeholder="Add Phone Number"
                                />
                            ) : (
                                organizer.phone || (
                                    <span className="placeholder-text">
                                        {isOwner ? "Add Phone Number" : "No Phone"}
                                    </span>
                                )
                            )}
                        </p>
                        <p>
                            <FiMapPin className="icon" />
                            {isEditingProfile ? (
                                <input
                                    type="text"
                                    value={tempProfile.location || ""}
                                    onChange={(e) => handleProfileChange("location", e.target.value)}
                                    placeholder="Add Location"
                                />
                            ) : (
                                organizer.location || (
                                    <span className="placeholder-text">
                                        {isOwner ? "Add Location" : "No Location"}
                                    </span>
                                )
                            )}
                        </p>
                        <p>
                        <FiGlobe className="icon" />
                        {isEditingProfile ? (
                            <input
                                type="text"
                                value={tempProfile.website || ""}
                                placeholder="https://example.com"
                                onChange={(e) => handleProfileChange("website", e.target.value)}
                            />
                        ) : organizer.website ? ( // Removed the outer {}
                            <Link href={organizer.website} target="_blank" rel="noopener noreferrer">
                                {organizer.website}
                            </Link>
                        ) : (
                            <span className="placeholder-text">
                                {isOwner ? "Add Website" : "No Website"}
                            </span>
                        )}

                        </p>
                    </div>

                    <div className="profile-bio">
                        <h2>
                            <FiUser className="bio-icon" /> About Us
                        </h2>
                        {isEditingProfile ? (
                            <textarea
                                value={tempProfile.bio || ""}
                                onChange={(e) => handleProfileChange("bio", e.target.value)}
                                rows={3}
                                placeholder="Add Bio"
                            />
                        ) : (
                            <p>
                                {organizer.bio || (
                                    <span className="placeholder-text">
                                        {isOwner ? "Add Bio" : "No Bio"}
                                    </span>
                                )}
                            </p>
                        )}
                    </div>

                    <button
                        className="contact-button"
                        onClick={() => window.location.href = `mailto:${organizer.email}`}
                        >
                            Contact
                    </button>  

                    {isOwner && (
                        <div className="profile-edit-controls">
                            {isEditingProfile ? (
                                <>
                                    <button onClick={handleProfileSaveClick} className="save-button">
                                        <FiCheck />
                                    </button>
                                    <button onClick={handleProfileCancelClick} className="cancel-button">
                                        <FiX /> 
                                    </button>
                                </>
                            ) : (
                                <button onClick={handleProfileEditClick} className="edit-button">
                                    <FiEdit /> 
                                </button>
                            )}
                        </div>
                    )}

                </div>
            </section>

            <div className="bottom-row">
                <section className="info-card">
                <h2><MdEvent className="tile-icon" /> Upcoming Events</h2>
                <div className="event-list">
                    {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event) => (
                        <div className="event-card" key={event._id}>
                        <div className="event-icon-i">
                            <MdEvent className="event-card-icon" />
                        </div>
                        <div className="event-content">
                            <Link href={`/events/${event._id}`}>
                            <h3 className="event-name clickable">{event.eventName}</h3>
                            </Link>
                        </div>
                        </div>
                    ))
                    ) : (
                    <span className="placeholder-text">No upcoming events</span>
                    )}
                </div>
                </section>

                <section className="info-card">
                <h2><MdHistory className="tile-icon" /> Past Events</h2>
                <div className="event-list">
                    {pastEvents.length > 0 ? (
                    pastEvents.map((event) => (
                        <div className="event-card" key={event._id}>
                        <div className="event-icon-i">
                            <MdHistory className="event-card-icon" />
                        </div>
                        <div className="event-content">
                            <Link href={`/events/${event._id}`}>
                            <h3 className="event-name clickable">{event.eventName}</h3>
                            </Link>
                        </div>
                        </div>
                    ))
                    ) : (
                    <span className="placeholder-text">No past events</span>
                    )}
                </div>
                </section>




                <section className="info-card">
                    <h2><MdStar className="tile-icon" /> Achievements</h2>
                    {isOwner && isEditingAchievements ? (
                        <div>
                            <textarea
                                value={tempAchievements}
                                onChange={(e) => setTempAchievements(e.target.value)}
                                rows={5}
                                className="edit-textarea"
                                placeholder="Add achievements, one per line"
                            />
                            <button onClick={handleSaveAchievementsClick} className="save-button"><FiCheck /></button>
                            <button onClick={handleCancelAchievementsClick} className="cancel-button"><FiX /></button>
                        </div>
                    ) : (
                        <div>
                            <ul>
                                {organizer.achievements?.length ? (
                                    organizer.achievements.map((achievement, index) => (
                                        <li key={index}>{achievement}</li>
                                    ))
                                ) : (
                                    <span className="placeholder-text">
                                        {isOwner ? "Add Achievements" : "No Achievements"}
                                    </span>
                                )}
                            </ul>
                            {isOwner && !isEditingAchievements && (
                                <button onClick={handleEditAchievementsClick} className="edit-button"><FiEdit /></button>
                            )}
                        </div>
                    )}
                </section>

            </div>
        </main>
        </div>
    );
}
