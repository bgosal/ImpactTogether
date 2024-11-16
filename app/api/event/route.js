


import { NextResponse } from "next/server";
import { connectToDB } from "@lib/mongodb";
import Event from "@models/Event";
import User from "@models/User";


export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const organizerId = searchParams.get("organizerId");
    const userId = searchParams.get("userId");
    const eventId = searchParams.get("id");

    if (eventId) {
      const event = await Event.findById(eventId).populate("participants", "_id firstname lastname profilePicture");
      if (!event) {
        return NextResponse.json({ message: "Event not found" }, { status: 404 });
      }
      return NextResponse.json(event, { status: 200 });
    } else if (organizerId) {
      const events = await Event.find({ organizer: organizerId })
        .populate("participants", "_id firstname lastname profilePicture")
        .lean();
      return NextResponse.json(events, { status: 200 });
    } else if (userId) {
      
      const events = await Event.find({ participants: userId }).lean();
      return NextResponse.json(events, { status: 200 });
    } else {
      const events = await Event.find({}, "eventName category date location").lean();
      return NextResponse.json(events, { status: 200 });
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
    const { eventId, userId, eventName, category, date, startTime, address, location, description, requirements, organizer } = body;

    if (eventId && userId) {
    
      const event = await Event.findById(eventId);
      if (!event) {
        return NextResponse.json({ message: "Event not found" }, { status: 404 });
      }

      if (event.participants.includes(userId)) {
        return NextResponse.json({ message: "User has already applied to this event" }, { status: 400 });
      }

      event.participants.push(userId);
      await event.save();

      return NextResponse.json({ message: "Application successful", event }, { status: 200 });
    } else if (eventName && category && organizer) {
      
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
    } else {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ message: "Failed to process request" }, { status: 500 });
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

export async function DELETE(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    const userId = searchParams.get("userId");

    if (!eventId || !userId) {
      return NextResponse.json({ message: "Event ID and User ID are required" }, { status: 400 });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

   
    event.participants = event.participants.filter(participant => participant.toString() !== userId);
    await event.save();

    return NextResponse.json({ message: "Application successfully canceled", event }, { status: 200 });
  } catch (error) {
    console.error("Error canceling application:", error);
    return NextResponse.json({ message: "Failed to cancel application" }, { status: 500 });
  }
}







