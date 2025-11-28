"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { createMovieSchema } from "@/lib/validations";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createMovie } from "@/lib/admin/actions/movie";

interface Props {
  type?: "create" | "update";
  movie?: Partial<Movie>;
}

const MovieForm = ({ type, ...movie }: Props) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof createMovieSchema>>({
    resolver: zodResolver(createMovieSchema),
    defaultValues: {
      title: movie.title || "",
      description: movie.description || "",
      director: movie.director || "",
      genre: movie.genre || "",
      rating: movie.rating ? Number(movie.rating) : 1,
      coverUrl: movie.coverUrl || "",
      coverColor: movie.coverColor || "#000000", // Add default hex color
      summary: movie.summary || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof createMovieSchema>) => {
    const result = await createMovie(values);

    if (result.success) {
      alert("Movie created successfully");
      router.push(`/admin/movies`);
    } else {
      alert(`Error: ${result.message}`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name={"title"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Movie Title
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="Movie title"
                  {...field}
                  className="movie-form_input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"coverUrl"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Cover Image URL
              </FormLabel>
              <FormControl>
                <Input
                  required
                  type="url"
                  placeholder="https://placehold.co/400x600.png"
                  {...field}
                  className="movie-form_input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"coverColor"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Cover Color (Hex)
              </FormLabel>
              <FormControl>
                <Input
                  required
                  type="text"
                  placeholder="#FF5733"
                  {...field}
                  className="movie-form_input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"director"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Director
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="Movie director"
                  {...field}
                  className="movie-form_input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"genre"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Genre
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="Movie genre"
                  {...field}
                  className="movie-form_input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"rating"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Rating
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  placeholder="Movie rating"
                  {...field}
                  className="movie-form_input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"description"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Movie Description
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Movie description"
                  {...field}
                  rows={10}
                  className="movie-form_input"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"summary"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Movie Summary
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Movie summary"
                  {...field}
                  rows={5}
                  className="movie-form_input"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="movie-form_btn text-white">
          Add Movie to Library
        </Button>
      </form>
    </Form>
  );
};
export default MovieForm;
