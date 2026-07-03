export default function Stage() {
  return (
    <div className="stage-wrap" id="stage-wrap">
      <div className="stage-pages" id="stage-pages">
        <div id="section-pages-before" className="section-page-stack grid gap-[var(--page-gap,14px)]" aria-label="Sections above current page" />
        <div className="canvas-label w-full flex items-center justify-between mb-2 text-muted text-[11px] font-bold">
          <span id="canvas-section-name" className="text-[#dfe6ef]">Hero</span>
          <em className="not-italic">Website canvas</em>
        </div>
        <div className="stage-frame w-full aspect-[16/9] min-h-[520px] border border-[#555] rounded-md overflow-hidden bg-canvas shadow-[0_18px_54px_rgba(0,0,0,0.42)]" id="stage-frame">
          <div className="viewport-shell relative w-full h-full min-h-[520px] overflow-hidden bg-white">
            <canvas id="scene" />
            <div id="layout-grid-overlay" className="layout-grid-overlay absolute inset-0 z-[2] pointer-events-none" hidden>
              <div className="grid-columns-container grid grid-cols-12 gap-4 h-full mx-10">
                {Array.from({ length: 12 }).map((_, index) => (
                  <span key={index} className="bg-[rgba(255,107,107,0.06)] border-x border-dashed border-[rgba(255,107,107,0.15)] h-full" />
                ))}
              </div>
            </div>
            <div id="website-layer" className="website-layer" />
            <svg id="path-overlay" aria-label="Path drawing surface" />
            <button id="asset-handle" className="asset-handle" type="button" title="Drag model" />
            <div className="orientation-gizmo-container" title="Click axes to align camera">
              <canvas id="gizmo-canvas" />
            </div>
          </div>
        </div>

        <div className="timeline-bar w-full flex items-center gap-2 max-h-0 overflow-hidden opacity-0 p-0 pointer-events-none" id="timeline-bar">
          <button id="timeline-play" className="timeline-play-btn w-7 h-7 border border-line rounded-md bg-button text-text grid place-items-center shrink-0" type="button" title="Play / Pause">
            <svg className="tl-icon-play" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M3 1.5L10.5 6L3 10.5V1.5Z" />
            </svg>
            <svg className="tl-icon-pause" width="12" height="12" viewBox="0 0 12 12" fill="currentColor" style={{ display: "none" }}>
              <rect x="2" y="1.5" width="3" height="9" rx="0.6" />
              <rect x="7" y="1.5" width="3" height="9" rx="0.6" />
            </svg>
          </button>
          <input id="scrubber" className="scrubber flex-1 h-1.5 accent-accent cursor-pointer" type="range" min="0" max="1" step="0.001" defaultValue="0" aria-label="Animation progress" />
          <span id="time-display" className="time-display text-muted text-[11px] font-bold tabular-nums whitespace-nowrap min-w-[80px] text-right">0.0s / 3.2s</span>
          <label className="toggle mini-toggle flex items-center gap-1 text-muted text-[11px] font-bold cursor-pointer whitespace-nowrap">
            <input id="loop-toggle" type="checkbox" className="accent-accent cursor-pointer" />
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" title="Loop" className="opacity-50 transition-opacity duration-fast">
              <path d="M11 4H4.5a2.5 2.5 0 0 0 0 5H10" />
              <polyline points="9 2 11 4 9 6" />
            </svg>
          </label>
        </div>
        <div id="section-pages-after" className="section-page-stack grid gap-[var(--page-gap,14px)]" aria-label="Sections below current page" />
      </div>
    </div>
  );
}
