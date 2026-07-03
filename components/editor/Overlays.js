export function LoadingSkeleton() {
  return (
    <div id="loading-skeleton" className="loading-skeleton fixed inset-0 z-[100] grid place-items-center bg-bg transition-opacity duration-500">
      <div className="loading-logo flex flex-col items-center gap-4 text-muted text-[13px] font-semibold">
        <div className="brand-mark loading-pulse w-[34px] h-[34px] rounded-[7px] grid place-items-center text-[#06110e] text-xs font-extrabold bg-gradient-to-br from-accent to-accent-2 shrink-0">PF</div>
        <span>Loading PathForge…</span>
      </div>
    </div>
  );
}

export default function Overlays() {
  return (
    <>
      <div id="code-modal" className="modal-backdrop fixed inset-0 z-50 grid place-items-center p-7 bg-[rgba(5,7,11,0.7)] backdrop-blur-[16px]" hidden>
        <section className="code-modal w-[min(980px,100%)] max-h-[min(760px,88vh)] border border-line-strong rounded-lg grid grid-rows-[auto_auto_minmax(0,1fr)] overflow-hidden bg-[#12161d] shadow-lg" role="dialog" aria-modal="true" aria-labelledby="code-modal-title">
          <div className="code-modal-heading flex items-center justify-between gap-3.5 px-4 py-[14px] border-b border-line">
            <div>
              <p className="eyebrow text-muted text-[13px] font-semibold">Generated output</p>
              <h2 id="code-modal-title" className="text-xs leading-tight font-bold">Website-ready snippet</h2>
            </div>
            <div className="modal-actions flex items-center gap-1.5">
              <div className="segmented grid grid-cols-2 gap-1" id="export-format-selector" style={{ margin: "0 12px 0 0" }}>
                <button className="segment active min-h-[32px] border border-transparent rounded-md bg-[#383838] text-text text-[11px] font-bold flex items-center justify-center gap-[5px] hover:bg-button-hover" data-format="vanilla" type="button" style={{ minHeight: 28, fontSize: 11 }}>Vanilla HTML/JS</button>
                <button className="segment min-h-[32px] border border-transparent rounded-md bg-[#383838] text-text text-[11px] font-bold flex items-center justify-center gap-[5px] hover:bg-button-hover" data-format="react" type="button" style={{ minHeight: 28, fontSize: 11 }}>React (R3F)</button>
              </div>
              <button id="download-html" className="secondary-button min-h-[32px] px-3 border border-transparent rounded-md bg-[#383838] text-text text-[11px] font-bold flex items-center justify-center gap-[5px] hover:bg-button-hover hover:border-line-strong active:scale-[0.96]" type="button">Download</button>
              <button id="copy-again" className="secondary-button min-h-[32px] px-3 border border-transparent rounded-md bg-[#383838] text-text text-[11px] font-bold flex items-center justify-center gap-[5px] hover:bg-button-hover hover:border-line-strong active:scale-[0.96]" type="button">Copy</button>
              <button id="close-code" className="small-button min-h-[26px] px-2 text-xs font-bold border border-transparent rounded-md bg-[#383838] text-text hover:bg-button-hover active:scale-[0.96]" type="button">Close</button>
            </div>
          </div>
          <p id="copy-status" className="copy-status px-4 py-2 border-b border-line text-accent text-[11px] font-bold">Copied to clipboard</p>
          <pre className="m-0 min-h-0 overflow-auto p-4 bg-[#090c11]">
            <code id="generated-code" className="text-[#d8e8ff] font-mono text-xs leading-relaxed whitespace-pre" />
          </pre>
        </section>
      </div>

      <div id="context-menu" className="context-menu fixed z-60" hidden>
        <div className="context-menu-body min-w-[180px] border border-line-strong rounded-md bg-[#181c24] shadow-md p-1 backdrop-blur-[12px]" role="menu" />
      </div>

      <div id="shortcuts-modal" className="modal-backdrop fixed inset-0 z-50 grid place-items-center p-7 bg-[rgba(5,7,11,0.7)] backdrop-blur-[16px]" hidden>
        <section className="shortcuts-modal w-[min(680px,100%)] max-h-[min(520px,80vh)] border border-line-strong rounded-lg overflow-auto bg-[#12161d] shadow-lg" role="dialog" aria-modal="true" aria-labelledby="shortcuts-title">
          <div className="code-modal-heading flex items-center justify-between gap-3.5 px-4 py-[14px] border-b border-line">
            <div>
              <p className="eyebrow text-muted text-[13px] font-semibold">Reference</p>
              <h2 id="shortcuts-title" className="text-xs leading-tight font-bold">Keyboard shortcuts</h2>
            </div>
            <button id="close-shortcuts" className="small-button min-h-[26px] px-2 text-xs font-bold border border-transparent rounded-md bg-[#383838] text-text hover:bg-button-hover active:scale-[0.96]" type="button">Close</button>
          </div>
          <div className="shortcuts-grid grid grid-cols-2 gap-5 px-5 py-4 pb-6">
            <div className="shortcut-group flex flex-col gap-2">
              <h3 className="text-[11px] font-extrabold text-muted uppercase tracking-wider">Tools</h3>
              <div className="shortcut-row flex items-center justify-between gap-3 text-xs font-semibold text-text"><kbd className="inline-flex items-center justify-center min-w-[28px] h-6 px-1.5 border border-line-strong rounded-[5px] bg-panel-2 text-muted font-mono text-[11px] font-bold">V</kbd><span>Move tool</span></div>
              <div className="shortcut-row flex items-center justify-between gap-3 text-xs font-semibold text-text"><kbd className="inline-flex items-center justify-center min-w-[28px] h-6 px-1.5 border border-line-strong rounded-[5px] bg-panel-2 text-muted font-mono text-[11px] font-bold">P</kbd><span>Path tool</span></div>
              <div className="shortcut-row flex items-center justify-between gap-3 text-xs font-semibold text-text"><kbd className="inline-flex items-center justify-center min-w-[28px] h-6 px-1.5 border border-line-strong rounded-[5px] bg-panel-2 text-muted font-mono text-[11px] font-bold">T</kbd><span>Add text</span></div>
              <div className="shortcut-row flex items-center justify-between gap-3 text-xs font-semibold text-text"><kbd className="inline-flex items-center justify-center min-w-[28px] h-6 px-1.5 border border-line-strong rounded-[5px] bg-panel-2 text-muted font-mono text-[11px] font-bold">Space</kbd><span>Play / Pause</span></div>
            </div>
            <div className="shortcut-group flex flex-col gap-2">
              <h3 className="text-[11px] font-extrabold text-muted uppercase tracking-wider">Edit</h3>
              <div className="shortcut-row flex items-center justify-between gap-3 text-xs font-semibold text-text"><kbd className="inline-flex items-center justify-center min-w-[28px] h-6 px-1.5 border border-line-strong rounded-[5px] bg-panel-2 text-muted font-mono text-[11px] font-bold">⌘Z</kbd><span>Undo</span></div>
              <div className="shortcut-row flex items-center justify-between gap-3 text-xs font-semibold text-text"><kbd className="inline-flex items-center justify-center min-w-[28px] h-6 px-1.5 border border-line-strong rounded-[5px] bg-panel-2 text-muted font-mono text-[11px] font-bold">⌘D</kbd><span>Duplicate</span></div>
              <div className="shortcut-row flex items-center justify-between gap-3 text-xs font-semibold text-text"><kbd className="inline-flex items-center justify-center min-w-[28px] h-6 px-1.5 border border-line-strong rounded-[5px] bg-panel-2 text-muted font-mono text-[11px] font-bold">Delete</kbd><span>Delete selected</span></div>
            </div>
          </div>
        </section>
      </div>

      <div id="toast-container" className="toast-container fixed bottom-5 left-1/2 -translate-x-1/2 z-[70] flex flex-col items-center gap-2 pointer-events-none" aria-live="polite" />
    </>
  );
}
