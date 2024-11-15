import { NextResponse } from "next/server";
import { connectToDB } from "@lib/mongodb";
import User from "@models/User";

export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    const user = await User.findById(userId).lean();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ message: "Failed to fetch user data" }, { status: 500 });
  }
}



export async function PUT(req) {
  try {
    await connectToDB();

    const { id, email, achievements, profilePicture, ...updatedFields } = await req.json();
    
   
    

    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== id) {
        return NextResponse.json({ message: "Email is already in use by another account." }, { status: 409 });
      }
    }

    const updateData = {
      ...updatedFields,
      email,
      profilePicture: profilePicture || "/images/stock_pp.png",
      ...(achievements ? { achievements } : {}),
    };

   
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating user data:", error);
    return NextResponse.json({ message: "Failed to update user data" }, { status: 500 });
  }
}

