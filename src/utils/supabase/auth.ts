"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";

// Define validation schema with Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(100, { message: "Password is too long" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export async function login(
  prevState: string | undefined,
  formData: FormData
): Promise<void> {
  const supabase = await createClient();

  // Extract values from form data
  const rawFormData: LoginFormData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // Validate inputs using Zod
  const validationResult = loginSchema.safeParse(rawFormData);

  // If validation fails, throw an error with validation issues
  if (!validationResult.success) {
    const errors = validationResult.error.format();
    console.error("Validation error:", errors);
    throw new Error(`Invalid form data: ${JSON.stringify(errors)}`);
  }

  // Extract validated data
  const { email, password } = validationResult.data;

  // Attempt to sign in with validated credentials
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/");
}