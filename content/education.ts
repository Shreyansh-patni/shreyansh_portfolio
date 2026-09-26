export interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate?: string;
  endDate?: string;
  description: string;
  url?: string;
}

export const educationList: Education[] = [
  {
    id: "pes-university",
    institution: "PES University, Bengaluru",
    degree: "B.Tech in Computer Science & Engineering (Lateral Entry)",
    startDate: "2026",
    endDate: "PRESENT",
    description:
      "Undergraduate degree focusing on Computer Science and Engineering fundamentals, system architecture, and software design.",
  },
  {
    id: "gtu-diploma",
    institution: "Gujarat Technological University (GTU)",
    degree: "Diploma in Computer Science",
    startDate: "2022",
    endDate: "2025",
    description:
      "Diploma in Computer Science & Engineering establishing core programming, algorithmic, and computing principles.",
  },
];
