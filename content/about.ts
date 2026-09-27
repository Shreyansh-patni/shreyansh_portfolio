export interface HighlightText {
  text: string;
  highlight?: boolean;
  link?: string;
}

export interface CurrentlyItem {
  text: string;
  linkText?: string;
  linkUrl?: string;
}

export interface AboutContent {
  intro: HighlightText[][];
  currently: CurrentlyItem[];
  interests: string[];
}

export const aboutData: AboutContent = {
  intro: [
    [
      { text: "Developer and founder building " },
      { text: "software products", highlight: true },
      { text: ", " },
      { text: "SaaS solutions", highlight: true },
      { text: ", " },
      { text: "AI applications", highlight: true },
      { text: ", and " },
      { text: "media brands", highlight: true },
      { text: "." },
    ],
    [
      { text: "Currently pursuing " },
      { text: "Computer Science & Engineering at PES University", highlight: true },
      { text: ", after completing a diploma in CSE from " },
      { text: "Gujarat Technological University", highlight: true },
      { text: "." },
    ],
    [
      { text: "Currently building and scaling " },
      { text: "/sahaya", highlight: true, link: "https://sahaya.tech/" },
      { text: " and " },
      { text: "/th3.media", highlight: true, link: "https://th3.media/" },
      { text: "." },
    ],
  ],
  currently: [
    {
      text: "Building and scaling ",
      linkText: "Sahaya",
      linkUrl: "https://sahaya.tech/",
    },
    {
      text: "Growing ",
      linkText: "th3.media",
      linkUrl: "https://th3.media/",
    },
    {
      text: "Working on new software/product ideas",
    },
    {
      text: "Exploring AI, SaaS, startups, and product development",
    },
  ],
  interests: [
    "AI",
    "SaaS",
    "Startups",
    "Product",
    "Software",
    "Media",
    "Technology",
  ],
};
