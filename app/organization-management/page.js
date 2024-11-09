"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiCamera, FiEdit, FiCheck, FiX, FiMail, FiPhone, FiMapPin, FiGlobe, FiUser } from "react-icons/fi";
import { MdEvent, MdHistory, MdStar, MdBusiness } from "react-icons/md";
import Loader from "@components/Loader";

export default function OrganizerProfile() {
    const { data: session } = useSession();

    const [organizer, setOrganizer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [tempProfile, setTempProfile] = useState({});
    const [isEditingAchievements, setIsEditingAchievements] = useState(false);
    const [tempAchievements, setTempAchievements] = useState("");

    const router = useRouter();

    useEffect(() => {
        const fetchOrganizerProfile = async () => {
            if (session === undefined) return;

            if (!session?.user?.id) {
                router.push("/login");
                return;
            }

            try {
                const response = await fetch(`/api/profile?id=${session.user.id}`);
                
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
                    website: data.website || "" 
                });
            } catch (error) {
                console.error("Error fetching organizer data:", error);
                setError("Failed to load organizer data.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrganizerProfile();
    }, [session, router]);

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
            website: organizer.website || ""
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

    if (loading) return <Loader />
    if (error) return <p>{error}</p>;
    if (!organizer) return <p>No organizer data available.</p>;

    return (
        <main className="profile-page">
            <section className="profile-card">
                <div className="profile-picture">
                    <img src={organizer.profilePicture || "/images/sample_logo.webp"} alt="Organizer Profile" />
                    <button className="change-picture-button">
                        <FiCamera style={{ marginRight: "8px" }} /> Change Profile Picture
                    </button>
                </div>

                <div className="profile-info">
                    <h1 className="profile-name">
                        <MdBusiness className="icon name-icon" /> 
                        {isEditingProfile ? (
                            <input
                                type="text"
                                value={tempProfile.organizationName || ""}
                                onChange={(e) => handleProfileChange("organizationName", e.target.value)}
                            />
                        ) : (
                            organizer.organizationName || <span className="placeholder-text">Add Organization Name</span>
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
                                organizer.email || <span className="placeholder-text">Add Email</span>
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
                                organizer.phone || <span className="placeholder-text">Add Phone Number</span>
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
                                organizer.location || <span className="placeholder-text">Add Location</span>
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
                            ) : (
                                <a href={organizer.website} target="_blank" rel="noopener noreferrer">
                                    {organizer.website || <span className="placeholder-text">Add Website</span>}
                                </a>
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
                            <p>{organizer.bio || <span className="placeholder-text">Add Bio</span>}</p>
                        )}
                    </div>

                    <button className="contact-button">Contact</button>  

                    {isEditingProfile ? (
                        <div className="profile-edit-controls">
                            <button onClick={handleProfileSaveClick} className="save-button"><FiCheck /></button>
                            <button onClick={handleProfileCancelClick} className="cancel-button"><FiX /></button>
                        </div>
                    ) : (
                        <button onClick={handleProfileEditClick} className="edit-button"><FiEdit /></button>
                    )}
                </div>
            </section>

            <div className="bottom-row">
                <section className="info-card">
                    <h2><MdEvent className="tile-icon" /> Upcoming Events</h2>
                    <ul>
                        {organizer.upcomingEvents?.length
                            ? organizer.upcomingEvents.map((event, index) => (
                                <li key={index}>
                                    <strong>{event.name}</strong> - {event.date} at {event.location}
                                </li>
                            ))
                            : <span className="placeholder-text">No upcoming events</span>}
                    </ul>
                </section>

                <section className="info-card">
                    <h2><MdHistory className="tile-icon" /> Past Events</h2>
                    <ul>
                        {organizer.pastEvents?.length
                            ? organizer.pastEvents.map((event, index) => (
                                <li key={index}>
                                    <strong>{event.name}</strong>: {event.volunteers || event.fundsRaised} | {event.impact}
                                </li>
                            ))
                            : <span className="placeholder-text">No past events</span>}
                    </ul>
                </section>

                <section className="info-card">
                    <h2><MdStar className="tile-icon" /> Achievements</h2>
                    {isEditingAchievements ? (
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
                                {organizer.achievements?.length
                                    ? organizer.achievements.map((achievement, index) => (
                                        <li key={index}>{achievement}</li>
                                    ))
                                    : <span className="placeholder-text">Add Achievements</span>}
                            </ul>
                            <button onClick={handleEditAchievementsClick} className="edit-button"><FiEdit /></button>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
