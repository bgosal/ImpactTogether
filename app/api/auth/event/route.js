import { connectToDB } from "@lib/mongodb";
import Event from "@models/Event";

export const POST = async (req) => {
  try {
    await connectToDB();

    const body = await req.json();
    const { eventName, category, date, startTime, address, location, description, requirements, activities, organizer } = body;

    if (!organizer) {
      return new Response("Organizer ID is required", { status: 400 });
    }

   
    const newEvent = await Event.create({
      eventName,
      category,
      date,
      startTime,
      address,
      location,
      description,
      requirements: requirements || null,
      activities: activities || null,
      organizer, 
    });

    return new Response(JSON.stringify(newEvent), { status: 200 });
  } catch (error) {
    console.error("Error creating event:", error);
    return new Response("Failed to create a new event", { status: 500 });
  }
};
