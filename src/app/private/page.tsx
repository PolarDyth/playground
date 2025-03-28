"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, PlusCircle, X, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { formSchema } from "./schema";
import { handleSubmitProject } from "./actions";
import { toast } from "sonner";

type FormValues = z.infer<typeof formSchema>;

export default function PrivatePage() {
  const [skillInput, setSkillInput] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data: {
        title: "",
        description: "",
        skills: [],
        testimonial: {
          content: "",
          author: "",
          role: "",
        },
      },
      slug: "",
    },
  });

  const {
    watch,
    setValue,
    getValues,
    handleSubmit,
  } = form;
  const skills = watch("data.skills");
  const title = watch("data.title");

  // Generate slug from title
  useEffect(() => {
    if (autoSlug && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [title, autoSlug, setValue]);

  // Generate a random slug
  const generateRandomSlug = () => {
    const randomStr = Math.random().toString(36).substring(2, 10);
    const prefix = getValues("data.title")
      ? getValues("data.title")
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .substring(0, 10)
      : "project";

    const newSlug = `${prefix}-${randomStr}`;
    setValue("slug", newSlug, { shouldValidate: true });
  };

  // Add skill to the skills array
  const addSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setValue("data.skills", [...(skills || []), trimmedSkill], {
        shouldValidate: true,
      });
      setSkillInput("");
    }
  };

  // Remove skill from the skills array
  const removeSkill = (skill: string) => {
    setValue(
      "data.skills",
      skills.filter((s) => s !== skill),
      { shouldValidate: true }
    );
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      // Make sure values has both data and slug
      if (!values.slug) {
        // Generate a slug if missing
        const randomStr = Math.random().toString(36).substring(2, 8);
        const prefix = values.data.title
          ? values.data.title
              .toLowerCase()
              .replace(/[^\w\s-]/g, "")
              .replace(/\s+/g, "-")
              .substring(0, 10)
          : "project";

        values.slug = `${prefix}-${randomStr}`;
      }

      const result = await handleSubmitProject(values);

      console.log("Server response:", result);

      if (result && "success" in result && result.success) {
        toast.success(result.message);
        form.reset();
      } else {
        toast.error(result?.message || "Failed to create project");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to submit project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-3xl py-10">
      <Card className="border-border/40 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Create New Project
          </CardTitle>
          <CardDescription>
            Add a new project to your portfolio with details and skills
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title form Field */}
              <FormField
                control={form.control}
                name="data.title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="My Awesome Project"
                        {...field}
                        className="focus-visible:ring-primary/50"
                      />
                    </FormControl>
                    <FormDescription>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="auto-slug"
                      checked={autoSlug}
                      onCheckedChange={setAutoSlug}
                    />
                    <Label htmlFor="auto-slug">
                      Auto-generate slug from title
                    </Label>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateRandomSlug}
                    className="flex items-center text-xs"
                  >
                    <RefreshCw className="mr-1 h-3 w-3" />
                    Generate Random
                  </Button>
                </div>

                {/* Slug form Field */}
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Slug</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="my-project-slug"
                          {...field}
                          disabled={autoSlug}
                          className="focus-visible:ring-primary/50"
                        />
                      </FormControl>
                      <FormDescription>
                        This will be used in the URL: example.com/projects/
                        {field.value || "my-project-slug"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="data.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your project..."
                        {...field}
                        className="min-h-32 resize-none focus-visible:ring-primary/50"
                      />
                    </FormControl>
                    <FormDescription>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="data.skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills Used</FormLabel>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Add a skill (e.g. React, TypeScript)"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addSkill())
                        }
                        className="focus-visible:ring-primary/50"
                      />
                      <Button
                        type="button"
                        onClick={addSkill}
                        size="icon"
                        variant="outline"
                        className="shrink-0"
                      >
                        <PlusCircle className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {field.value && field.value.length > 0 ? (
                        field.value.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="gap-1 text-sm group"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="ml-1 rounded-full p-0.5 text-secondary-foreground/70 hover:bg-secondary-foreground/10 hover:text-secondary-foreground transition"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          No skills added yet
                        </p>
                      )}
                    </div>
                    <FormDescription>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4 border border-border/60 rounded-lg p-4 bg-muted/30">
                <h3 className="font-medium">Testimonial</h3>

                <FormField
                  control={form.control}
                  name="data.testimonial.content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Feedback</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What the client said about this project..."
                          {...field}
                          className="min-h-24 resize-none focus-visible:ring-primary/50"
                        />
                      </FormControl>
                      <FormDescription>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="data.testimonial.author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Smith"
                            {...field}
                            className="focus-visible:ring-primary/50"
                          />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="data.testimonial.role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author Role</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="CEO at Company"
                            {...field}
                            className="focus-visible:ring-primary/50"
                          />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Project...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
