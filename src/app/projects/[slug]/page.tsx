import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Tags } from "@/components/Tags";
import { getProject, projects, type Section } from "@/content/projects";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return projects.filter((p) => !p.draft && p.sections).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const project = getProject((await params).slug);
  return project ? { title: project.title, description: project.summary } : {};
}

export default async function ProjectPage({ params }: { params: Params }) {
  const project = getProject((await params).slug);
  if (!project || project.draft || !project.sections) notFound();

  return (
    <article>
      <Link href="/#projects" className="text-sm text-muted hover:text-foreground">
        ← All projects
      </Link>

      <header className="mt-6 mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">{project.title}</h1>
        <p className="mt-2 text-muted">
          {[project.course, project.date].filter(Boolean).join(" · ")}
        </p>
        <p className="mt-4 text-lg leading-relaxed">{project.summary}</p>
        <Tags tags={project.tags} className="mt-5" />
        {project.links && (
          <ul className="mt-5 flex gap-5 text-sm">
            {project.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-accent hover:underline">
                  {l.label} ↗
                </a>
              </li>
            ))}
          </ul>
        )}
      </header>

      {project.highlights && (
        <ul className="mb-12 space-y-2 rounded-xl border border-border bg-card p-5 text-[15px]">
          {project.highlights.map((h) => (
            <li key={h} className="flex gap-3">
              <span className="text-accent">▸</span>
              {h}
            </li>
          ))}
        </ul>
      )}

      <div className="space-y-14">
        {project.sections.map((s) => (
          <SectionView key={s.heading} section={s} />
        ))}
      </div>
    </article>
  );
}

function SectionView({ section }: { section: Section }) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold tracking-tight">{section.heading}</h2>
      <div className="space-y-4 text-[15px] leading-relaxed">
        {section.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {section.figures?.map((f) => (
        <figure key={f.src} className="mt-8">
          <div className="figure-panel overflow-hidden rounded-lg border border-border">
            <Image
              src={f.src}
              alt={f.alt}
              width={1200}
              height={500}
              sizes="(min-width: 768px) 720px, 100vw"
              className="h-auto w-full"
            />
          </div>
          {f.caption && (
            <figcaption className="mt-2 text-sm text-muted">{f.caption}</figcaption>
          )}
        </figure>
      ))}

      {section.table && (
        <figure className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                {section.table.columns.map((c) => (
                  <th key={c} className="py-2 pr-4 font-medium">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="font-mono">
              {section.table.rows.map((row) => (
                <tr key={row[0]} className="border-b border-border">
                  {row.map((cell, i) => (
                    <td key={i} className={`py-2 pr-4 ${i === 0 ? "font-sans" : ""}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {section.table.caption && (
            <figcaption className="mt-2 text-sm text-muted">{section.table.caption}</figcaption>
          )}
        </figure>
      )}

      {section.audio && (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {section.audio.map((a) => (
            <div key={a.src} className="rounded-lg border border-border bg-card p-3">
              <p className="mb-2 text-sm font-medium">{a.label}</p>
              <audio controls preload="none" src={a.src} className="w-full" />
              {a.note && <p className="mt-2 text-xs text-muted">{a.note}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
