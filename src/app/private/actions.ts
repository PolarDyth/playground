"use server";

import { Project } from "@/utils/supabase/projects/definitions";
import { createProject } from "@/utils/supabase/projects/project-actions";
import { formSchema } from "./schema";
import { z } from "zod";

type FormValues = z.infer<typeof formSchema>;

export async function handleSubmitProject(formData: FormValues) {
  console.log("formData", formData);
  const validatedFields = formSchema.safeParse(formData);

  console.log(validatedFields)

  if (!validatedFields.success) {
    console.log("Validation error:", validatedFields.error.format());
    return {
      message: "Please check the form for errors",
      errors: validatedFields.error.format(),
    };
  }

  const projectData: Project = {
    data: validatedFields.data.data,
    slug: validatedFields.data.slug,
  };

  try {
    await createProject(projectData);
    return { message: "Project created successfully" };
  } catch(error) {
    console.error("Error creating project:", error);
    return { message: "An error occurred while creating the project" };
  }
}
