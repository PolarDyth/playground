import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Calendar, ArrowRight, Layers, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define the project type to match your database structure
type Project = {
  id: number;
  slug: string;
  data: {
    title: string;
    description: string;
    skills: string[];
    testimonial: {
      content: string;
      author: string;
      role?: string;
    };
  };
  created_at: string;
};

export const revalidate = 3600; // Revalidate the data at most every hour

export default async function ProjectsPage() {
  const supabase = await createClient();
  
  // Fetch all projects, ordered by most recent first
  const { data: projects, error } = await supabase
    .from("project")
    .select("*")
    .order("created_at", { ascending: false });
    
  if (error) {
    console.error("Error fetching projects:", error);
  }

  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary mb-4">
          Our Projects
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our portfolio of work showcasing our expertise and creative solutions
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 p-4 text-destructive text-center">
          Unable to load projects. Please try again later.
        </div>
      )}

      {(!projects || projects.length === 0) && !error && (
        <div className="text-center p-12 border rounded-lg border-dashed border-muted-foreground/30">
          <h3 className="text-xl font-medium mb-2">No projects found</h3>
          <p className="text-muted-foreground">
            Check back soon for new additions to our portfolio.
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project: Project) => (
          <Card key={project.id} className="flex flex-col h-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-bold">
                  {project.data.title}
                </CardTitle>
              </div>
              <CardDescription className="flex items-center gap-1.5 text-xs">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(project.created_at).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-grow">
              <p className="text-muted-foreground line-clamp-3 mb-4">
                {project.data.description}
              </p>
              
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.data.skills.slice(0, 5).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {project.data.skills.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{project.data.skills.length - 5} more
                  </Badge>
                )}
              </div>
              
              {project.data.testimonial && project.data.testimonial.content && (
                <div className="bg-primary/5 p-3 rounded-lg text-sm italic">
                  <p className="line-clamp-2">{project.data.testimonial.content}</p>
                  <p className="text-right mt-1 text-xs font-medium">
                    — {project.data.testimonial.author}
                    {project.data.testimonial.role && (
                      <span className="text-muted-foreground">
                        , {project.data.testimonial.role}
                      </span>
                    )}
                  </p>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="pt-2">
              <Button asChild variant="outline" className="w-full group">
                <Link href={`/projects/${project.slug}`}>
                  <span>View Project</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}