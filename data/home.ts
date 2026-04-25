// home.ts
import {
  BrainCircuit,
  Building2,
  Compass,
  Flag,
  Globe2,
  GraduationCap,
  Handshake,
  Lightbulb,
  Medal,
  Rocket,
  School2,
  Target,
  Telescope,
  Trophy,
  Users2,
} from "lucide-react";
import type {
  Course,
  DeliveryOption,
  FAQItem,
  GalleryItem,
  HeroStat,
  PartnerCategory,
  SkillTheme,
  ValueCard,
} from "@/data/site";

export const heroStats: HeroStat[] = [
  { label: "Students Trained", value: "9,976+" },
  { label: "Schools Reached", value: "79+" },
  { label: "Countries", value: "11" },
  { label: "Competitions Won", value: "31" },
];

export const deliveryOptions: DeliveryOption[] = [
  {
    title: "School Curriculum",
    description:
      "Robokorda embeds robotics and coding into the formal timetable with structured lesson plans and progress tracking.",
    detail:
      "Ideal for schools that want recurring classroom delivery, teacher coordination, learner assessment, and predictable term planning.",
    icon: Building2,
    imageSrc: "/images/zim/robokorda_pic_1.png",
    seed: "curriculum-delivery",
  },
  {
    title: "Extra-Curricular",
    description:
      "After-school robotics clubs give learners a premium innovation space beyond core lessons while staying connected to school life.",
    detail:
      "Best for schools that want a high-energy STEM club, competition preparation, and practical enrichment without changing the curriculum.",
    icon: Rocket,
    imageSrc: "/images/zim/robokorda_pic_3.png",
    seed: "extracurricular-delivery",
  },
  {
    title: "Weekend Programmes",
    description:
      "Weekend cohorts open the Robokorda pathway to families, homeschool communities, and learners outside partner schools.",
    detail:
      "Suited to parent-led enrolment, community hubs, and learners who want deeper project time with focused instructor support.",
    icon: Compass,
    imageSrc: "/images/zim/robokorda_pic_5.png",
    seed: "weekend-delivery",
  },
];

export const responsibilities = {
  robokorda: [
    "Provide robotics kits, laptops, software access, and structured teaching resources for each delivery cohort.",
    "Deploy trained facilitators and teaching assistants based on learner numbers and programme intensity.",
    "Guide lesson delivery, student progress reviews, and showcase preparation throughout the term.",
    "Support schools with programme reporting, competition readiness, and continuous improvement recommendations.",
  ],
  schools: [
    "Provide a clean, safe learning space with reliable power access and timetable coordination.",
    "Nominate a school contact person for scheduling, communication, and learner attendance management.",
    "Encourage student participation, project completion, and showcase readiness across the programme cycle.",
    "Promote the programme internally so learners and families understand expectations, opportunities, and timelines.",
  ],
};

