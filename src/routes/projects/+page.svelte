<script lang="ts">
  import { projects } from "$lib/data/projects";
</script>

<section id="projects">
  <div class="projects-header">
    <h1>projects.</h1>
    <p>
      Building software is my passion. Here's a selection of projects I've
      created, <br />
      primarily driven by curiosity and the desire to solve interesting problems.
    </p>
  </div>

  <div class="project-grid">
    {#each projects as project}
      <a
        href={project.url}
        class="project-card"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div class="project-content">
          <div class="project-header">
            <h2 class="project-title">{project.title}</h2>
            <div class="contribution-indicator">
              {#if project.contributionType === "owner"}
                <span class="owner-badge" title="Own Project">👨‍💻</span>
              {:else}
                <span class="contributor-badge" title="Contributed to">🤝</span>
              {/if}
            </div>
          </div>
          <p class="project-description">{project.description}</p>
          {#if project.contributionDescription && project.contributionType === "contributor"}
            <p class="contribution-description">
              {project.contributionDescription}
            </p>
          {/if}
          <div class="project-footer">
            <div class="project-tech">
              {#each project.tech as tech}
                <span class="tech-tag">{tech}</span>
              {/each}
            </div>
            <div class="project-meta">
              {#if project.year}
                <span class="project-year">{project.year}</span>
              {/if}
              {#if project.githubUrl}
                <button
                  class="github-link"
                  title="View on GitHub"
                  aria-label="View {project.title} on GitHub"
                  on:click|stopPropagation={() =>
                    window.open(project.githubUrl, "_blank")}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path
                      d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
                    />
                  </svg>
                </button>
              {/if}
            </div>
          </div>
        </div>
      </a>
    {/each}
  </div>
</section>

<style lang="scss">
  @use "$lib/styles/variables" as v;

  #projects {
    min-height: 100dvh;
    padding: v.$main-vertical-padding v.$main-padding;

    .projects-header {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;

      gap: 1rem;
      margin-bottom: 1rem;

      width: 100%;

      h1 {
        font-family: "FK Raster Grotesk Blended", sans-serif;
        font-size: clamp(2.5rem, 6vw, 4rem);
        font-weight: normal;
        color: var(--text-color);
      }

      p {
        font-family: "Supply Mono", monospace;
        font-size: 1rem;
        line-height: 1.6;
        text-align: left;

        color: var(--text-color);
        opacity: 0.8;
      }
    }

    .project-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
      padding-top: 3rem;

      @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }

      @media (min-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
        gap: 1.25rem;
      }
    }

    .project-card {
      display: block;
      text-decoration: none;
      color: inherit;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 1.5rem 1rem;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.2);
      }

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.3),
          transparent
        );
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &:hover::before {
        opacity: 1;
      }
    }

    .project-content {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .project-header {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      margin-bottom: 0.75rem;
    }

    .project-title {
      font-family: "FK Raster Grotesk Blended", sans-serif;
      font-size: 1.5rem;
      font-weight: normal;
      text-align: left;

      color: var(--text-color);

      line-height: 1.3;
      flex: 1;
    }

    .contribution-indicator {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      margin-left: 0.75rem;
      flex-shrink: 0;
    }

    .owner-badge,
    .contributor-badge {
      font-size: 1.25rem;
      opacity: 0.8;
      transition: opacity 0.2s ease;
    }

    .project-card:hover .owner-badge,
    .project-card:hover .contributor-badge {
      opacity: 1;
    }

    .project-description {
      font-family: "Supply Mono", monospace;
      font-size: 0.95rem;
      text-align: left;
      line-height: 1.5;

      color: var(--text-color);
      opacity: 0.7;

      margin-bottom: 1rem;
      flex: 1;
    }

    .contribution-description {
      font-family: "Supply Mono", monospace;
      font-size: 0.85rem;
      font-style: italic;
      text-align: left;

      line-height: 1.4;

      color: var(--text-color);
      opacity: 0.6;

      margin-bottom: 1rem;
      padding: 0.5rem 0.75rem;

      background: rgba(255, 255, 255, 0.03);
      border-left: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 4px;
    }

    .project-footer {
      margin-top: auto;
    }

    .project-tech {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .project-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.75rem;
    }

    .project-year {
      font-family: "Supply Mono", monospace;
      font-size: 0.8rem;
      color: var(--text-color);
      opacity: 0.6;
    }

    .github-link {
      background: none;
      border: none;
      color: var(--text-color);
      opacity: 0.6;
      transition: opacity 0.2s ease;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        opacity: 1;
        background: rgba(255, 255, 255, 0.05);
      }

      svg {
        width: 16px;
        height: 16px;
      }
    }

    .tech-tag {
      font-family: "Supply Mono", monospace;
      font-size: 0.75rem;
      padding: 0.25rem 0.6rem;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 16px;
      color: var(--text-color);
      opacity: 0.8;
      transition: all 0.2s ease;
    }

    .project-card:hover .tech-tag {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.25);
    }

    // Add additional pointer events for the projects section
    pointer-events: auto;
  }
</style>
