import { connectToDB } from "@lib/mongodb";
import { hash } from "bcryptjs";
import User from "@models/User";

export const POST = async (req, res) => {
  try {
    await connectToDB();

    const body = await req.json();
    const { firstname, lastname, email, password, role, organizationName } = body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response("User already exists", { status: 400 });
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      role,
      firstname: role === "volunteer" ? firstname : null,
      lastname: role === "volunteer" ? lastname : null,
      organizationName: role === "organizer" ? organizationName : null
    });
    
    await newUser.save();

    return new Response(JSON.stringify(newUser), { status: 200 });
  } catch (error) {
    console.error("Error creating user:", error);
    return new Response("Failed to create a new user", { status: 500 });
  }
};
