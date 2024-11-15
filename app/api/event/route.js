import { NextResponse } from "next/server";
import { connectToDB } from "@lib/mongodb";
import Event from "@models/Event";

export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const organizerId = searchParams.get("organizerId");
    const eventId = searchParams.get("id");

    if (eventId) {
      const event = await Event.findById(eventId).lean();
      if (!event) {
        return NextResponse.json({ message: "Event not found" }, { status: 404 });
      }
      return NextResponse.json(event, { status: 200 });
    } else if (organizerId) {
      const events = await Event.find({ organizer: organizerId }).lean();
      return NextResponse.json(events, { status: 200 });
    } else {
      return NextResponse.json({ message: "Organizer ID or Event ID is required" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error fetching event(s):", error);
    return NextResponse.json({ message: "Failed to fetch event(s)" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();
    const { eventName, category, date, startTime, address, location, description, requirements, activities, organizer } = body;

    if (!organizer) {
      return NextResponse.json({ message: "Organizer ID is required" }, { status: 400 });
    }

    const newEvent = await Event.create({
      eventName,
      category,
      date,
      startTime,
      address,
      location,
      description,
      requirements,
      organizer,
    });

    return NextResponse.json(newEvent, { status: 200 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ message: "Failed to create a new event" }, { status: 500 });
  }
}


export async function PUT(req) {
  try {
    await connectToDB();

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ message: "Event ID is required" }, { status: 400 });
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updatedEvent) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json({ message: "Failed to update event" }, { status: 500 });
  }
}
