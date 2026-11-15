import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/projects";
import { Tags } from "./Tags";

export function ProjectCard({ project }: { project: Project }) {
  const hasPage = !project.draft && project.sections;

  const body = (
    <article className="group overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-muted">
      {project.cover && (
        <div className="figure-panel relative aspect-[2.4/1] border-b border-border">
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            sizes="(min-width: 768px) 720px, 100vw"
            className="object-contain p-2"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="font-semibold tracking-tight group-hover:text-accent">
            {project.title}
          </h3>
          <span className="text-sm text-muted">{project.date}</span>
        </div>
        {project.course && <p className="mt-1 text-sm text-muted">{project.course}</p>}
        <p className="mt-3 text-[15px] leading-relaxed">{project.summary}</p>
        <Tags tags={project.tags} className="mt-4" />
        {project.draft && (
          <p className="mt-4 text-sm text-muted italic">Write-up coming soon.</p>
        )}
      </div>
    </article>
  );

  return hasPage ? <Link href={`/projects/${project.slug}`}>{body}</Link> : body;
}
