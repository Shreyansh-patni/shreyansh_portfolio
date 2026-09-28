export interface InterestGroup {
  id: string;
  label: string;
  subInterests: string[];
}

export const interestGroups: InterestGroup[] = [
  {
    id: "ai",
    label: "AI",
    subInterests: [
      "Machine Learning",
      "Generative AI",
      "LLMs",
      "AI Tools",
      "AI Applications",
      "AI Automation",
    ],
  },
  {
    id: "software",
    label: "Software",
    subInterests: [
      "Software Development",
      "Web Development",
      "APIs",
      "Cloud",
      "Automation",
      "Developer Tools",
    ],
  },
  {
    id: "saas",
    label: "SaaS",
    subInterests: [
      "SaaS Products",
      "B2B Software",
      "Subscriptions",
      "Product Development",
      "SaaS Growth",
    ],
  },
  {
    id: "startups",
    label: "Startups",
    subInterests: [
      "Entrepreneurship",
      "Startups",
      "Venture Capital",
      "Investing",
      "Business Strategy",
      "Market Research",
    ],
  },
  {
    id: "product",
    label: "Product",
    subInterests: [
      "Product Development",
      "Product Strategy",
      "MVPs",
      "Product Launch",
      "Growth",
      "User Experience",
    ],
  },
  {
    id: "design",
    label: "Design",
    subInterests: [
      "UI/UX",
      "Web Design",
      "Design Systems",
      "Visual Design",
      "Interaction Design",
    ],
  },
  {
    id: "media",
    label: "Media",
    subInterests: [
      "Media",
      "Content Creation",
      "Social Media",
      "Personal Branding",
      "Creator Economy",
    ],
  },
  {
    id: "business",
    label: "Business",
    subInterests: [
      "Business Strategy",
      "Growth",
      "Marketing",
      "Distribution",
      "Monetization",
      "Operations",
    ],
  },
  {
    id: "technology",
    label: "Technology",
    subInterests: [
      "Technology",
      "Developer Tools",
      "Cloud Computing",
      "APIs",
      "Open Source",
      "Emerging Technology",
    ],
  },
  {
    id: "sports",
    label: "Sports",
    subInterests: [
      "Football",
      "Formula 1",
      "Sports Media",
      "Sports Content",
    ],
  },
  {
    id: "travel",
    label: "Travel",
    subInterests: [
      "Travel",
      "Travel Media",
      "Exploration",
      "Travel Content",
    ],
  },
  {
    id: "wealth",
    label: "Wealth",
    subInterests: [
      "Finance",
      "Investing",
      "Wealth",
      "Business",
      "Financial Markets",
    ],
  },
  {
    id: "automotive",
    label: "Automotive",
    subInterests: [
      "Cars",
      "Automotive",
      "Automotive Media",
      "Automotive Technology",
    ],
  },
];
