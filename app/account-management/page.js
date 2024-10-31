"use client";

import React, { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiUser, FiEdit } from "react-icons/fi";
import { MdEvent, MdSchool, MdLanguage, MdStar, MdCheckCircle, MdHistory, MdFavorite, MdFlag } from "react-icons/md";

export default function Profile() {
    const [user, setUser] = useState({
        profilePicture: "/images/stock_pp.png",
        fullName: "John Doe",
        email: "johndoe@example.com",
        phone: "123-456-7890",
        location: "Vancouver, BC",
        role: "Volunteer",
        volunteerHours: 120,
        bio: "Passionate volunteer with experience in event management and community service. Dedicated to making a positive impact and helping others.",
        interests: ["Community Service", "Environmental Protection"],
        skills: ["Teaching", "Event Management", "Public Speaking"],
        availability: "Weekends",
        achievements: ["Volunteer of the Month - June 2024", "Completed 100+ hours in 2023", "Organized Annual Fundraiser 2022"],
        certifications: ["First Aid Certification", "Conflict Resolution Training"],
        languages: ["English", "Spanish", "French"],
        goals: ["Develop leadership skills", "Make a difference in youth education"],
        upcomingEvents: ["Beach Cleanup", "Community Tutoring"],
        recentEvent: "Food Drive - September 2024"
    });

    return (
        <main className="profile-page">
           
            <section className="profile-card">
                <div className="profile-picture">
                    <img src={user.profilePicture} alt="Profile" />
                    <p className="volunteer-hours">Total Volunteer Hours: {user.volunteerHours}</p>
                    <button className="edit-button"><FiEdit /></button>
                </div>
                <div className="profile-info">
                    <h1 className="profile-name">
                        <FiUser className="icon" /> {user.fullName}
                        <button className="edit-button-inline"><FiEdit /></button>
                    </h1>
                    <div className="contact-info">
                        <p><FiMail className="icon" /> {user.email} <button className="edit-button-inline"><FiEdit /></button></p>
                        <p><FiPhone className="icon" /> {user.phone} <button className="edit-button-inline"><FiEdit /></button></p>
                        <p><FiMapPin className="icon" /> {user.location} <button className="edit-button-inline"><FiEdit /></button></p>
                        <p><MdCheckCircle className="icon" /> {user.role} <button className="edit-button-inline"><FiEdit /></button></p>
                    </div>
                    <div className="profile-bio">
                        <p>{user.bio}</p>
                        <button className="edit-button-inline"><FiEdit /></button>
                    </div>
                    <button className="contact-button">Contact</button>
                </div>
            </section>

           
            <div className="bottom-row">
                <section className="info-card">
                    <button className="edit-button"><FiEdit /></button>
                    <h2><MdFavorite className="tile-icon" /> Interests</h2>
                    <p>{user.interests.join(", ")}</p>
                </section>

                <section className="info-card">
                    <button className="edit-button"><FiEdit /></button>
                    <h2><MdSchool className="tile-icon" /> Skills</h2>
                    <p>{user.skills.join(", ")}</p>
                </section>

                <section className="info-card">
                    <button className="edit-button"><FiEdit /></button>
                    <h2><FiUser className="tile-icon" /> Availability</h2>
                    <p>{user.availability}</p>
                </section>
            </div>

            <div className="bottom-row">
                <section className="info-card">
                    <button className="edit-button"><FiEdit /></button>
                    <h2><MdStar className="tile-icon" /> Achievements</h2>
                    <ul>
                        {user.achievements.map((achievement, index) => (
                            <li key={index}>{achievement}</li>
                        ))}
                    </ul>
                </section>

                <section className="info-card">
                    <button className="edit-button"><FiEdit /></button>
                    <h2><MdCheckCircle className="tile-icon" /> Certifications</h2>
                    <ul>
                        {user.certifications.map((cert, index) => (
                            <li key={index}>{cert}</li>
                        ))}
                    </ul>
                </section>

                <section className="info-card">
                    <button className="edit-button"><FiEdit /></button>
                    <h2><MdLanguage className="tile-icon" /> Languages</h2>
                    <p>{user.languages.join(", ")}</p>
                </section>
            </div>

            <div className="bottom-row">
                <section className="info-card">
                    <button className="edit-button"><FiEdit /></button>
                    <h2><MdFlag className="tile-icon" /> Goals</h2>
                    <ul>
                        {user.goals.map((goal, index) => (
                            <li key={index}>{goal}</li>
                        ))}
                    </ul>
                </section>

                <section className="info-card">
                    <button className="edit-button"><FiEdit /></button>
                    <h2><MdEvent className="tile-icon" /> Upcoming Events</h2>
                    <p>{user.upcomingEvents.join(", ")}</p>
                </section>

                <section className="info-card">
                    <button className="edit-button"><FiEdit /></button>
                    <h2><MdHistory className="tile-icon" /> Most Recent Event</h2>
                    <p>{user.recentEvent}</p>
                </section>
            </div>
        </main>
    );
}
