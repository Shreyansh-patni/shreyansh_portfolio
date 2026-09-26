export type AboutSegment =
  | { type: "text"; value: string }
  | { type: "highlight"; value: string };

export interface SocialLink {
  platform: string;
  label: string;
  url: string;
}

export interface Profile {
  name: string;
  handle: string;
  verified: boolean;
  shortBio: string;
  location: string;
  joinedDate: string;
  about: string;
  aboutSegments: AboutSegment[];
  avatar: string;
  banner: string;
  socialLinks: SocialLink[];
}

export const profile: Profile = {
  name: "Shreyansh Patni",
  handle: "@shreyanshpatni_",
  verified: true,
  shortBio: "20y/o | Building Tech. /sahaya.tech /th3.media",
  location: "BLR / BDQ",
  joinedDate: "November 2024",
  about:
    "Developer and founder building software products, SaaS solutions, and media brands. Pursuing Computer Science & Engineering at PES University and previously completed a diploma at Gujarat Technological University. Currently scaling Sahaya and th3.media.",
  aboutSegments: [
    {
      type: "text",
      value: "Developer and founder building ",
    },
    {
      type: "highlight",
      value: "software products, SaaS solutions, and media brands",
    },
    {
      type: "text",
      value: ". Pursuing ",
    },
    {
      type: "highlight",
      value: "Computer Science & Engineering at PES University",
    },
    {
      type: "text",
      value: " and previously completed a diploma at ",
    },
    {
      type: "highlight",
      value: "Gujarat Technological University",
    },
    {
      type: "text",
      value: ". Currently scaling ",
    },
    {
      type: "highlight",
      value: "Sahaya and th3.media",
    },
    {
      type: "text",
      value: ".",
    },
  ],
  avatar: "/images/profile/avatar.png",
  banner: "/images/profile/banner.png",
  socialLinks: [
    {
      platform: "Website",
      label: "sahaya.tech",
      url: "https://sahaya.tech",
    },
    {
      platform: "Website",
      label: "th3.media",
      url: "https://th3.media",
    },
  ],
};
