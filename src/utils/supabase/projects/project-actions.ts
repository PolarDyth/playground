"use server";

import { createClient } from "../server";
import { Project } from "./definitions";

export async function createProject(project: Project): Promise<void> {
  const supabase = await createClient();
  console.log("Creating project...");
  const { error } = await supabase.from("project").insert({ data: project.data, slug: project.slug });
  if (error) {
    console.log(error)
    throw error;
  }
  console.log("Project created successfully");
}

export async function deleteProject(id: number): Promise<void> {
  const supabase = await createClient();
  
  const { error } = await supabase.from("project").delete().match({ id });
  if (error) {
    throw error;
  }
}