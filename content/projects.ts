export interface Project {
  id: string;
  name: string;
  description: string;
  url?: string;
  image?: string;
  technologies?: string[];
  status?: string;
}

export const projects: Project[] = [
  {
    id: "buildrs-hq",
    name: "BuildrsHQ",
    description:
      "An AI-native product workspace for indie founders that connects idea validation, research, product planning, and execution in one place.",
    url: "https://buildrs.app",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    status: "In Development",
  },
  {
    id: "agency-os",
    name: "Agency OS",
    description:
      "Internal operations and client workflow management platform.",
    technologies: ["Next.js", "TypeScript"],
    status: "In Development",
  },
  {
    id: "nexorder",
    name: "NexOrder",
    description:
      "SaaS order and operational management solution built under Sahaya.",
    url: "https://sahaya.tech",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    status: "Active",
  },
  {
    id: "self-checkout-pos",
    name: "Self-Checkout POS Prototype",
    description:
      "Automated self-checkout point-of-sale prototype system.",
    technologies: ["TypeScript", "React"],
    status: "Prototype",
  },
];