export const courses: Course[] = [
  {
    title: "Foundations of Robotics",
    level: "Starter",
    age: "Ages 8-11",
    duration: "10 Weeks",
    deliveryMode: "Curriculum | Extra-Curricular",
    overview: [
      "Introduces basic robotics concepts, movement logic, sensors, and safe hardware handling.",
      "Builds confidence through repeatable assemblies, testing routines, and team challenges.",
      "Helps learners connect physical systems to problem-solving and storytelling.",
    ],
    imageSrc: "/images/courses/course 1.jpg",
    seed: "foundations-robotics",
  },
  {
    title: "Scratch Logic Lab",
    level: "Core",
    age: "Ages 8-13",
    duration: "12 Weeks",
    deliveryMode: "Curriculum | Weekend",
    overview: [
      "Covers sequences, loops, variables, events, and interactive logic using visual coding.",
      "Uses games and simulations to make abstract computer science concepts easier to grasp.",
      "Improves creative confidence through project presentations and debugging reflection.",
    ],
    imageSrc: "/images/courses/course 2.jpg",
    seed: "scratch-logic-lab",
  },
  {
    title: "App Studio for Young Innovators",
    level: "Applied",
    age: "Ages 10-15",
    duration: "12 Weeks",
    deliveryMode: "Extra-Curricular | Weekend",
    overview: [
      "Guides learners through mobile app planning, interface thinking, and feature design.",
      "Introduces logic mapping, testing, and user-centered problem solving for everyday African contexts.",
      "Strengthens presentation and pitching skills through demo-day project reviews.",
    ],
    imageSrc: "/images/courses/course 3.jpg",
    seed: "app-studio-young-innovators",
  },
  {
    title: "AI Explorer Track",
    level: "Advanced",
    age: "Ages 12-17",
    duration: "8 Weeks",
    deliveryMode: "Weekend | Competition Prep",
    overview: [
      "Introduces machine intelligence, prompts, data literacy, and responsible AI use.",
      "Frames AI as a practical tool for decision support, creativity, and local problem solving.",
      "Encourages ethical thinking around automation, bias, and digital trust.",
    ],
    imageSrc: "/images/courses/course 4.jpg",
    seed: "ai-explorer-track",
  },
  {
    title: "Electronics and Sensors",
    level: "Technical",
    age: "Ages 11-17",
    duration: "10 Weeks",
    deliveryMode: "Curriculum | Extra-Curricular",
    overview: [
      "Teaches breadboards, sensors, current flow, signal reading, and practical troubleshooting.",
      "Connects hardware learning directly to robotics builds and automation behaviour.",
      "Develops patience, diagnosis habits, and a more complete engineering mindset.",
    ],
    imageSrc: "/images/courses/course 5.jpg",
    seed: "electronics-sensors",
  },
  {
    title: "Mechanical Design Studio",
    level: "Maker",
    age: "Ages 10-17",
    duration: "10 Weeks",
    deliveryMode: "Curriculum | Weekend",
    overview: [
      "Focuses on mechanisms, structures, prototyping, durability, and iterative design.",
      "Helps learners understand how movement, material choice, and stability affect performance.",
      "Builds design discipline through testing, revision, and evidence-based improvement.",
    ],
    imageSrc: "/images/courses/course 6.jpg",
    seed: "mechanical-design-studio",
  },
];

export const skills: SkillTheme[] = [
  {
    title: "Computational thinking",
    description:
      "Learners break problems into clear, manageable steps and build confidence in logical reasoning.",
    icon: BrainCircuit,
  },
  {
    title: "Communication and teamwork",
    description:
      "Projects are designed to improve collaboration, leadership, peer support, and presentation quality.",
    icon: Users2,
  },
  {
    title: "Creative problem-solving",
    description:
      "Students test ideas, learn from failure, and improve solutions through practical iteration.",
    icon: Lightbulb,
  },
  {
    title: "Persistence under pressure",
    description:
      "Competition-style tasks teach resilience, focus, and the ability to keep improving under constraints.",
    icon: Trophy,
  },
];

export const whyUs: ValueCard[] = [
  {
    title: "African context, global quality",
    description:
      "Programmes are tailored for local schools and learners while maintaining a premium, future-facing standard of delivery.",
    icon: Globe2,
  },
  {
    title: "Facilitators who can teach and inspire",
    description:
      "Robokorda blends technical coaching, classroom energy, and structured learner guidance across every programme.",
    icon: GraduationCap,
  },
  {
    title: "Competitions and real outcomes",
    description:
      "Learners do more than attend classes. They build, present, compete, and grow visible evidence of progress.",
    icon: Medal,
  },
  {
    title: "Scalable partnerships",
    description:
      "The model works for individual schools, school groups, NGOs, and ecosystem partners that want credible STEM impact.",
    icon: Handshake,
  },
];

