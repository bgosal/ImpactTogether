import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: function() { return this.role === "volunteer"; }, 
  },
  lastname: {
    type: String,
    required: function() { return this.role === "volunteer"; }, 
  },
  organizationName: {
    type: String,
    required: function() { return this.role === "organizer"; }, 
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["volunteer", "organizer"],
  },
  website: {
    type: String,
    default: null,
  },
  phone: {
    type: String,
    default: null,
  },
  location: {
    type: String,
    default: null,
  },
  bio: {
    type: String,
    default: null,
  },
  achievements: {
    type: [String],
    default: [],
  },
  upcomingEvents: {
    type: [Object],
    default: [],
  },
  pastEvents: {
    type: [Object],
    default: [],
  },
  interests: {
    type: [String], 
    default: [],
  },
  skills: {
    type: [String], 
    default: [],
  },
  availability: {
    type: [Object], 
    default: [],
  },
  certifications: {
    type: [String], 
    default: [],
  },
  languages: {
    type: [String], 
    default: [],
  },
  goals: {
    type: [String], 
    default: [],
  }
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
