"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "pathforge.recentProjects";

function formatDate(timestamp) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function readProjects() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export default function HomePage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProjects(readProjects());
    setLoaded(true);
  }, []);

  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => b.updatedAt - a.updatedAt),
    [projects],
  );

  function openProject(project) {
    const updated = [
      { ...project, updatedAt: Date.now() },
      ...projects.filter((item) => item.id !== project.id),
    ];
    writeProjects(updated);
    setProjects(updated);
    router.push(`/editor?project=${project.id}`);
  }

  function createProject() {
    const now = Date.now();
    const project = {
      id: `project-${now}`,
      name: "Untitled",
      updatedAt: now,
      thumbnail: "blank",
    };
    const updated = [project, ...projects];
    writeProjects(updated);
    setProjects(updated);
    router.push(`/editor?project=${project.id}`);
  }

  return (
    <main className="home-shell min-h-screen p-7 text-[#f4f6fb] bg-bg">
      <header className="home-topbar flex items-center justify-between gap-[18px] mx-auto max-w-[1180px]">
        <div className="home-brand flex items-center gap-3">
          <div className="home-logo w-[38px] h-[38px] rounded-[9px] grid place-items-center text-white bg-accent text-[13px] font-extrabold">PF</div>
          <div>
            <h1 className="text-lg">PathForge</h1>
            <p className="mt-[3px] text-muted text-[13px] font-semibold">Recent 3D website animation projects</p>
          </div>
        </div>
        <button className="home-primary min-h-[38px] border-0 rounded-lg px-4 text-white bg-accent text-[13px] font-extrabold hover:bg-[#168de2]" type="button" onClick={createProject}>
          Create project
        </button>
      </header>

      <section className="home-hero max-w-[1180px] mx-auto mt-[54px] mb-5 flex items-end justify-between">
        <div>
          <p className="home-eyebrow mb-2 text-[#8f8f8f] text-xs font-extrabold uppercase">Workspace</p>
          <h2 className="text-[clamp(30px,5vw,56px)] leading-none tracking-normal">Recent projects</h2>
        </div>
      </section>

      {loaded && sortedProjects.length === 0 ? (
        <section className="empty-projects max-w-[520px] min-h-[420px] mx-auto mt-11 border border-[#3d3d3d] rounded-xl grid justify-items-center content-center gap-3.5 p-9 text-center bg-[#252525]">
          <div className="empty-preview w-[176px] h-[116px] border border-[#4a4a4a] rounded-lg grid grid-cols-3 gap-2.5 p-4 bg-bg">
            <span className="rounded-md bg-[#343434]" />
            <span className="rounded-md bg-[#343434]" />
            <span className="rounded-md bg-[#343434]" />
          </div>
          <h3 className="mt-2 text-[22px]">No projects yet</h3>
          <p className="max-w-[360px] text-muted text-sm leading-relaxed">Create a project to start designing a 3D animated website canvas.</p>
          <button className="home-primary min-h-[38px] border-0 rounded-lg px-4 text-white bg-accent text-[13px] font-extrabold hover:bg-[#168de2]" type="button" onClick={createProject}>
            Create a project
          </button>
        </section>
      ) : (
        <section className="project-grid max-w-[1180px] mx-auto grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-[18px]" aria-label="Recent projects">
          {sortedProjects.map((project) => (
            <button className="project-card border border-[#3d3d3d] rounded-xl overflow-hidden p-0 text-white bg-[#252525] text-left hover:border-accent" type="button" key={project.id} onClick={() => openProject(project)}>
              <div className="project-thumb h-[154px] grid place-items-center bg-bg">
                <div className="project-thumb-page w-[68%] aspect-[16/10] border border-[#565656] rounded-[7px] bg-white shadow-[0_12px_30px_rgba(0,0,0,0.34)]" />
              </div>
              <div className="project-meta grid gap-[5px] px-[14px] py-[13px] pb-[15px]">
                <strong className="text-sm">{project.name}</strong>
                <span className="text-[#a7a7a7] text-xs font-semibold">Edited {formatDate(project.updatedAt)}</span>
              </div>
            </button>
          ))}
        </section>
      )}
    </main>
  );
}
