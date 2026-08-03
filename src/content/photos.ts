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
    alt: "CJ Turrentine and a community partner holding Empower Peace and Investing in Prevention signs",
    caption:
      "Investing in prevention means building relationships, opportunity, and peace before a crisis arrives.",
    label: "Violence prevention",
    ratio: "portrait",
    span: 6,
    src: "/photos/violence-prevention.webp",
  },
  {
    alt: "CJ Turrentine with a community partner outdoors",
    caption:
      "Showing up with the people and leaders who make community life stronger.",
    label: "Community connection",
    ratio: "portrait",
    span: 6,
    src: "/photos/community-recognition.webp",
  },
  {
    alt: "CJ Turrentine with two community leaders at an event",
    caption:
      "Service grows through relationships, collaboration, and people willing to do the work together.",
    label: "Shared leadership",
    ratio: "portrait",
    span: 6,
    src: "/photos/community-leaders.webp",
  },
  {
    alt: "CJ Turrentine with community members after a service event",
    caption:
      "Community work is built with neighbors, families, and volunteers showing up together.",
    label: "Community care",
    ratio: "landscape",
    span: 7,
    src: "/photos/community-volunteers.webp",
  },
  {
    alt: "CJ Turrentine with a community member outdoors",
    caption: "A campaign rooted in direct relationships and everyday conversations.",
    label: "Neighbor to neighbor",
    ratio: "portrait",
    span: 5,
    src: "/photos/community-gathering.webp",
  },
  {
    alt: "CJ Turrentine with a fire chief and a young person at a bicycle event",
    caption: "Safe, practical opportunities give young people room to grow.",
    label: "Youth opportunity",
    ratio: "portrait",
    span: 6,
    src: "/photos/youth-bicycle-giveaway.webp",
  },
  {
    alt: "CJ Turrentine speaking with young people and community partners in a gym",
    caption: "Listening to young people and making space for honest conversation.",
    label: "Youth voice",
    ratio: "landscape",
    span: 7,
    src: "/photos/youth-forum.webp",
  },
  {
    alt: "CJ Turrentine with community and public-service partners at a North Carolina General Assembly press conference",
    caption:
      "Public service is strongest when community voices are present in the room.",
    label: "Public service",
    ratio: "landscape",
    span: 7,
    src: "/photos/nc-press-conference.webp",
  },
  {
    alt: "CJ Turrentine with Army leaders and fellow veterans",
    caption: "The bonds of military service continue after the uniform comes off.",
    label: "Military service",
    ratio: "portrait",
    span: 6,
    src: "/photos/military-service.webp",
  },
];