export const partnerCategories: PartnerCategory[] = [
  {
    title: "Independent and private schools",
    description:
      "Schools looking to strengthen practical robotics, coding, and innovation pathways across year groups.",
    imageSrc: "/images/partners/patner1.jpg",
    seed: "private-schools-partner",
  },
  {
    title: "Public school networks",
    description:
      "Districts and school groups building wider access to technology education and competition exposure.",
    imageSrc: "/images/partners/patner2.jpg",
    seed: "public-school-networks",
  },
  {
    title: "NGOs and development partners",
    description:
      "Organisations focused on youth capability, digital inclusion, and measurable STEM impact.",
    imageSrc: "/images/partners/patner3.jpg",
    seed: "ngo-development-partners",
  },
  {
    title: "Teacher enablement programmes",
    description:
      "Partners seeking school adoption support, curriculum integration guidance, and practical delivery systems.",
    imageSrc: "/images/partners/patner4.jpg",
    seed: "teacher-enablement",
  },
  {
    title: "Innovation hubs and universities",
    description:
      "Institutions that want stronger junior innovation pipelines and meaningful talent development partnerships.",
    imageSrc: "/images/partners/patner5.jpg",
    seed: "innovation-hubs-universities",
  },
  {
    title: "Parent and homeschool communities",
    description:
      "Families seeking structured technology learning beyond the school timetable.",
    imageSrc: "/images/partners/patner6.jpg",
    seed: "parent-communities",
  },
];

export const galleryItems: GalleryItem[] = [
  {
    title: "Classroom robotics sprint",
    subtitle:
      "Learners work through guided assembly and testing sessions with close facilitator support.",
    imageSrc: "/images/zim/robokorda_pic_2.png",
    seed: "gallery-classroom-robotics",
    size: "wide",
  },
  {
    title: "Young coders at work",
    subtitle:
      "Block-based logic activities help students connect creativity with technical structure.",
    imageSrc: "/images/zim/robokorda_pic_4.png",
    seed: "gallery-young-coders",
    size: "square",
  },
  {
    title: "Prototype review table",
    subtitle:
      "Project feedback sessions encourage iteration, teamwork, and presentation confidence.",
    imageSrc: "/images/rirc/makerthon.jpg",
    seed: "gallery-prototype-review",
    size: "tall",
  },
  {
    title: "Weekend innovation studio",
    subtitle:
      "Families and learners use weekend sessions to deepen focus and explore more ambitious builds.",
    imageSrc: "/images/rirc/winner-team.jpg",
    seed: "gallery-weekend-studio",
    size: "wide",
  },
  {
    title: "Competition rehearsal",
    subtitle:
      "Teams prepare for timed presentations, technical judging, and live demonstration moments.",
    imageSrc: "/images/rirc/robot-challenge.jpg",
    seed: "gallery-competition-rehearsal",
    size: "square",
  },
  {
    title: "Electronics testing bench",
    subtitle:
      "Hands-on circuit work sharpens troubleshooting discipline and systems thinking.",
    imageSrc: "/images/rirc/sustainable-tech.jpeg",
    seed: "gallery-electronics-bench",
    size: "square",
  },
  {
    title: "School showcase day",
    subtitle:
      "Learners present finished projects to educators, parents, and invited partners.",
    imageSrc: "/images/rirc/minister.jpg",
    seed: "gallery-showcase-day",
    size: "tall",
  },
];

export const homeFaqs: FAQItem[] = [
  {
    question: "Who can enrol in Robokorda Africa programmes?",
    answer:
      "Robokorda works with schools, parent groups, and individual learners through curriculum, extra-curricular, and weekend delivery models. Entry pathways start from beginner level and build upward.",
  },
  {
    question: "Do students need prior robotics or coding experience?",
    answer:
      "No. The programme is intentionally structured for progressive learning, so beginners can start with guided foundations while more experienced learners move into advanced tracks and competition preparation.",
  },
  {
    question: "Can Robokorda deliver programmes at our school?",
    answer:
      "Yes. Schools can engage Robokorda for timetable integration, after-school clubs, teacher-aligned programme delivery, and showcase or competition support.",
  },
];

export const visionMission: ValueCard[] = [
  {
    title: "Vision",
    description:
      "To inspire a generation of African learners who are confident enough to build, design, and lead with technology.",
    icon: Telescope,
  },
  {
    title: "Mission",
    description:
      "To deliver premium robotics, coding, and innovation programmes that turn curiosity into competence for schools, families, and communities.",
    icon: Target,
  },
];

export const aboutPreviewCards: ValueCard[] = [
  {
    title: "Practical by design",
    description:
      "Every programme is built around doing, testing, reflecting, and improving rather than passive classroom consumption.",
    icon: School2,
  },
  {
    title: "Rooted in opportunity",
    description:
      "Robokorda is committed to helping African learners access the tools and confidence needed for the future economy.",
    icon: Flag,
  },
];
