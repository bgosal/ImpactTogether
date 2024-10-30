"use client";

import React, { useState } from "react";

export default function Profile() {
    const [user, setUser] = useState({
        profilePicture: "/default-avatar.png",
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
                </div>
                <div className="profile-info">
                    <h1 className="profile-name">{user.fullName}</h1>
                    <div className="contact-info">
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {user.phone}</p>
                        <p><strong>Location:</strong> {user.location}</p>
                        <p><strong>Role:</strong> {user.role}</p>
                    </div>
                   
                    <div className="profile-bio">
                        <p>{user.bio}</p>
                    </div>
                </div>
            </section>

            
            <div className="bottom-row">
                <section className="info-card">
                    <h2>Interests</h2>
                    <p>{user.interests.join(", ")}</p>
                </section>

                <section className="info-card">
                    <h2>Skills</h2>
                    <p>{user.skills.join(", ")}</p>
                </section>

                <section className="info-card">
                    <h2>Availability</h2>
                    <p>{user.availability}</p>
                </section>
            </div>

          
            <div className="bottom-row">
                <section className="info-card">
                    <h2>Achievements</h2>
                    <ul>
                        {user.achievements.map((achievement, index) => (
                            <li key={index}>{achievement}</li>
                        ))}
                    </ul>
                </section>

                <section className="info-card">
                    <h2>Certifications</h2>
                    <ul>
                        {user.certifications.map((cert, index) => (
                            <li key={index}>{cert}</li>
                        ))}
                    </ul>
                </section>

                <section className="info-card">
                    <h2>Languages</h2>
                    <p>{user.languages.join(", ")}</p>
                </section>
            </div>

            
            <div className="bottom-row">
                <section className="info-card">
                    <h2>Goals</h2>
                    <ul>
                        {user.goals.map((goal, index) => (
                            <li key={index}>{goal}</li>
                        ))}
                    </ul>
                </section>

                <section className="info-card">
                    <h2>Upcoming Events</h2>
                    <p>{user.upcomingEvents.join(", ")}</p>
                </section>

                <section className="info-card">
                    <h2>Most Recent Event</h2>
                    <p>{user.recentEvent}</p>
                </section>
            </div>
        </main>
    );
}
