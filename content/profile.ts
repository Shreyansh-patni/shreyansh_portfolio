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
  email: string;
  verified: boolean;
  shortBio: string;
  location: string;
  about: string;
  aboutSegments: AboutSegment[];
  avatar: string;
  banner: string;
  socialLinks: SocialLink[];
}

export function calculateAge(
  birthDate: Date = new Date(2006, 10, 29),
  targetDate: Date = new Date()
): number {
  let age = targetDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = targetDate.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && targetDate.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

export const profile: Profile = {
  name: "Shreyansh Patni",
  handle: "@shreyanshpatni",
  email: "Shreyansh@sahaya.tech",
  verified: true,
  get shortBio() {
    return `${calculateAge()}y/o | Building Tech. /sahaya.tech /th3.media`;
  },
  location: "Bangalore",
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
