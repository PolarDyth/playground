export type Project = {
  data: {
    title: string;
    description: string;
    skills: string[];
    testimonial: {
      content: string;
      author: string;
      role?: string | undefined;
    };
  }
  slug: string;
}