'use server'

"use server"

import { login } from "@/utils/supabase/auth";
import { isAuthError } from "@supabase/supabase-js";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await login("credentials", formData);
  } catch (error) {
    if (isAuthError(error)) {
      console.log(error.code)
      switch (error.code) {
        case "invalid_credentials":
          return "Invalid credentials.";
        case "over_request_rate_limit":
          return "Too many requests. Try again later.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
