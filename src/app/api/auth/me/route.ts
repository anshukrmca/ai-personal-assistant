import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserById, updateUserProfile } from "@/lib/db/users";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const user = await getUserById(session.userId);
  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({
    user: {
      userId: user.userId,
      phoneNumber: user.phoneNumber,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
    },
  });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, email, avatar } = body;

    const fieldsToUpdate: any = {};
    if (name !== undefined) fieldsToUpdate.name = name;
    if (email !== undefined) fieldsToUpdate.email = email;
    if (avatar !== undefined) fieldsToUpdate.avatar = avatar;

    const updatedUser = await updateUserProfile(session.userId, fieldsToUpdate);
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        userId: updatedUser.userId,
        phoneNumber: updatedUser.phoneNumber,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
