"use server";

import { signIn } from "@/auth";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">
) => {
  const { email, password } = params;

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error) {
    console.error("Signin error:", error);
    return { success: false, error: "Something went wrong during sign in." };
  }
};

export const signUp = async (params: AuthCredentials) => {
  const { fullName, email, password } = params;

  try {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      return { success: false, error: "User already exists." };
    }

    const hashedPassword = await hash(password, 10);

    await db.insert(users).values({
      fullName,
      email,
      password: hashedPassword,
    });

    const signInResult = await signInWithCredentials({ email, password });

    if (!signInResult.success) {
      return {
        success: false,
        error: "Account created but sign-in failed.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error: "Something went wrong during sign up." };
  }
};
