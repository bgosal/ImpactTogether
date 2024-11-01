"use client";

import React from "react";
import { FiEdit, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { MdEvent, MdHistory, MdStar, MdBusiness } from "react-icons/md"; 

export default function OrganizerProfile() {
    const organizer = {
        profilePicture: "/images/sample_logo.webp",
        organization: "Green Earth Org",
        email: "alexandra@greenearth.org",
        phone: "987-654-3210",
        location: "Toronto, ON",
        bio: "Passionate about community involvement and environmental sustainability. Leading initiatives to drive positive change.",
        pastEvents: [
            { name: "Beach Cleanup 2023", volunteers: 200, impact: "Collected 500 kg of waste" },
            { name: "Community Fundraiser 2022", fundsRaised: "$10,000", impact: "Supported 300 families" }
        ],
        upcomingEvents: [
            { name: "Tree Planting Day", date: "November 5, 2024", location: "Downtown Park" },
            { name: "Youth Mentorship Workshop", date: "December 1, 2024", location: "Community Center" }
        ],
        achievements: [
            "Organized 20+ community events",
            "Mobilized 1,500+ volunteers",
            "Raised $50,000 for environmental initiatives"
        ]
    };

    return (
        <main className="profile-page">
            
            <section className="profile-card">
                <div className="profile-picture">
                    <img src={organizer.profilePicture} alt="Organizer Profile" />
                </div>

                <div className="profile-info">
                    <h1 className="profile-name">
                        <MdBusiness className="icon" /> {organizer.organization}
                    </h1>

                    <div className="contact-info">
                        <p><FiMail className="icon" /> {organizer.email}</p>
                        <p><FiPhone className="icon" /> {organizer.phone}</p>
                        <p><FiMapPin className="icon" /> {organizer.location}</p>
                    </div>

                    <div className="profile-bio">
                        <p>{organizer.bio}</p>
                    </div>

                    
                    <button className="edit-button"><FiEdit /></button>
                </div>
            </section>

            
            <div className="bottom-row">
                <section className="info-card">
                    <h2><MdEvent className="tile-icon" /> Upcoming Events</h2>
                    <ul>
                        {organizer.upcomingEvents.map((event, index) => (
                            <li key={index}>
                                <strong>{event.name}</strong> - {event.date} at {event.location}
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="info-card">
                    <h2><MdHistory className="tile-icon" /> Past Events</h2>
                    <ul>
                        {organizer.pastEvents.map((event, index) => (
                            <li key={index}>
                                <strong>{event.name}</strong>: {event.volunteers || event.fundsRaised} | {event.impact}
                            </li>
                        ))}
                    </ul>
                </section>

                
                <section className="info-card">
                    <h2><MdStar className="tile-icon" /> Impact and Achievements</h2>
                    <div>
                        <ul>
                            {organizer.achievements.map((achievement, index) => (
                                <li key={index}>{achievement}</li>
                            ))}
                        </ul>
                        
                        <button className="edit-button"><FiEdit /></button>
                    </div>
                </section>
            </div>
        </main>
    );
}
