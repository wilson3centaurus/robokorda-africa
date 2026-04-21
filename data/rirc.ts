import { Award, Bot, BrainCircuit, Leaf, Trophy } from "lucide-react";
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
  { code: "bw", name: "Botswana" },
  { code: "cd", name: "Democratic Republic of Congo" },
  { code: "gh", name: "Ghana" },
  { code: "mw", name: "Malawi" },
  { code: "mz", name: "Mozambique" },
  { code: "na", name: "Namibia" },
  { code: "za", name: "South Africa" },
  { code: "zm", name: "Zambia" },
  { code: "zw", name: "Zimbabwe" },
];

export const rircPrizes: PrizeTier[] = [
  {
    title: "1st Place",
    amount: "RIRC Overall Winners Shield",
    summary: "Premier recognition for the strongest all-round team performance.",
    benefits: [
      "Qualifies for Technoxian competition in India",
      "Fully sponsored Technoxian trip to India by Robokorda",
    ],
    icon: Trophy,
  },
  {
    title: "2nd Place",
    amount: "RIRC Second Position Shield",
    summary: "Awarded to an outstanding team with strong technical execution and presentation.",
    benefits: ["Tablets", "RIRC 2nd Position Certificates"],
    icon: Award,
  },
  {
    title: "3rd Position",
    amount: "RIRC Third Position Shield",
    summary: "Celebrates an exceptional team with strong promise and practical innovation.",
    benefits: ["Robotics Kits", "RIRC 3rd Position Certificates"],
    icon: Award,
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
