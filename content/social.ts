export interface SocialAccount {
  id: string;
  platform: string;
  label: string;
  url: string;
  username?: string;
  iconIdentifier?: string;
}

export const socialAccounts: SocialAccount[] = [
  {
    id: "x",
    platform: "X",
    label: "X",
    url: "https://x.com/shreyanshpatni_",
    username: "@shreyanshpatni_",
  },
  {
    id: "instagram",
    platform: "Instagram",
    label: "Instagram",
    url: "https://instagram.com/shreyansh.patnii",
    username: "@shreyansh.patnii",
  },
  {
    id: "threads",
    platform: "Threads",
    label: "Threads",
    url: "https://threads.net/@shreyansh.patnii",
    username: "@shreyansh.patnii",
  },
  {
    id: "medium",
    platform: "Medium",
    label: "Medium",
    url: "https://medium.com/@shreyanshpatni_",
    username: "@shreyanshpatni_",
  },
  {
    id: "github",
    platform: "GitHub",
    label: "GitHub",
    url: "https://github.com/Shreyansh-patni",
    username: "Shreyansh-patni",
  },
  {
    id: "linkedin",
    platform: "LinkedIn",
    label: "LinkedIn",
    url: "https://linkedin.com/in/shreyanshpatnii",
    username: "shreyanshpatnii",
  },
];
