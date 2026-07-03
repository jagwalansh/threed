export default function TopBar() {
  return (
    <header className="topbar flex items-center justify-between gap-3 min-h-[48px] px-2.5 border-b border-line bg-[#2c2c2c]">
      <div className="tool-group fixed left-1/2 bottom-4 z-40 min-h-16 border border-[#4a4a4a] rounded-[14px] p-2 px-2.5 bg-[rgba(45,45,45,0.98)] shadow-[0_10px_28px_rgba(0,0,0,0.46)] -translate-x-1/2 flex items-center gap-1" aria-label="Editor tools">
        <button id="toggle-panels" className="tool-button min-w-[38px] min-h-[38px] px-2 border border-transparent rounded-md bg-[#383838] text-text text-[11px] font-bold flex items-center justify-center gap-[5px] hover:bg-button-hover hover:border-line-strong active:scale-[0.96]" type="button" title="Toggle side panels">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
            <rect x="1.5" y="2.5" width="13" height="11" rx="2" />
            <line x1="5.5" y1="2.5" x2="5.5" y2="13.5" />
            <line x1="10.5" y1="2.5" x2="10.5" y2="13.5" />
          </svg>
        </button>
        <div className="tool-divider w-px h-5 bg-[#4b4b4b] mx-1 shrink-0" />
        <button id="undo-btn" className="tool-button min-w-[38px] min-h-[38px] px-2 border border-transparent rounded-md bg-[#383838] text-text text-[11px] font-bold flex items-center justify-center gap-[5px] opacity-35 cursor-default pointer-events-none" type="button" title="Undo" disabled>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h7a3 3 0 1 1 0 6H8" />
            <polyline points="5 3 3 6 5 9" />
          </svg>
        </button>
        <button id="redo-btn" className="tool-button min-w-[38px] min-h-[38px] px-2 border border-transparent rounded-md bg-[#383838] text-text text-[11px] font-bold flex items-center justify-center gap-[5px] opacity-35 cursor-default pointer-events-none" type="button" title="Redo" disabled>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 6H6a3 3 0 1 0 0 6h2" />
            <polyline points="11 3 13 6 11 9" />
          </svg>
        </button>
        <div className="tool-divider w-px h-5 bg-[#4b4b4b] mx-1 shrink-0" />
        <button className="tool-button active min-w-[38px] min-h-[38px] px-2 border border-accent rounded-md bg-accent text-white text-[11px] font-bold flex items-center justify-center gap-[5px]" data-tool="move" type="button" title="Move tool (V)">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3.5 1L3.5 12.3L6.2 9.5L9 14L10.8 13L8 8.5L11.8 8.5L3.5 1Z" />
          </svg>
        </button>
        <button className="tool-button min-w-[38px] min-h-[38px] px-2 border border-transparent rounded-md bg-[#383838] text-text text-[11px] font-bold flex items-center justify-center gap-[5px] hover:bg-button-hover hover:border-line-strong active:scale-[0.96]" data-tool="path" type="button" title="Path tool (P)">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
            <path d="M2.5 13C4 8 7 4 13.5 3" strokeDasharray="2 3" />
            <circle cx="2.5" cy="13" r="2" fill="currentColor" stroke="none" />
            <circle cx="13.5" cy="3" r="2" fill="currentColor" stroke="none" />
          </svg>
        </button>
        <div className="tool-divider w-px h-5 bg-[#4b4b4b] mx-1 shrink-0" />
        <button id="toggle-grid" className="tool-button min-w-[38px] min-h-[38px] px-2 border border-transparent rounded-md bg-[#383838] text-text text-[11px] font-bold flex items-center justify-center gap-[5px] hover:bg-button-hover hover:border-line-strong active:scale-[0.96]" type="button" title="Toggle Layout Grid">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="1" x2="3" y2="15" />
            <line x1="8" y1="1" x2="8" y2="15" />
            <line x1="13" y1="1" x2="13" y2="15" />
            <line x1="1" y1="3" x2="15" y2="3" />
            <line x1="1" y1="8" x2="15" y2="8" />
            <line x1="1" y1="13" x2="15" y2="13" />
          </svg>
        </button>
        <div className="tool-divider w-px h-5 bg-[#4b4b4b] mx-1 shrink-0" />
        <button id="play-preview" className="tool-button play-button min-w-[38px] min-h-[38px] px-2 border border-transparent rounded-md bg-[#383838] text-text text-[11px] font-bold flex items-center justify-center gap-[5px]" type="button" title="Play / Pause">
          <svg className="icon-play" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4.5 2.5L13 8L4.5 13.5V2.5Z" />
          </svg>
          <svg className="icon-pause" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ display: "none" }}>
            <rect x="3" y="2.5" width="3.5" height="11" rx="0.8" />
            <rect x="9.5" y="2.5" width="3.5" height="11" rx="0.8" />
          </svg>
        </button>
      </div>

      <div className="topbar-center min-w-0 flex items-center gap-2 rounded-[7px] px-3 py-[7px] text-white bg-[#353535] text-xs font-semibold">
        <span id="section-title-label" className="text-text font-bold">Hero</span>
        <span className="topbar-dot text-[var(--line-strong)] text-base">·</span>
        <span id="viewport-status" className="min-w-0 text-[#a8a8a8]">Move mode</span>
      </div>

      <div className="topbar-actions flex items-center gap-1">
        <div className="zoom-controls flex items-center gap-[2px] mr-2">
          <button id="zoom-out" className="tool-button mini min-w-[28px] min-h-[26px] px-[5px] text-[10px] border border-transparent rounded-md bg-[#383838] text-text font-bold flex items-center justify-center gap-[5px] hover:bg-button-hover hover:border-line-strong active:scale-[0.96]" type="button" title="Zoom out">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="3" y1="7" x2="11" y2="7" />
            </svg>
          </button>
          <span id="zoom-level" className="zoom-badge inline-flex items-center justify-center min-w-[44px] h-[26px] px-1 rounded-[5px] bg-[rgba(255,255,255,0.04)] text-muted text-[11px] font-bold tabular-nums">100%</span>
          <button id="zoom-in" className="tool-button mini min-w-[28px] min-h-[26px] px-[5px] text-[10px] border border-transparent rounded-md bg-[#383838] text-text font-bold flex items-center justify-center gap-[5px] hover:bg-button-hover hover:border-line-strong active:scale-[0.96]" type="button" title="Zoom in">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="7" y1="3" x2="7" y2="11" />
              <line x1="3" y1="7" x2="11" y2="7" />
            </svg>
          </button>
          <button id="zoom-reset" className="tool-button mini min-w-[28px] min-h-[26px] px-[5px] text-[10px] border border-transparent rounded-md bg-[#383838] text-text font-bold flex items-center justify-center gap-[5px] hover:bg-button-hover hover:border-line-strong active:scale-[0.96]" type="button" title="Reset zoom">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
              <circle cx="6" cy="6" r="4" />
              <line x1="9" y1="9" x2="12" y2="12" />
            </svg>
          </button>
        </div>
        <label className="toggle flex items-center gap-1.5 text-muted text-[11px] font-bold cursor-pointer whitespace-nowrap">
          <input id="all-sections-toggle" type="checkbox" className="accent-accent cursor-pointer" />
          <span>All sections</span>
        </label>
        <button id="reset-demo" className="secondary-button min-h-[32px] px-3 border border-transparent rounded-md bg-[#383838] text-text text-[11px] font-bold flex items-center justify-center gap-[5px] hover:bg-button-hover hover:border-line-strong active:scale-[0.96]" type="button" title="Reset to default">Reset</button>
        <button id="copy-code" className="primary-button min-h-[32px] px-3 border border-accent rounded-md bg-accent text-white text-[11px] font-extrabold shadow-none flex items-center justify-center gap-[5px] hover:-translate-y-px hover:shadow-[0_4px_18px_rgba(13,153,255,0.25)] active:translate-y-0" type="button" title="Generate & copy code">
          Export code
        </button>
      </div>
    </header>
  );
}
