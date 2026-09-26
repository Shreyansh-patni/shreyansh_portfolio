export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description: string;
  companyUrl?: string;
  badge?: string;
}

export const experiences: Experience[] = [
  {
    id: "sahaya-founder",
    company: "Sahaya",
    role: "Founder",
    startDate: "2024",
    current: true,
    description:
      "Leading SaaS technology development and agency operations.",
    companyUrl: "https://sahaya.tech",
    badge: "Founder",
  },
  {
    id: "th3-media-founder",
    company: "th3.media",
    role: "Founder",
    startDate: "2024",
    current: true,
    description:
      "Directing content network strategy across technology, sports, travel, wealth, and drive verticals.",
    companyUrl: "https://th3.media",
    badge: "Founder",
  },
];
