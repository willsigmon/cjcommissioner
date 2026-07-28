export type ProofMetric = {
  value: string;
  label: string;
};

export type ResultStage = "Done" | "Underway" | "Next";

export type ResultCase = {
  id: string;
  kicker: string;
  outcome: string;
  role: string;
  partners: string;
  proof: string[];
  next: string;
};

export type Priority = {
  number: string;
  title: string;
  summary: string;
};

export const campaign = {
  candidate: "CJ Turrentine",
  office: "Vance County Commissioner",
  district: "District 3",
  status: "On the ballot November 3, 2026",
  email: "cturrentinejr@gmail.com",
  phoneDisplay: "(252) 204-9334",
  phoneHref: "+12522049334",
  address: "1110 Carey Chapel Road, Henderson, NC 27537",
  disclaimer: "Paid for by CJ Turrentine for Commissioner",
} as const;

export const proofMetrics: ProofMetric[] = [
  { value: "$140K+", label: "community-led park fundraising" },
  { value: "12+", label: "community read-ins" },
  { value: "4 → 60+", label: "youth reached since 2025" },
  { value: "Weekly", label: "youth touchpoints" },
];

export const resultCases: ResultCase[] = [
  {
    id: "revitalization",
    kicker: "Neighborhood revitalization",
    outcome:
      "More than $140,000 raised with the community to move Chestnut Street Park forward.",
    role:
      "CJ helped organize neighbors, partners, and sustained fundraising around a shared vision for the park.",
    partners: "In partnership with Henderson-Vance Recreation and Parks.",
    proof: [
      "Phase one completed",
      "Community-led fundraising exceeded $140,000",
      "A neglected space became a source of neighborhood pride",
    ],
    next:
      "Keep leading the work toward phase two and use the same community-first model in more neighborhoods.",
  },
  {
    id: "youth",
    kicker: "Youth and education",
    outcome:
      "Participation grew from four young people in 2025 to more than sixty today.",
    role:
      "CJ built consistent touchpoints around literacy, mentoring, safe places, and a path toward work.",
    partners:
      "With Perry Memorial Library, AIM High, Park and Play, families, and community volunteers.",
    proof: [
      "More than twelve community read-ins",
      "Weekly youth touchpoints",
      "Literacy and mentoring paired with safe environments",
    ],
    next:
      "Connect more young people to career pathways, trusted adults, and places where they can learn and belong.",
  },
  {
    id: "peace",
    kicker: "Safe, connected communities",
    outcome:
      "Pathways 2 Peace brings people together before a crisis—not only after one.",
    role:
      "CJ frames public safety as relationship building, mentorship, literacy, and opportunity creation.",
    partners: "Alongside residents, faith leaders, mentors, and local partners.",
    proof: [
      "Ongoing relationship building",
      "Mentorship and literacy work",
      "Opportunity as a foundation for safer neighborhoods",
    ],
    next:
      "Keep changing mindsets by connecting more residents—especially young people—to support and opportunity.",
  },
];

export const priorities: Priority[] = [
  {
    number: "01",
    title: "Youth & Education",
    summary:
      "Grow literacy, mentoring, safe environments, and career pathways through dependable weekly contact—not one-time programs.",
  },
  {
    number: "02",
    title: "Responsible Growth & Opportunity",
    summary:
      "Vance County has a strong workforce. As data centers and other new technologies consider this region, negotiate from strength so growth protects resources, creates local opportunity, and returns real value to residents.",
  },
  {
    number: "03",
    title: "Neighborhood Revitalization",
    summary:
      "Restore neighborhoods by organizing with the people who live there. Progress is not only new structures; it is pride, trust, and shared ownership.",
  },
  {
    number: "04",
    title: "Safe, Connected Communities",
    summary:
      "Build safety through relationships, mentorship, literacy, and opportunity while supporting practical, accountable public-safety work.",
  },
];

export const leadership = [
  "Henderson-Vance Crime Stoppers Board — second term",
  "Chair, Henderson Community-Wide Advisory Committee",
  "Vance Charter School Board of Directors",
  "Director, Community Partners of Hope Men’s Shelter — five years",
  "Salvation Army Advisory Board",
  "Leadership Vance Class of 2025",
] as const;
