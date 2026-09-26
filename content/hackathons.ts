export interface Hackathon {
  id: string;
  name: string;
  result?: string;
  date?: string;
  description?: string;
  url?: string;
}

export const hackathons: Hackathon[] = [];
