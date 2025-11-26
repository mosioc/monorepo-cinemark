// Typescript declration file

interface Movie {
  id: string;
  title: string;
  director: string;
  genre: string;
  rating: number;
  description: string;
  coverColor: string;
  coverUrl: string;
  videoUrl: string;
  summary: string;
  createdAt: Date | null;
}

declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}
