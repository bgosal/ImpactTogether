import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "health", 
      "food", 
      "community", 
      "education", 
      "environment", 
      "animal_care", 
      "youth", 
      "arts"
    ],
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String, 
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
    enum: [
      "vancouver", 
      "burnaby", 
      "richmond", 
      "surrey", 
      "langley", 
      "abbotsford", 
      "coquitlam", 
      "delta"
    ],
  },
  description: {
    type: String,
    required: true,
  },
  requirements: {
    type: [String], 
    default: [],
    
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  organizer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  }, 
});

const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);

export default Event;
