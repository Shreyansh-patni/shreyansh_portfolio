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
    "Developer and founder building software products, SaaS solutions, and media brands.",
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
