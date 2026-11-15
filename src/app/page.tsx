import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

export default function Home() {
  const contacts = [
    { label: "GitHub", href: site.links.github },
    { label: "LinkedIn", href: site.links.linkedin },
    { label: "Email", href: site.links.email && `mailto:${site.links.email}` },
    { label: "Resume", href: site.links.resume },
  ].filter((c) => c.href);

  return (
    <>
      <section className="pt-8 pb-16">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{site.name}</h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">{site.tagline}</p>
        <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {contacts.map((c) => (
            <li key={c.label}>
              <a href={c.href} className="text-accent hover:underline">
                {c.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section id="projects" className="scroll-mt-8">
        <h2 className="mb-6 text-sm font-medium tracking-wide text-muted uppercase">Projects</h2>
        <div className="grid gap-6">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      <section id="about" className="mt-20 scroll-mt-8">
        <h2 className="mb-6 text-sm font-medium tracking-wide text-muted uppercase">About</h2>
        <div className="space-y-4 text-[15px] leading-relaxed">
          {site.about.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>
    </>
  );
}
