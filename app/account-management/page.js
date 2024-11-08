"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FiUserCheck, FiCamera, FiMail, FiPhone, FiMapPin, FiUser, FiEdit, FiCheck, FiX } from "react-icons/fi";
import { MdEvent, MdSchool, MdLanguage, MdStar, MdCheckCircle, MdHistory, MdFavorite, MdFlag } from "react-icons/md";

export default function Profile() {
    const { data: session } = useSession();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [tempUser, setTempUser] = useState({});
    const [editStates, setEditStates] = useState({});

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (session === undefined) return;
            if (!session?.user?.id) {
                setError("User not authenticated");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/auth/profile?id=${session.user.id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }
                const data = await response.json();
                setUser(data);
                setTempUser({
                    firstname: data.firstname,
                    lastname: data.lastname,
                    email: data.email,
                    phone: data.phone,
                    location: data.location,
                    bio: data.bio,
                    interests: data.interests,
                    skills: data.skills,
                    availability: data.availability,
                    achievements: data.achievements,
                    certifications: data.certifications,
                    languages: data.languages,
                    goals: data.goals,
                    upcomingEvents: data.upcomingEvents,
                    recentEvent: data.recentEvent,
                });
            } catch (error) {
                console.error("Error fetching profile data:", error);
                setError("Failed to load profile data.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [session]);

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleProfileSaveClick = async () => {
        if (!tempUser.firstname || !tempUser.lastname) {
            alert("Both First and Last Name cannot be left blank.");
            return;
        }
    
        if (!isValidEmail(tempUser.email)) {
            alert("Please enter a valid email address.");
            return;
        }

        try {
            const response = await fetch(`/api/auth/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: session.user.id, ...tempUser }),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            const updatedData = await response.json();
            setUser(updatedData);
            setIsEditingProfile(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("There was an error saving your profile. Please try again.");
        }
    };

    const handleProfileEditClick = () => {
        setIsEditingProfile(true);
    };

    const handleProfileCancelClick = () => {
        setTempUser({ ...user });
        setIsEditingProfile(false);
    };

    const handleInputChange = (field, value) => {
        setTempUser((prev) => ({ ...prev, [field]: value }));
    };

    const handleTileEditClick = (field) => {
        setEditStates((prev) => ({ ...prev, [field]: true }));
    };

    const handleTileSaveClick = async (field) => {
        const updatedValue = tempUser[field]?.filter(item => item.trim() !== "") || []; 
    
        try {
            const response = await fetch(`/api/auth/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: session.user.id,
                    [field]: updatedValue.length ? updatedValue : null, 
                }),
            });
    
            if (!response.ok) {
                throw new Error("Failed to update profile");
            }
    
            const updatedData = await response.json();
            setUser((prev) => ({ ...prev, [field]: updatedData[field] }));
            setEditStates((prev) => ({ ...prev, [field]: false }));
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("There was an error saving your profile. Please try again.");
        }
    };
    

    const handleTileCancelClick = (field) => {
        setTempUser((prev) => ({ ...prev, [field]: user[field] }));
        setEditStates((prev) => ({ ...prev, [field]: false }));
    };

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p>{error}</p>;
    if (!user) return <p>No profile data available.</p>;

    const fullName = `${tempUser.firstname || ""} ${tempUser.lastname || ""}`.trim();

    return (
        <main className="profile-page">
            <section className="profile-card">
                <div className="profile-picture">
                    <img src={user.profilePicture || "/images/stock_pp.png"} alt="Profile" />
                    <button className="change-picture-button">
                        <FiCamera style={{ marginRight: "8px" }} /> Change Profile Picture
                    </button>
                </div>

                
                {!isEditingProfile && (
                    <button onClick={handleProfileEditClick} className="edit-button">
                        <FiEdit />
                    </button>
                )}

                <div className="profile-info">
                <h1 className="profile-name">
                    <FiUserCheck className="icon name-icon" /> 
                    {isEditingProfile ? (
                        <div className="name-fields">
                            <input
                                type="text"
                                value={tempUser.firstname || ""}
                                onChange={(e) => handleInputChange("firstname", e.target.value)}
                                placeholder="First Name"
                                className="name-input"
                            />
                            <input
                                type="text"
                                value={tempUser.lastname || ""}
                                onChange={(e) => handleInputChange("lastname", e.target.value)}
                                placeholder="Last Name"
                                className="name-input"
                            />
                        </div>
                    ) : (
                        fullName || <span className="placeholder-text">Add Name</span>
                    )}
                </h1>

                    <div className="contact-info">
                        <p>
                            <FiMail className="icon" />
                            {isEditingProfile ? (
                                <input
                                    type="email"
                                    value={tempUser.email || ""}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    placeholder="Add Email"
                                />
                            ) : (
                                user.email || <span className="placeholder-text">Add Email</span>
                            )}
                        </p>
                        <p>
                            <FiPhone className="icon" />
                            {isEditingProfile ? (
                                <input
                                    type="text"
                                    value={tempUser.phone || ""}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                    placeholder="Add Phone"
                                />
                            ) : (
                                user.phone || <span className="placeholder-text">Add Phone</span>
                            )}
                        </p>
                        <p>
                            <FiMapPin className="icon" />
                            {isEditingProfile ? (
                                <input
                                    type="text"
                                    value={tempUser.location || ""}
                                    onChange={(e) => handleInputChange("location", e.target.value)}
                                    placeholder="Add Location"
                                />
                            ) : (
                                user.location || <span className="placeholder-text">Add Location</span>
                            )}
                        </p>
                    </div>

                    <div className="profile-bio">
                        <h2>
                            <FiUser className="bio-icon" /> About Me
                        </h2>
                        {isEditingProfile ? (
                            <textarea
                                className="edit-textarea"
                                value={tempUser.bio || ""}
                                onChange={(e) => handleInputChange("bio", e.target.value)}
                                rows={3}
                                placeholder="Add Bio"
                            />
                        ) : (
                            <p>{user.bio || <span className="placeholder-text">Add Bio</span>}</p>
                        )}
                    </div>

                    <button className="contact-button">Contact</button>

                    {isEditingProfile && (
                        <div className="profile-edit-controls">
                            <button onClick={handleProfileSaveClick} className="save-button"><FiCheck /></button>
                            <button onClick={handleProfileCancelClick} className="cancel-button"><FiX /></button>
                        </div>
                    )}
                </div>
            </section>

            
            <div className="bottom-row">
                {[
                    { title: "Interests", icon: MdFavorite, field: "interests" },
                    { title: "Skills", icon: MdSchool, field: "skills" },
                    { title: "Availability", icon: FiUser, field: "availability" },
                    { title: "Achievements", icon: MdStar, field: "achievements", isList: true },
                    { title: "Certifications", icon: MdCheckCircle, field: "certifications", isList: true },
                    { title: "Languages", icon: MdLanguage, field: "languages" },
                    { title: "Goals", icon: MdFlag, field: "goals", isList: true },
                ].map(({ title, icon: Icon, field, isList }, index) => (
                    <section className="info-card" key={index}>
                        <h2><Icon className="tile-icon" /> {title}</h2>
                        {editStates[field] ? (
                            <div>
                                <textarea
                                    className="edit-textarea"
                                    value={(tempUser[field] || []).join("\n")}
                                    onChange={(e) => handleInputChange(field, e.target.value.split("\n"))}
                                    rows={5}
                                    placeholder={`Add ${title}, one per line`}
                                />
                                <button onClick={() => handleTileSaveClick(field)} className="save-button"><FiCheck /></button>
                                <button onClick={() => handleTileCancelClick(field)} className="cancel-button"><FiX /></button>
                            </div>
                        ) : (
                            <div>
                                <ul>
                                    {(user[field] || []).length
                                        ? user[field].map((item, idx) => <li key={idx}>{item}</li>)
                                        : <span className="placeholder-text">Add {title}</span>}
                                </ul>
                                <button onClick={() => handleTileEditClick(field)} className="edit-button"><FiEdit /></button>
                            </div>
                        )}
                    </section>
                ))}

                
                <section className="info-card">
                    <h2><MdEvent className="tile-icon" /> Upcoming Events</h2>
                    <ul>
                        {user.upcomingEvents?.length
                            ? user.upcomingEvents.map((event, index) => (
                                <li key={index}>{event}</li>
                            ))
                            : <span className="placeholder-text">No Upcoming Events</span>}
                    </ul>
                </section>

                <section className="info-card">
                    <h2><MdHistory className="tile-icon" /> Most Recent Event</h2>
                    <p>{user.recentEvent || <span className="placeholder-text">No Recent Events</span>}</p>
                </section>
            </div>
        </main>
    );
}
