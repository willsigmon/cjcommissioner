export type CampaignPhoto = {
  alt: string;
  caption: string;
  label: string;
  position?: string;
  ratio: "landscape" | "portrait" | "square";
  span: 4 | 5 | 6 | 7;
  src: string;
};

export const chestnutStreetParkPhotos: CampaignPhoto[] = [
  {
    alt: "CJ Turrentine with community members at Chestnut Street Park",
    caption:
      "Phase one is complete at Chestnut Street Park, with the work toward phase two still moving forward.",
    label: "Chestnut Street Park",
    ratio: "landscape",
    span: 7,
    src: "/photos/park-community-gathering.webp",
  },
  {
    alt: "CJ Turrentine helping at a youth activity in a Vance County park",
    caption:
      "Safe places, consistent adults, and youth opportunity are part of the work.",
    label: "Park and Play",
    ratio: "landscape",
    span: 5,
    src: "/photos/park-and-play.webp",
  },
];

export const homePhotos: CampaignPhoto[] = [
  {
    alt: "CJ Turrentine helping with food distribution at a community event",
    caption: "Service means doing the practical work in front of you.",
    label: "Community care",
    ratio: "portrait",
    span: 5,
    src: "/photos/community-food-support.webp",
  },
  {
    alt: "CJ Turrentine with a local small-business owner",
    caption: "Local opportunity starts with listening to the people building here.",
    label: "Small business",
    ratio: "portrait",
    span: 6,
    src: "/photos/small-business-visit.webp",
  },
  {
    alt: "CJ Turrentine with public leaders during a North Carolina visit",
    caption: "Strong local leadership requires relationships beyond one room.",
    label: "Public service",
    ratio: "portrait",
    span: 4,
    src: "/photos/public-service.webp",
  },
  {
    alt: "CJ Turrentine in conversation with community partners",
    caption: "The work begins by sitting down, hearing people, and staying engaged.",
    label: "Planning together",
    ratio: "portrait",
    span: 4,
    src: "/photos/community-planning.webp",
  },
  {
    alt: "CJ Turrentine outdoors with two community leaders",
    caption: "Partnership is how good ideas become dependable programs.",
    label: "Shared leadership",
    ratio: "portrait",
    span: 4,
    src: "/photos/community-leaders-outdoors.webp",
  },
  {
    alt: "CJ Turrentine talking with neighbors at a community gathering",
    caption: "Showing up is not a campaign season habit. It is the work.",
    label: "Neighbor to neighbor",
    ratio: "portrait",
    span: 6,
    src: "/photos/neighbors-in-conversation.webp",
  },
  {
    alt: "CJ Turrentine with a fellow veteran at a community event",
    caption: "Military service continues as a commitment to people at home.",
    label: "Veteran community",
    ratio: "portrait",
    span: 6,
    src: "/photos/american-legion-community.webp",
  },
];

export const storyPhotos: CampaignPhoto[] = [
  {
    alt: "CJ Turrentine during a North Carolina civic visit",
    caption: "Learning how decisions move from public institutions to local lives.",
    label: "Civic leadership",
    ratio: "portrait",
    span: 4,
    src: "/photos/north-carolina-partnership.webp",
  },
  {
    alt: "CJ Turrentine with a neighbor at a community event",
    caption: "A record built face to face.",
    label: "Community",
    ratio: "portrait",
    span: 4,
    src: "/photos/community-event.webp",
  },
  {
    alt: "CJ Turrentine with a neighbor at an outdoor community gathering",
    caption: "Every neighborhood deserves leadership that is present and accessible.",
    label: "Showing up",
    ratio: "portrait",
    span: 4,
    src: "/photos/neighbors-at-community-event.webp",
  },
  {
    alt: "CJ Turrentine taking a photo with a community member",
    caption: "Relationships are the foundation of safer, more connected communities.",
    label: "Connection",
    ratio: "landscape",
    span: 6,
    src: "/photos/community-selfie.webp",
  },
  {
    alt: "CJ Turrentine with a longtime community member",
    caption: "Respecting the people who built Vance County while preparing what comes next.",
    label: "Across generations",
    ratio: "landscape",
    span: 6,
    src: "/photos/community-connection.webp",
  },
  {
    alt: "CJ Turrentine attending a youth recognition event",
    caption: "Young people should be celebrated, mentored, and connected to opportunity.",
    label: "Youth achievement",
    position: "50% 42%",
    ratio: "portrait",
    span: 6,
    src: "/photos/youth-achievement.webp",
  },
  {
    alt: "An archival family photo of CJ Turrentine with relatives",
    caption: "Service begins with the people and values that shape us.",
    label: "From the archive",
    ratio: "portrait",
    span: 6,
    src: "/photos/family-archive.webp",
  },
  {
    alt: "An archival photo of CJ Turrentine at a community youth event",
    caption: "A long record of making time for young people.",
    label: "Youth archive",
    ratio: "portrait",
    span: 6,
    src: "/photos/youth-archive.webp",
  },
  {
    alt: "An archival photo of CJ Turrentine with fellow service members and veterans",
    caption: "The bonds of service continue after the uniform comes off.",
    label: "Service archive",
    position: "50% 40%",
    ratio: "portrait",
    span: 6,
    src: "/photos/veterans-community-archive.webp",
  },
];
