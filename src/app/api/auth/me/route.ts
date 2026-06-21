import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserById, updateUserProfile } from "@/lib/db/users";
import { withEncryption } from "@/lib/apiWrapper";
import { ApiResponse } from "@/lib/apiResponse";

export const GET = withEncryption(async () => {
  const session = await getSession();
  if (!session) {
    return ApiResponse.success({ user: null });
  }

  const user = await getUserById(session.userId);
  if (!user) {
    return ApiResponse.success({ user: null });
  }

  return ApiResponse.success({
    user: {
      userId: user.userId,
      phoneNumber: user.phoneNumber,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
    },
  });
});

export const POST = withEncryption(async (req: Request) => {
  const session = await getSession();
  if (!session) {
    return ApiResponse.error("Unauthorized", 401);
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
      return ApiResponse.error("User not found", 404);
    }

    return ApiResponse.success({
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
    return ApiResponse.error("Internal Server Error", 500);
  }
});
