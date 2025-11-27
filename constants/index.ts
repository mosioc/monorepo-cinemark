export const navigationLinks = [
  {
    href: "/cinema",
    label: "Cinema",
  },

  {
    img: "/icons/user.svg",
    selectedImg: "/icons/user-fill.svg",
    href: "/profile",
    label: "Profile",
  },
];

export const adminSideBarLinks = [
  {
    img: "/icons/admin/home.svg",
    route: "/admin",
    text: "Dashboard",
  },
  {
    img: "/icons/admin/users.svg",
    route: "/admin/users",
    text: "All Users",
  },
  {
    img: "/icons/admin/movie.svg",
    route: "/admin/movies",
    text: "All Movies",
  },
  {
    img: "/icons/admin/bookmark.svg",
    route: "/admin/purchase-records",
    text: "Purchase Records",
  },
  {
    img: "/icons/admin/user.svg",
    route: "/admin/account-requests",
    text: "Account Requests",
  },
];

export const FIELD_NAMES = {
  fullName: "Full Name",
  email: "Email",
  userId: "User ID",
  password: "Password",
};

export const FIELD_TYPES = {
  fullName: "text",
  email: "email",
  userId: "number",
  password: "password",
};

export const sampleMovies = [
  {
    id: 1,
    title: "Casablanca",
    director: "Michael Curtiz",
    genre: "Romance / Drama / War",
    // IMDb rating ~8.5/10 -> 4.3/5
    rating: 4.3,
    description:
      "Set during World War II, an American expatriate (Rick) must choose between his love for Ilsa and helping her husband escape to continue his fight against the Nazis.",
    coverColor: "#1c1f40",
    // IMDb/Amazon hosted poster image (IMDb uses m.media-amazon.com)
    coverUrl:
      "https://m.media-amazon.com/images/M/MV5BNWEzN2U1YTYtYTQyMS00NTVkLWE2NGQtZWFlMmM0MDNjMmRiXkEyXkFqcGc@._V1_FMjpg_UX500_.jpg",
    videoUrl: "/sample-trailer.mp4?updatedAt=1722593504152",
    summary:
      "Classic 1942 romantic drama about love, sacrifice and duty in wartime Casablanca.",
    source: {
      imdb: "https://www.imdb.com/title/tt0034583/",
      wiki: "https://en.wikipedia.org/wiki/Casablanca_(film)",
    },
  },
  {
    id: 2,
    title: "The Matrix",
    director: "Lana Wachowski, Lilly Wachowski",
    genre: "Sci-Fi / Action",
    // IMDb rating ~8.7/10 -> 4.4/5
    rating: 4.4,
    description:
      "A hacker (Neo) discovers the reality he knows is a simulation called the Matrix and joins rebels fighting its controllers.",
    coverColor: "#fffdf6",
    coverUrl:
      "https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRhXkEyXkFqcGc@._V1_FMjpg_UY3156_.jpg",
    videoUrl: "/sample-trailer.mp4?updatedAt=1722593504152",
    summary:
      "1999 sci-fi/action landmark about reality, control and a rebellion against a simulated world.",
    source: {
      imdb: "https://www.imdb.com/title/tt0133093/",
      wiki: "https://en.wikipedia.org/wiki/The_Matrix",
    },
  },
  {
    id: 3,
    title: "Interstellar",
    director: "Christopher Nolan",
    genre: "Sci-Fi / Adventure / Drama",
    // IMDb rating ~8.6/10 -> 4.3/5
    rating: 4.3,
    description:
      "As Earth becomes uninhabitable, a former pilot leads an expedition through a wormhole to find a new home for humanity.",
    coverColor: "#f8e036",
    coverUrl:
      "https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_FMjpg_UY3600_.jpg",
    videoUrl: "/sample-trailer.mp4?updatedAt=1722593504152",
    summary:
      "Christopher Nolan's 2014 epic about family, time, gravity and humanity's survival.",
    source: {
      imdb: "https://www.imdb.com/title/tt0816692/",
      wiki: "https://en.wikipedia.org/wiki/Interstellar_(film)",
    },
  },
  {
    id: 4,
    title: "Blade Runner",
    director: "Ridley Scott",
    genre: "Sci-Fi / Thriller / Neo-Noir",
    // IMDb rating ~8.1/10 -> 4.1/5
    rating: 4.1,
    description:
      "In a dystopian Los Angeles, a blade runner is tasked with hunting down rogue replicants—bioengineered humans.",
    coverColor: "#ed6322",
    coverUrl:
      "https://m.media-amazon.com/images/M/MV5BOWQ4YTBmNTQtMDYxMC00NGFjLTkwOGQtNzdhNmY1Nzc1MzUxXkEyXkFqcGc@._V1_FMjpg_UY4250_.jpg",
    videoUrl: "/sample-trailer.mp4?updatedAt=1722593504152",
    summary:
      "Ridley Scott's 1982 sci-fi noir exploring identity, memory and what it means to be human.",
    source: {
      imdb: "https://www.imdb.com/title/tt0083658/",
      wiki: "https://en.wikipedia.org/wiki/Blade_Runner",
    },
  },
  {
    id: 5,
    title: "The Godfather",
    director: "Francis Ford Coppola",
    genre: "Crime / Drama / Mafia",
    // IMDb rating ~ 9.2/10 -> 4.6/5
    rating: 4.6,
    description:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    coverColor: "#000000",
    coverUrl:
      "https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_FMjpg_UY1982_.jpg",
    videoUrl: "/sample-trailer.mp4?updatedAt=1722593504152",
    summary:
      "An epic tale of power, family, and betrayal — the Corleone crime family’s legacy is passed on to Michael Corleone, who is torn between the life he wants and the destiny thrust upon him.",
    source: {
      imdb: "https://www.imdb.com/title/tt0068646/", // IMDb page :contentReference[oaicite:0]{index=0}
      wiki: "https://en.wikipedia.org/wiki/The_Godfather", // Wikipedia :contentReference[oaicite:1]{index=1}
    },
  },
];

export const sorts = [
  {
    value: "oldest",
    label: "Oldest Releases",
  },
  {
    value: "newest",
    label: "Newest Releases",
  },
  {
    value: "available",
    label: "Available Now",
  },
  {
    value: "highestRated",
    label: "Top Rated",
  },
];

export const userRoles = [
  {
    value: "viewer",
    label: "Viewer",
    bgColor: "bg-[#FDF2FA]",
    textColor: "text-[#C11574]",
  },
  {
    value: "admin",
    label: "Admin",
    bgColor: "bg-[#ECFDF3]",
    textColor: "text-[#027A48]",
  },
];

export const purchaseStatuses = [
  {
    value: "pending",
    label: "Pending",
    bgColor: "bg-[#FFF7ED]",
    textColor: "text-[#A55B00]",
  },
  {
    value: "purchased",
    label: "Purchased",
    bgColor: "bg-[#F9F5FF]",
    textColor: "text-[#6941C6]",
  },
  {
    value: "refunded",
    label: "Refunded",
    bgColor: "bg-[#F0F9FF]",
    textColor: "text-[#026AA2]",
  },
];
