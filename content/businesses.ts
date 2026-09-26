export interface Business {
  id: string;
  name: string;
  website: string;
  shortDescription: string;
  role: string;
  logo?: string;
  status?: string;
}

export const businesses: Business[] = [
  {
    id: "sahaya",
    name: "Sahaya",
    website: "https://sahaya.tech",
    shortDescription:
      "Innovation Made Easy. SaaS technology and agency developing products such as NexOrder, Sahaya Inventory, PitchX, Inceptus AI, and AdEase AI.",
    role: "Founder (Shreyansh J. Patni), Co-founder (Naman G. Suthar)",
    status: "Active",
  },
  {
    id: "th3-media",
    name: "th3.media",
    website: "https://th3.media",
    shortDescription:
      "Media and content brand network covering technology, sports, travel, wealth, and drive.",
    role: "Founder",
    status: "Active",
  },
];
