export interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  tech: string[];
  year?: number;
  status?: "completed" | "in-progress" | "archived";
  featured?: boolean;
  repository?: string;
  image?: string;
  category?:
    | "web"
    | "mobile"
    | "desktop"
    | "extension"
    | "library"
    | "cli"
    | "tool";
  contributionType: "owner" | "contributor";
  githubUrl?: string;
  contributionDescription?: string;
}

export const projects: Project[] = [
  // Own Projects
  {
    id: "personal-website",
    title: "Personal Website",
    description:
      "My personal portfolio and blog built with modern web technologies",
    url: "https://tomplanche.com",
    tech: ["SvelteKit", "TypeScript", "SCSS", "Vercel"],
    year: 2025,
    status: "completed",
    featured: true,
    category: "web",
    contributionType: "owner",
    githubUrl: "https://github.com/TomPlanche/website",
  },
  {
    id: "rona",
    title: "Rona",
    description:
      "A powerful CLI tool to streamline your Git workflow with intuitive commands",
    url: "https://github.com/TomPlanche/rona",
    tech: ["Rust", "CLI", "Git"],
    year: 2025,
    status: "completed",
    featured: true,
    category: "cli",
    contributionType: "owner",
    githubUrl: "https://github.com/TomPlanche/rona",
    image: "/favicon.png",
  },
  {
    id: "hooksmith",
    title: "Hooksmith",
    description:
      "🪝 Trivial Git hook management tool for better development workflow",
    url: "https://github.com/TomPlanche/hooksmith",
    tech: ["Rust", "Git", "CLI", "YAML"],
    year: 2025,
    status: "completed",
    featured: true,
    category: "tool",
    contributionType: "owner",
    githubUrl: "https://github.com/TomPlanche/hooksmith",
  },
  {
    id: "trivial-website",
    title: "Trivial Website",
    description: "Current portfolio website showcasing projects and skills",
    url: "#",
    tech: ["SvelteKit", "TypeScript", "SCSS", "GSAP"],
    year: 2025,
    status: "in-progress",
    category: "web",
    contributionType: "owner",
  },

  // Contributed Projects
  {
    id: "zed-editor",
    title: "Zed Editor",
    description:
      "Code at the speed of thought – High-performance, multiplayer code editor",
    url: "https://zed.dev",
    tech: ["Rust", "WebGPU", "Tree-sitter"],
    year: 2025,
    status: "in-progress",
    featured: true,
    category: "desktop",
    contributionType: "contributor",
    githubUrl: "https://github.com/zed-industries/zed",
    contributionDescription:
      "Contributing to features and performance improvements",
  },
  {
    id: "chess-tui",
    title: "Chess TUI",
    description:
      "Play chess from your terminal 🦀 - A beautiful terminal-based chess game",
    url: "https://github.com/thomas-mauran/chess-tui",
    tech: ["Rust", "TUI", "Chess Engine"],
    year: 2025,
    status: "completed",
    featured: true,
    category: "cli",
    contributionType: "contributor",
    githubUrl: "https://github.com/thomas-mauran/chess-tui",
    contributionDescription: "UI improvements and game logic enhancements",
  },
  {
    id: "cobe",
    title: "Cobe",
    description:
      "5kB WebGL globe library for creating beautiful interactive 3D globes",
    url: "https://github.com/shuding/cobe",
    tech: ["TypeScript", "WebGL", "Three.js"],
    year: 2025,
    status: "completed",
    category: "library",
    contributionType: "contributor",
    githubUrl: "https://github.com/shuding/cobe",
    contributionDescription: "Performance optimizations and feature additions",
  },

  // Academic/Learning Projects
  {
    id: "cnam-projects",
    title: "CNAM Engineering Projects",
    description:
      "Collection of projects from CS Engineering studies at CNAM Paris",
    url: "#",
    tech: ["Python", "C++", "R", "JavaScript", "Bash"],
    year: 2023,
    status: "completed",
    category: "desktop",
    contributionType: "owner",
  },
  {
    id: "p5js-sketches",
    title: "P5.js Creative Sketches",
    description: "Creative coding experiments and visualizations using P5.js",
    url: "https://editor.p5js.org/TomPlanche/collections/i4Jx6K49n9",
    tech: ["JavaScript", "P5.js", "Creative Coding"],
    year: 2023,
    status: "in-progress",
    category: "web",
    contributionType: "owner",
  },

  // Professional Experience Projects
  {
    id: "crealo-work",
    title: "Crealo Platform",
    description: "Full-stack development work during my time at Crealo",
    url: "#",
    tech: ["JavaScript", "TypeScript", "React", "Node.js"],
    year: 2023,
    status: "completed",
    category: "web",
    contributionType: "contributor",
    contributionDescription:
      "Full-stack development and feature implementation",
  },
];

// Helper functions for filtering and sorting
export const getFeaturedProjects = (): Project[] =>
  projects.filter((project) => project.featured);

export const getProjectsByCategory = (
  category: Project["category"],
): Project[] => projects.filter((project) => project.category === category);

export const getProjectsByStatus = (status: Project["status"]): Project[] =>
  projects.filter((project) => project.status === status);

export const getProjectsByYear = (year: number): Project[] =>
  projects.filter((project) => project.year === year);

export const getProjectsByContributionType = (
  type: Project["contributionType"],
): Project[] => projects.filter((project) => project.contributionType === type);

export const getOwnProjects = (): Project[] =>
  getProjectsByContributionType("owner");

export const getContributedProjects = (): Project[] =>
  getProjectsByContributionType("contributor");

export const getProjectById = (id: string): Project | undefined =>
  projects.find((project) => project.id === id);
