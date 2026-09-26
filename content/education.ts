export interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate?: string;
  endDate?: string;
  description: string;
  url?: string;
  logo?: string;
}

export const educationList: Education[] = [
  {
    id: "pes-university",
    institution: "PES University",
    degree: "B.Tech in CSE (Lateral Entry)",
    startDate: "2026",
    endDate: "PRESENT",
    description:
      "Undergraduate degree focusing on Computer Science and Engineering fundamentals, system architecture, and software design.",
    logo: "/images/organizations/pes-university.png",
  },
  {
    id: "gtu-diploma",
    institution: "GTU (Gujarat Technological University)",
    degree: "Diploma in CSE",
    startDate: "2022",
    endDate: "2025",
    description:
      "Diploma in Computer Science & Engineering establishing core programming, algorithmic, and computing principles.",
    logo: "/images/organizations/gtu.png",
  },
];
