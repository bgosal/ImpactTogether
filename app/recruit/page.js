"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FaBuilding, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaListAlt, FaTasks, FaInfoCircle } from 'react-icons/fa';

export default function Recruit() {
  const { data: session } = useSession();
  const organizerId = session?.user?.id; 
  const router = useRouter();

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!organizerId) {
      alert("You must be logged in to create an event.");
      return;
    }

    const res = await fetch("/api/event", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        organizer: organizerId,
        description: data.description.trim(),
        requirements: data.requirements.split("\n"),
      }),
    });

    if (res.ok) {
      router.push("/event-management");
    } else {
      const errorData = await res.json();
      throw new Error(errorData?.error || "Failed to create event.");
    }
  };

  return (
    <main className="recruit-page">
      <div className="event-form-container">
        <div className="form-heading">Create New Event</div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <section className="event-details-section">
              {/* Heading */}
              <div className="section-heading">
                <FaInfoCircle className="icon-heading" />
                <span className="section-heading-text">Event Details</span>
              </div>
              
              {/* Event Name */}
              <div className="event-input-group">
                <label htmlFor="eventName">
                  <FaBuilding className="icon-heading" /> Event Name
                </label>
                <input
                  type="text"
                  id="eventName"
                  className="event-input-field"
                  placeholder="Enter event name"
                  {...register("eventName", { required: "Event name is required" })}
                />
                {errors.eventName && <p style={{ color: "red" }}>{errors.eventName.message}</p>}
              </div>

              {/* Category */}
              <div className="event-input-group">
                <label htmlFor="category">
                  <FaListAlt className="icon-heading" /> Category
                </label>
                <select
                  id="category"
                  className="event-input-field"
                  {...register("category", { required: "Category is required" })}
                >
                  <option value="">Select Category</option>
                  <option value="Animal_Care">Animal Care</option>
                  <option value="Arts">Arts & Culture</option>
                  <option value="Community">Community</option>
                  <option value="Education">Education</option>
                  <option value="Environment">Environment</option>
                  <option value="Food">Food</option>
                  <option value="Health">Health</option>
                  <option value="Youth">Youth</option>
                </select>
                {errors.category && <p style={{ color: "red" }}>{errors.category.message}</p>}
              </div>

              {/* Date */}
              <div className="event-input-group">
                <label htmlFor="date">
                  <FaCalendarAlt className="icon-heading" /> Date
                </label>
                <input
                  type="date"
                  id="date"
                  className="event-input-field"
                  min={minDate}
                  {...register("date", { required: "Date is required" })}
                />
                {errors.date && <p style={{ color: "red" }}>{errors.date.message}</p>}
              </div>

              {/* Start Time */}
              <div className="event-input-group">
                <label htmlFor="startTime">
                  <FaClock className="icon-heading" /> Start Time
                </label>
                <input
                  type="time"
                  id="startTime"
                  className="event-input-field"
                  {...register("startTime", { required: "Start time is required" })}
                />
                {errors.startTime && <p style={{ color: "red" }}>{errors.startTime.message}</p>}
              </div>

              {/* Address */}
              <div className="event-input-group">
                <label htmlFor="address">
                  <FaMapMarkerAlt className="icon-heading" /> Address
                </label>
                <input
                  type="text"
                  id="address"
                  className="event-input-field"
                  placeholder="Enter address"
                  {...register("address", { required: "Address is required" })}
                />
                {errors.address && <p style={{ color: "red" }}>{errors.address.message}</p>}
              </div>

              {/* Location */}
              <div className="event-input-group">
                <label htmlFor="location">
                  <FaMapMarkerAlt className="icon-heading" /> Location
                </label>
                <select
                  id="location"
                  className="event-input-field"
                  {...register("location", { required: "Location is required" })}
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
                {errors.location && <p style={{ color: "red" }}>{errors.location.message}</p>}
              </div>
            </section>

            <section className="event-description-section">
              {/* Heading */}
              <div className="section-heading">
                <FaTasks className="icon-heading" /> Event Description
              </div>
              
              {/* Event Description */}
              <div className="event-input-group">
                <label htmlFor="description">
                  <FaInfoCircle className="icon-heading" /> Event Description
                </label>
                <textarea
                  id="description"
                  className="event-input-field"
                  placeholder="Enter a brief description"
                  rows="4"
                  {...register("description", { required: "Description is required" })}
                ></textarea>
                {errors.description && <p style={{ color: "red" }}>{errors.description.message}</p>}
              </div>
              
              {/* Event Requirements */}
              <div className="event-input-group">
                <label htmlFor="requirements">
                  <FaTasks className="icon-heading" /> Event Requirements
                </label>
                <textarea
                  id="requirements"
                  className="event-input-field"
                  placeholder="Enter event requirements, one per line"
                  rows="3"
                  {...register("requirements")}
                ></textarea>
              </div>
            </section>
            
            <button type="submit" className="event-submit-button">
              Create Listing
            </button>
          </form>
      </div>
    </main>
  );
}
