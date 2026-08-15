export type ProjectVisual = "gesture" | "veda" | "taskflow";

export interface ProjectStat {
  value: string;
  label: string;
}

export interface Project {
  index: string;
  category: string;
  title: string;
  hook: string;
  description: string;
  stack: string[];
  stats: ProjectStat[];
  repository: string;
  visual: ProjectVisual;
  accent: "orange" | "cobalt" | "lime";
}

export const projects: Project[] = [
  {
    index: "01",
    category: "Computer vision / Desktop interaction",
    title: "Hand Gesture Control Suite",
    hook: "A webcam became the controller.",
    description:
      "A real-time interface that interprets scale-independent hand gestures and turns them into Windows volume, media, and pointer actions.",
    stack: ["Python", "MediaPipe", "OpenCV", "PyCAW", "pytest"],
    stats: [
      { value: "21", label: "landmarks" },
      { value: "4", label: "control modes" },
      { value: "14", label: "tests" },
    ],
    repository:
      "https://github.com/Maddy-Mk/Handtracking_module-OpenCV-Mediapipe",
    visual: "gesture",
    accent: "orange",
  },
  {
    index: "02",
    category: "Full-stack systems / Healthcare operations",
    title: "VEDA Healthcare System",
    hook: "Six roles. One connected operating model.",
    description:
      "A substantial hospital-operations prototype connecting role-aware dashboards to patient records, appointments, wards, billing, pharmacy, and laboratory workflows.",
    stack: ["Node.js", "Express", "MySQL", "JWT", "JavaScript"],
    stats: [
      { value: "45", label: "API endpoints" },
      { value: "18", label: "tables" },
      { value: "6", label: "staff roles" },
    ],
    repository:
      "https://github.com/Maddy-Mk/Hospital-Management-System-VEDA",
    visual: "veda",
    accent: "cobalt",
  },
  {
    index: "03",
    category: "Interface study / Task workflow",
    title: "TaskFlow",
    hook: "A small workflow, finished end to end.",
    description:
      "A focused Flask task manager covering the complete interaction cycle: create, edit, complete, remove, and review tasks through a responsive interface.",
    stack: ["Python", "Flask", "Jinja2", "HTML", "CSS"],
    stats: [
      { value: "6", label: "routes" },
      { value: "5", label: "task actions" },
      { value: "3", label: "UI states" },
    ],
    repository: "https://github.com/Maddy-Mk/TaskFlow",
    visual: "taskflow",
    accent: "lime",
  },
];
