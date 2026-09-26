export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  companyUrl?: string;
  badge?: string;
  type?: string;
  location?: string;
  logo?: string;
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
    logo: "/images/organizations/sahaya.png",
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
    logo: "/images/organizations/th3-media.png",
  },
  {
    id: "lt-edutech-data-analyst",
    company: "L&T",
    role: "Data Analyst",
    startDate: "Jul 2023",
    endDate: "Sep 2023",
    description:
      "Supported data analytics projects through Python-based data processing, data cleaning, analysis, aggregation, and visualization.",
    companyUrl: "https://www.linkedin.com/company/89937516/",
    type: "Internship",
    location: "Vadodara, Gujarat, India · Remote",
    logo: "/images/organizations/lt.png",
  },
];
