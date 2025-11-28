// Typescript declration file

declare interface Movie {
  id: string;
  title: string;
  director: string;
  genre: string;
  rating: string;
  description: string;
  coverColor: string;
  coverUrl: string;
  summary: string;
  createdAt: Date | null;
}

declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

interface AuthCredentials {
  fullName: string;
  email: string;
  password: string;
}

interface MovieParams {
  title: string;
  director: string;
  genre: string;
  rating: number;
  coverUrl: string;
  coverColor: string;
  description: string;
  summary: string;
}
