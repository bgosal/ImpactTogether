"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession, } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiTrash2,FiUserCheck, iUserCheck, FiCamera, FiMail, FiPhone, FiMapPin, FiUser, FiEdit, FiCheck, FiX } from "react-icons/fi";
import { MdEvent, MdSchool, MdLanguage, MdStar, MdCheckCircle, MdHistory, MdFavorite, MdFlag } from "react-icons/md";
import Loader from "@/app/components/Loader";
import Image from "next/image";


export default function Profile() {
    const { data: session } = useSession();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [tempUser, setTempUser] = useState({});
    const [editStates, setEditStates] = useState({});
    const searchParams = useSearchParams();
    const userId = searchParams.get("id") || session?.user?.id;
    const fileInputRef = useRef(null);
    const router = useRouter();
    const DEFAULT_PICTURE = "/images/stock_pp.png";
    const isOwnProfile = session?.user?.id === userId; 

    useEffect(() => {
        const fetchUserProfile = async () => {
             
            if (session === undefined) return;
            if (!session?.user?.id) {
                setError("User not authenticated");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/profile?id=${userId}`);
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
                    profilePicture: data.profilePicture || DEFAULT_PICTURE
                });
            } catch (error) {
                console.error("Error fetching profile data:", error);
                setError("Failed to load profile data.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId, session]);

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
            const response = await fetch(`/api/profile`, {
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

    // const handleProfileCancelClick = () => {
    //     setTempUser({ ...user });
    //     setIsEditingProfile(false);
    // };

    const handleInputChange = (field, value) => {
        setTempUser((prev) => ({ ...prev, [field]: value }));
    };

    const handleTileEditClick = (field) => {
        setEditStates((prev) => ({ ...prev, [field]: true }));
    };

    const handleTileSaveClick = async (field) => {
        const updatedValue = tempUser[field]?.filter(item => item.trim() !== "") || []; 
    
        try {
            const response = await fetch(`/api/profile`, {
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


    const handleFileButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleProfilePictureChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setTempUser((prev) => ({ ...prev, profilePicture: reader.result }));
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteProfilePicture = () => {
        setTempUser((prev) => ({ ...prev, profilePicture: DEFAULT_PICTURE }));
    };

    const handleProfileCancelClick = () => {
        setTempUser({ ...user, profilePicture: user.profilePicture || DEFAULT_PICTURE });
        setIsEditingProfile(false);
    };



    if (loading) return <Loader />;
    if (error) return <p>{error}</p>;
    if (!user) return <p>No profile data available.</p>;

    const fullName = `${tempUser.firstname || ""} ${tempUser.lastname || ""}`.trim();

    return (
        <div className="profile-page-wrapper2">
        <main className="profile-page">
    <section className="profile-card">
        <div className="profile-picture">
        <Image
            src={tempUser.profilePicture || DEFAULT_PICTURE}
            alt="Profile"
            width={150} 
            height={150}
            layout="intrinsic"
            />

            {isOwnProfile && isEditingProfile && (
               <>            
                                <button
                                    className="change-picture-button"
                                    onClick={handleFileButtonClick}
                                >
                                    <FiCamera style={{ marginRight: "8px" }} /> Change Profile Picture
                                </button>
                                <button
                                    className="delete-picture-button"
                                    onClick={handleDeleteProfilePicture}
                                >
                                    <FiTrash2 style={{ marginRight: "8px" }} /> Reset Profile Picture
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                    accept="image/*"
                                    onChange={handleProfilePictureChange}
                                />
                            
                            </> 
                        )}
                    </div>

                    {isOwnProfile && !isEditingProfile && (
                        <button
                            onClick={() => setIsEditingProfile(true)}
                            className="edit-button"
                        >
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
                                    onChange={(e) => setTempUser((prev) => ({ ...prev, firstname: e.target.value }))}
                                    placeholder={isOwnProfile ? "Add First Name" : "No First Name"}
                                    className="name-input"
                                />
                                <input
                                    type="text"
                                    value={tempUser.lastname || ""}
                                    onChange={(e) => setTempUser((prev) => ({ ...prev, lastname: e.target.value }))}
                                    placeholder={isOwnProfile ? "Add Last Name" : "No Last Name"}
                                    className="name-input"
                                />
                            </div>
                    ) : (
                        fullName || (
                            <span className="placeholder-text">
                                {isOwnProfile ? "Add Name" : "No Name"}
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
                                    value={tempUser.email || ""}
                                    onChange={(e) => setTempUser((prev) => ({ ...prev, email: e.target.value }))}
                                    placeholder={isOwnProfile ? "Add Email" : "No Email"}
                                />
                            ) : (
                                user.email || (
                                    <span className="placeholder-text">
                                        {isOwnProfile ? "Add Email" : "No Email"}
                                    </span>
                                )
                            )}
                        </p>
                        <p>

                            <FiPhone className="icon" />
                            {isEditingProfile ? (
                                <input
                                    type="text"
                                    value={tempUser.phone || ""}
                                    onChange={(e) => setTempUser((prev) => ({ ...prev, phone: e.target.value }))}
                                    placeholder={isOwnProfile ? "Add Phone" : "No Phone"}
                                />
                            ) : (
                                user.phone || (
                                    <span className="placeholder-text">
                                        {isOwnProfile ? "Add Phone" : "No Phone"}
                                    </span>
                                )
                            )}
                        </p>
                        <p>
                        <FiMapPin className="icon" />
                            {isEditingProfile ? (
                                <input
                                    type="text"
                                    value={tempUser.location || ""}
                                    onChange={(e) => setTempUser((prev) => ({ ...prev, location: e.target.value }))}
                                    placeholder={isOwnProfile ? "Add Location" : "No Location"}
                                />
                            ) : (
                                user.location || (
                                    <span className="placeholder-text">
                                        {isOwnProfile ? "Add Location" : "No Location"}
                                    </span>
                                )
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
                                placeholder={isOwnProfile ? "Add Bio" : "No Bio"}
                            />
                        ) : (
                            <p>
                                {user.bio || (
                                    <span className="placeholder-text">
                                        {isOwnProfile ? "Add Bio" : "No Bio"}
                                    </span>
                                )}
                            </p>
                        )}
                    </div>
                    <button
                        className="contact-button"
                        onClick={() => window.location.href = `mailto:${user.email}`}
                        >
                            Contact
                    </button>  


                    {isOwnProfile && isEditingProfile && (
                        <div className="profile-edit-controls">
                            <button onClick={handleProfileSaveClick} className="save-button">
                                <FiCheck /> {/* Save button */}
                            </button>
                            <button onClick={handleProfileCancelClick} className="cancel-button">
                                <FiX /> {/* Close/Cancel button */}
                            </button>
                            
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
                    // { title: "Goals", icon: MdFlag, field: "goals", isList: true },
                ].map(({ title, icon: Icon, field, isList }, index) => (
                    <section className="info-card" key={index}>
                        <h2>
                            <Icon className="tile-icon" /> {title}
                        </h2>
                        {editStates[field] ? (
                            <div>
                                <textarea
                                    className="edit-textarea"
                                    value={(tempUser[field] || []).join("\n")}
                                    onChange={(e) =>
                                        handleInputChange(field, e.target.value.split("\n"))
                                    }
                                    rows={5}
                                    placeholder={`Add ${title}, one per line`}
                                />
                                <button
                                    onClick={() => handleTileSaveClick(field)}
                                    className="save-button"
                                >
                                    <FiCheck />
                                </button>
                                <button
                                    onClick={() => handleTileCancelClick(field)}
                                    className="cancel-button"
                                >
                                    <FiX />
                                </button>
                            </div>
                        ) : (
                            <div>
                                <ul>
                                    {(user[field] || []).length ? (
                                        user[field].map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))
                                    ) : (
                                        <span className="placeholder-text">
                                            {isOwnProfile
                                                ? `Add ${title}`
                                                : `No ${title}`}
                                        </span>
                                    )}
                                </ul>
                                {isOwnProfile && (
                                    <button
                                        onClick={() => handleTileEditClick(field)}
                                        className="edit-button"
                                    >
                                        <FiEdit />
                                    </button>
                                )}
                            </div>
                        )}
                    </section>
                ))}


                

                {/* <section className="info-card">
                    <h2>
                        <MdEvent className="tile-icon" /> Upcoming Events
                    </h2>
                    <ul>
                        {user.upcomingEvents?.length ? (
                            user.upcomingEvents.map((event, index) => (
                                <li key={index}>{event}</li>
                            ))
                        ) : (
                            <span className="placeholder-text">No Upcoming Events</span>
                        )}
                    </ul>
                </section>

                <section className="info-card">
                    <h2>
                        <MdHistory className="tile-icon" /> Most Recent Event
                    </h2>
                    <p>
                        {user.recentEvent || (
                            <span className="placeholder-text">No Recent Events</span>
                        )}
                    </p>
                </section> */}
            </div>

        </main>
        </div>
    );
}
