import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user-model";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET(req) {
  // Get the user session to access the user ID
  const session = await getServerSession({ req, ...authOptions });
  const userId = session?.user?._id;
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    // Connect to the database
    await dbConnect();

    // Find the user by ID
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Extract addresses and defaultAddress from the user object
    const { addresses, defaultAddress } = user;
    // Return the response with both addresses and defaultAddress
    return NextResponse.json({ addresses, defaultAddress }, { status: 200 });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}
