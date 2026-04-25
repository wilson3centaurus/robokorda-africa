import { Award, Bot, BrainCircuit, Leaf, Medal, Trophy } from "lucide-react";
import type { GalleryItem } from "@/data/site";
import type { CompetitionTrack, CountryEntry, PrizeTier, WinnerStory } from "@/lib/page-types";

export const rircTracks: CompetitionTrack[] = [
  {
    title: "Robot Design Challenge",
    description:
      "Teams build, test, and present autonomous or semi-autonomous robotics solutions under timed challenge conditions.",
    seed: "rirc-robotics-design",
    icon: Bot,
  },
  {
    title: "AI Innovation Track",
    description:
      "Participants design practical AI-supported ideas that solve real community, business, or education problems.",
    seed: "rirc-ai-innovation",
    icon: BrainCircuit,
  },
  {
    title: "Sustainable Tech Showcase",
    description:
      "Teams present prototypes and systems that respond to sustainability, energy, agriculture, and environmental needs.",
    seed: "rirc-sustainable-tech",
    icon: Leaf,
  },
];

export const rircCountries: CountryEntry[] = [
  { code: "ng", name: "Nigeria" },
  { code: "gh", name: "Ghana" },
  { code: "cd", name: "Democratic Republic of the Congo" },
  { code: "dz", name: "Algeria" },
  { code: "bw", name: "Botswana" },
  { code: "us", name: "United States" },
  { code: "zm", name: "Zambia" },
  { code: "zw", name: "Zimbabwe" },
  { code: "cm", name: "Cameroon" },
  { code: "ci", name: "Côte d'Ivoire" },
  { code: "ke", name: "Kenya" },
  { code: "mw", name: "Malawi" },
];

export const rircPrizes: PrizeTier[] = [
  {
    title: "1st Place",
    amount: "RIRC Overall Winners Shield",
    summary: "Premier recognition for the strongest all-round team performance across all judging criteria.",
    benefits: [
      "Gold Medal",
      "1st Place Winner Certificate (per category)",
      "Robotics Kit",
      "Tablet",
      "Qualifies for Technoxian competition in India",
      "Fully sponsored Technoxian trip to India by Robokorda",
    ],
    icon: Trophy,
    imageSrc: "/images/rirc/1st-place.jpg",
  },
  {
    title: "2nd Place",
    amount: "RIRC Second Position Shield",
    summary: "Awarded to an outstanding team with strong technical execution and presentation quality.",
    benefits: [
      "Gold Medal",
      "2nd Place Winner Certificate (per category)",
      "Robotics Kit",
      "Tablet",
    ],
    icon: Award,
    imageSrc: "/images/rirc/2nd-place.jpg",
  },
  {
    title: "3rd Position",
    amount: "RIRC Third Position Shield",
    summary: "Celebrates an exceptional team with strong promise and practical innovation.",
    benefits: [
      "Gold Medal",
      "3rd Place Winner Certificate (per category)",
      "Robotics Kit",
    ],
    icon: Medal,
    imageSrc: "/images/rirc/3rd-place.jpg",
  },
];

export const rircWinners: WinnerStory[] = [
  {
    teamName: "Team Robo-Underdogs",
    country: "Zimbabwe",
    category: "Rusununguko High School",
    summary:
      "Built an underwater drone that could explore and record data values from aquatic life.",
    seed: "winner-team-robo-underdogs",
    imageSrc: "/images/rirc/winner-team.jpg",
    awardLabel: "Overall Winners",
  },
  {
    teamName: "Robo-gurus",
    country: "Ghana",
    category: "Beginner Level",
    summary:
      "Won 4/5 challenges at beginner level.",
    seed: "winner-robo-gurus",
    imageSrc: "/images/rirc/beginner-winner.jpg",
    awardLabel: "First Place Beginner Level",
  },
  {
    teamName: "Team Cyberflacx",
    country: "Zimbabwe",
    category: "National University of Science and Technology",
    summary:
      "Innovation Award for the most outstanding project.",
    seed: "winner-team-cyberflacx",
    imageSrc: "/images/rirc/makerthon.jpg",
    awardLabel: "1st Place Makerthon",
  },
];

export const rircGallery: GalleryItem[] = [
  {
    title: "Hon. Prof. Torerayi Moyo",
    subtitle: "Encouraging students to invest more in sustainable innovation.",
    imageSrc: "/images/rirc/minister.jpg",
    seed: "rirc-minister",
    size: "wide",
  },
  {
    title: "Robot pit lane",
    subtitle: "Final calibration and troubleshooting before judging sessions began.",
    imageSrc: "https://picsum.photos/seed/rirc-pit-lane/900/900",
    seed: "rirc-pit-lane",
    size: "square",
  },
  {
    title: "Judges' review table",
    subtitle: "Technical and innovation judges reviewed prototypes in detail.",
    imageSrc: "https://picsum.photos/seed/rirc-judges-review/900/1200",
    seed: "rirc-judges-review",
    size: "tall",
  },
  {
    title: "AI track presentation",
    subtitle: "Learners pitched scalable ideas with strong community impact framing.",
    imageSrc: "https://picsum.photos/seed/rirc-ai-track/900/900",
    seed: "rirc-ai-track",
    size: "square",
  },
  {
    title: "Design challenge finals",
    subtitle: "Crowds gathered for the highest-scoring robotics run of the day.",
    imageSrc: "https://picsum.photos/seed/rirc-design-finals/1200/900",
    seed: "rirc-design-finals",
    size: "wide",
  },
  {
    title: "Team strategy huddle",
    subtitle: "Mentors and learners made last-minute adjustments between rounds.",
    imageSrc: "https://picsum.photos/seed/rirc-strategy-huddle/900/900",
    seed: "rirc-strategy-huddle",
    size: "square",
  },
  {
    title: "Sustainable tech booth",
    subtitle: "Prototypes highlighted agriculture, water, and energy use cases.",
    imageSrc: "https://picsum.photos/seed/rirc-sustainable-booth/900/1200",
    seed: "rirc-sustainable-booth",
    size: "tall",
  },
  {
    title: "Award ceremony",
    subtitle: "Winning teams received medals, trophies, and scholarship announcements.",
    imageSrc: "https://picsum.photos/seed/rirc-award-ceremony/900/900",
    seed: "rirc-award-ceremony",
    size: "square",
  },
  {
    title: "Closing celebration",
    subtitle: "The final night ended with partner acknowledgements and team photos.",
    imageSrc: "https://picsum.photos/seed/rirc-closing-celebration/900/900",
    seed: "rirc-closing-celebration",
    size: "square",
  },
];
