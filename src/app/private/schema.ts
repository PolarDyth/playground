import { z } from "zod";

export const formSchema = z.object({
  data: z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    skills: z.array(z.string()).min(1, "Add at least one skill"),
    testimonial: z.object({
      content: z.string().min(10, "Testimonial must be at least 10 characters"),
      author: z.string().min(2, "Author name is required"),
      role: z.string().optional(),
    }),
  }),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
});
