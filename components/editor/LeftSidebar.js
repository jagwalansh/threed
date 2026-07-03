"use client";

import CollapseButton from "./CollapseButton";

function PagesPanel() {
  return (
    <section className="panel border-0 border-b border-line rounded-none bg-transparent px-[18px] py-[14px]">
      <div className="panel-heading flex items-center gap-2 mb-2.5">
        <CollapseButton label="Pages" />
        <h2 className="flex-1 text-xs leading-tight font-bold">Pages</h2>
        <button id="add-section" className="small-button min-h-[26px] px-2 text-xs font-bold border border-transparent rounded-md bg-[#383838] text-text hover:bg-button-hover active:scale-96" type="button" title="Add new section">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="6" y1="2" x2="6" y2="10" />
            <line x1="2" y1="6" x2="10" y2="6" />
          </svg>
          Add
        </button>
      </div>
      <div className="panel-body">
        <div id="section-list" className="section-list grid gap-1" aria-label="Website sections" />
      </div>
    </section>
  );
}

function LayersPanel() {
  return (
    <section className="panel border-0 border-b border-line rounded-none bg-transparent px-[18px] py-[14px]">
      <div className="panel-heading flex items-center gap-2 mb-2.5">
        <CollapseButton label="Layers" />
        <h2 className="flex-1 text-xs leading-tight font-bold">Layers</h2>
        <button id="add-text" className="small-button min-h-[26px] px-2 text-xs font-bold border border-transparent rounded-md bg-[#383838] text-text hover:bg-button-hover active:scale-96" type="button" title="Add text layer (T)">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="6" y1="2" x2="6" y2="10" />
            <line x1="3" y1="2" x2="9" y2="2" />
          </svg>
          Text
        </button>
      </div>
      <div className="panel-body">
        <div id="layer-list" className="layer-list grid gap-1" aria-label="Section layers" />
      </div>
    </section>
  );
}

function AssetsPanel() {
  return (
    <section className="panel border-0 border-b border-line rounded-none bg-transparent px-[18px] py-[14px]">
      <div className="panel-heading flex items-center gap-2 mb-2.5">
        <CollapseButton label="3D Asset" />
        <h2 className="flex-1 text-xs leading-tight font-bold">3D Assets</h2>
      </div>
      <div className="panel-body">
        <label className="asset-search grid gap-1.5 mb-2">
          <span className="text-muted text-[11px] font-bold">Asset library</span>
          <input id="asset-search" type="search" placeholder="Search shapes, UI, motion..." className="w-full min-h-[32px] border border-[#3f3f3f] rounded-[7px] px-2.5 text-text bg-[#383838] text-xs font-semibold focus:outline-none focus:border-blue" />
        </label>
        <div id="asset-grid" className="asset-grid grid grid-cols-2 gap-1.5 max-h-[342px] overflow-y-auto pr-[2px]" aria-label="Premade 3D assets" />
        <label className="upload-zone mt-2 min-h-[48px] border border-dashed border-[#465268] rounded-[7px] flex flex-col items-center justify-center gap-1.5 px-2.5 text-muted text-[11px] font-bold cursor-pointer transition-[border-color,background] duration-fast hover:border-accent hover:bg-[rgba(49,196,141,0.04)]" htmlFor="asset-upload">
          <input id="asset-upload" type="file" accept=".glb,.gltf" />
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13V3" />
            <polyline points="6 7 10 3 14 7" />
            <path d="M3 13v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" />
          </svg>
          <span>Upload GLB / GLTF</span>
        </label>
      </div>
    </section>
  );
}

export default function LeftSidebar({ activeTab, collapsed, onToggleCollapse }) {
  return (
    <aside className="left-panel">
      <button
        className="side-collapse-btn left"
        type="button"
        aria-label={collapsed ? "Expand left sidebar" : "Collapse left sidebar"}
        aria-expanded={!collapsed}
        onClick={onToggleCollapse}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d={collapsed ? "M6 3l5 5-5 5" : "M10 3L5 8l5 5"} />
        </svg>
      </button>
      <div className="brand flex items-center gap-2.5 min-h-[86px] px-[22px] py-4 border-b border-line">
        <div className="brand-mark w-[34px] h-[34px] rounded-[7px] grid place-items-center text-[#06110e] text-xs font-extrabold bg-gradient-to-br from-accent to-accent-2 shrink-0">F</div>
        <div>
          <p className="eyebrow mt-2 text-muted text-[13px] font-semibold">Team project <strong className="ml-1 rounded-md px-[6px] py-[1px] text-[#bcd9ff] bg-[#244261] text-xs">Free</strong></p>
          <h1 className="text-lg leading-tight">Untitled</h1>
        </div>
      </div>

      <div style={{ display: activeTab === "assets" ? "" : "none" }}>
        <AssetsPanel />
      </div>
      <div style={{ display: activeTab !== "assets" ? "" : "none" }}>
        <PagesPanel />
        <LayersPanel />
      </div>
    </aside>
  );
}
