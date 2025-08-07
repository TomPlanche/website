interface BaseProject {
  id: string;
  title: string;
  description: string;
  url: string;
  tech: string[];
  year?: number;
  status?: "completed" | "in-progress";
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
  githubUrl?: string;
}

interface OwnerProject extends BaseProject {
  contributionType: "owner";
  contributionDescription?: never; // Explicitly disallow this field
}

interface ContributorProject extends BaseProject {
  contributionType: "contributor";
  contributionDescription: string; // Required for contributors
}

export type Project = OwnerProject | ContributorProject;

export const projects: Project[] = [
  // Own Projects
  {
    id: "rona",
    title: "Rona",
    description:
      "A powerful CLI tool to streamline your Git workflow with intuitive commands",
    url: "https://github.com/TomPlanche/rona",
    tech: ["Rust", "CLI", "Git"],
    year: 2025,
    status: "completed",
    category: "tool",
    contributionType: "owner",
    githubUrl: "https://github.com/TomPlanche/rona",
    image: "/favicon.png",
  },
  {
    id: "hooksmith",
    title: "Hooksmith",
    description:
      "Trivial Git hook management tool for better development workflow",
    url: "https://github.com/TomPlanche/hooksmith",
    tech: ["Rust", "Git hooks", "CLI"],
    year: 2025,
    status: "completed",
    category: "tool",
    contributionType: "owner",
    githubUrl: "https://github.com/TomPlanche/hooksmith",
  },
  {
    id: "this-website",
    title: "This Website",
    description: "Current portfolio website showcasing projects and skills",
    url: "https://github.com/TomPlanche/website",
    tech: ["SvelteKit", "TypeScript", "SCSS", "GSAP"],
    year: 2025,
    status: "in-progress",
    category: "web",
    contributionType: "owner",
    githubUrl: "https://github.com/TomPlanche/website",
  },

  // Contributed Projects
  {
    id: "zed-editor",
    title: "Zed Editor",
    description:
      "Code at the speed of thought – High-performance, multiplayer code editor",
    url: "https://zed.dev",
    tech: ["Rust", "Text editor"],
    year: 2025,
    status: "in-progress",
    category: "desktop",
    contributionType: "contributor",
    githubUrl:
      "https://github.com/zed-industries/zed/pulls?q=is%3Apr%20author%3AtomPlanche",
    contributionDescription:
      "Contributing to features and performance improvements",
  },
  {
    id: "chess-tui",
    title: "Chess TUI",
    description:
      "Play chess from your terminal 🦀 - A beautiful terminal-based chess game",
    url: "https://github.com/thomas-mauran/chess-tui/",
    tech: ["Rust", "TUI", "Chess Engine"],
    year: 2025,
    status: "completed",
    category: "cli",
    contributionType: "contributor",
    githubUrl:
      "https://github.com/thomas-mauran/chess-tui/pulls?q=is%3Apr%20author%3AtomPlanche",
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
    githubUrl:
      "https://github.com/shuding/cobe/pulls?q=is%3Apr%20author%3Atomplanche",
    contributionDescription: "Performance optimizations and feature additions",
  },
];
