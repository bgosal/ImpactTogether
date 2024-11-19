import { NextResponse } from "next/server";
import { connectToDB } from "@lib/mongodb";
import Event from "@models/Event";

export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const organizerId = searchParams.get("organizerId");
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit")) || 3;

    if (!organizerId) {
      return NextResponse.json({ message: "Organizer ID is required" }, { status: 400 });
    }

    const now = new Date();
    let events;

    if (type === "upcoming") {
      events = await Event.find({ organizer: organizerId, date: { $gte: now } })
        .sort({ date: 1 })
        .limit(limit)
        .lean();
    } else if (type === "past") {
      events = await Event.find({ organizer: organizerId, date: { $lt: now } })
        .sort({ date: -1 })
        .limit(limit)
        .lean();
    } else {
      return NextResponse.json({ message: "Invalid type parameter" }, { status: 400 });
    }

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ message: "Failed to fetch events" }, { status: 500 });
  }
}
