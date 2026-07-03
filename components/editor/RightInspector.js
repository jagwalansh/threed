import CollapseButton from "./CollapseButton";

export default function RightInspector({ collapsed, onToggleCollapse }) {
  return (
    <aside className="right-panel">
      <div className="inspector-top min-h-[62px] border-b border-line flex items-center justify-between px-4">
        <div className="avatar-dot w-[30px] h-[30px] rounded-full" />
        <button
          className="inspector-play inspector-collapse-button w-[34px] h-[34px] border-0 rounded-[7px] grid place-items-center text-white bg-transparent hover:bg-[#383838]"
          type="button"
          aria-label={collapsed ? "Expand right inspector" : "Collapse right inspector"}
          aria-expanded={!collapsed}
          onClick={onToggleCollapse}
          title={collapsed ? "Expand inspector" : "Collapse inspector"}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d={collapsed ? "M10 3L5 8l5 5" : "M6 3l5 5-5 5"} />
          </svg>
        </button>
      </div>
      <div className="inspector-tabs min-h-[42px] border-b border-line grid grid-cols-[auto_auto_1fr] items-center gap-2 px-4">
        <button className="active min-h-[30px] border-0 rounded-[7px] px-2.5 text-[13px] font-bold text-white bg-[#3a3a3a]" type="button">Design</button>
        <button className="min-h-[30px] border-0 rounded-[7px] px-2.5 text-[13px] font-bold text-[#bdbdbd] bg-transparent" type="button">Prototype</button>
        <span id="inspector-zoom-copy" className="justify-self-end text-[#d0d0d0] text-[13px] font-bold">100%</span>
      </div>

      <section className="panel border-0 border-b border-line rounded-none bg-transparent px-[18px] py-[14px]">
        <div className="panel-heading flex items-center gap-2 mb-2.5">
          <CollapseButton label="Section" />
          <h2 className="flex-1 text-xs leading-tight font-bold">Section</h2>
        </div>
        <div className="panel-body">
          <label className="field grid gap-1.5">
            <span className="text-muted text-[11px] font-bold">Name</span>
            <input id="section-name" type="text" defaultValue="Hero" className="min-h-[32px] border border-[#3f3f3f] rounded-[7px] px-2.5 text-text bg-[#383838] text-xs font-semibold focus:outline-none focus:border-blue" />
          </label>
          <label className="field grid gap-1.5 mt-2.5">
            <span className="text-muted text-[11px] font-bold">Background</span>
            <div className="color-input-wrap flex items-center gap-1.5">
              <input id="section-bg" type="color" defaultValue="#ffffff" className="color-swatch-input w-[32px] h-[32px] border border-[#3f3f3f] rounded-md p-[2px] cursor-pointer bg-transparent shrink-0" />
              <input id="section-bg-hex" type="text" defaultValue="#ffffff" className="color-hex-input min-h-[32px] border border-[#3f3f3f] rounded-[7px] px-2 text-text bg-[#383838] text-[11px] font-semibold font-mono w-full focus:outline-none focus:border-blue" placeholder="#ffffff" />
            </div>
          </label>
        </div>
      </section>

      <section className="panel border-0 border-b border-line rounded-none bg-transparent px-[18px] py-[14px]">
        <div className="panel-heading flex items-center gap-2 mb-2.5">
          <CollapseButton label="Animation" />
          <h2 className="flex-1 text-xs leading-tight font-bold">Animation</h2>
          <button id="clear-path" className="small-button min-h-[26px] px-2 text-xs font-bold border border-transparent rounded-md bg-[#383838] text-text hover:bg-button-hover active:scale-[0.96]" type="button" title="Clear all path points">Clear</button>
        </div>
        <div className="panel-body">
          <div className="control grid gap-1.5 mt-2.5">
            <label htmlFor="easing" className="text-muted text-[11px] font-bold">Easing preset</label>
            <select id="easing" className="select-input min-h-[32px] border border-[#3f3f3f] rounded-[7px] px-2.5 text-text bg-[#383838] text-xs font-semibold cursor-pointer focus:outline-none focus:border-blue" defaultValue="easeInOut">
              <option value="linear">Linear</option>
              <option value="easeInOut">Ease In-Out</option>
              <option value="easeIn">Ease In</option>
              <option value="easeOut">Ease Out</option>
              <option value="spring">Spring</option>
              <option value="custom">Custom Bezier</option>
            </select>
          </div>

          <div id="bezier-editor-panel" className="bezier-editor-panel mt-2 p-2.5 bg-panel-2 rounded-md border border-line flex flex-col gap-2" style={{ display: "none" }}>
            <span className="panel-sublabel text-[10px] text-muted font-semibold text-center">Drag graph handles to customize easing</span>
            <div className="bezier-canvas-wrapper flex justify-center bg-[#383838] rounded-sm p-2 border border-line">
              <canvas id="bezier-canvas" width="220" height="150" />
            </div>
            <div className="bezier-coordinate-row grid grid-cols-4 gap-1">
              <div className="bezier-coord flex flex-col gap-[3px]">
                <label htmlFor="bezier-x1" className="text-[9px] text-muted font-bold uppercase text-center">P1 x</label>
                <input id="bezier-x1" type="number" min="0" max="1" step="0.05" defaultValue="0.25" className="w-full h-6 border border-[#3f3f3f] bg-[#383838] text-text rounded text-[10px] font-semibold text-center p-0 font-mono" />
              </div>
              <div className="bezier-coord flex flex-col gap-[3px]">
                <label htmlFor="bezier-y1" className="text-[9px] text-muted font-bold uppercase text-center">P1 y</label>
                <input id="bezier-y1" type="number" min="-1" max="2" step="0.05" defaultValue="0.25" className="w-full h-6 border border-[#3f3f3f] bg-[#383838] text-text rounded text-[10px] font-semibold text-center p-0 font-mono" />
              </div>
              <div className="bezier-coord flex flex-col gap-[3px]">
                <label htmlFor="bezier-x2" className="text-[9px] text-muted font-bold uppercase text-center">P2 x</label>
                <input id="bezier-x2" type="number" min="0" max="1" step="0.05" defaultValue="0.75" className="w-full h-6 border border-[#3f3f3f] bg-[#383838] text-text rounded text-[10px] font-semibold text-center p-0 font-mono" />
              </div>
              <div className="bezier-coord flex flex-col gap-[3px]">
                <label htmlFor="bezier-y2" className="text-[9px] text-muted font-bold uppercase text-center">P2 y</label>
                <input id="bezier-y2" type="number" min="-1" max="2" step="0.05" defaultValue="0.75" className="w-full h-6 border border-[#3f3f3f] bg-[#383838] text-text rounded text-[10px] font-semibold text-center p-0 font-mono" />
              </div>
            </div>
          </div>

          <div className="control grid gap-1.5 mt-2.5">
            <label htmlFor="duration" className="text-muted text-[11px] font-bold">Duration (ms)</label>
            <input id="duration" type="number" min="500" max="10000" step="100" defaultValue="3200" className="number-input w-full min-h-[32px] border border-[#3f3f3f] rounded-[7px] px-2.5 text-text bg-[#383838] text-xs font-semibold focus:outline-none focus:border-blue" />
          </div>
          <div className="control grid gap-1.5 mt-2.5">
            <label htmlFor="path-depth" className="text-muted text-[11px] font-bold">3D depth</label>
            <input id="path-depth" type="range" min="-2.5" max="2.5" step="0.1" defaultValue="0" />
          </div>
          <div className="control grid gap-1.5 mt-2.5">
            <label htmlFor="scale" className="text-muted text-[11px] font-bold">Asset scale</label>
            <input id="scale" type="range" min="0.45" max="1.8" step="0.05" defaultValue="1" />
          </div>
          <div className="control grid gap-1.5 mt-2.5">
            <label htmlFor="camera-z" className="text-muted text-[11px] font-bold">Camera distance</label>
            <input id="camera-z" type="range" min="4" max="9" step="0.1" defaultValue="6.2" />
          </div>

          <div className="point-inspector mt-3 pt-2.5 border-t border-line">
            <div className="panel-heading compact-heading flex items-center gap-2 mb-1.5">
              <h2 id="point-label" className="flex-1 text-xs leading-tight font-bold">Point 1 transform</h2>
            </div>
            <div id="point-list" className="point-list grid grid-cols-4 gap-1" aria-label="Path points" />
            <div className="control grid gap-1.5 mt-2.5">
              <label htmlFor="point-x" className="text-muted text-[11px] font-bold">Position X</label>
              <input id="point-x" type="range" min="-100" max="100" step="1" defaultValue="0" />
            </div>
            <div className="control grid gap-1.5 mt-2.5">
              <label htmlFor="point-y" className="text-muted text-[11px] font-bold">Position Y</label>
              <input id="point-y" type="range" min="-100" max="100" step="1" defaultValue="0" />
            </div>
            <div className="control grid gap-1.5 mt-2.5">
              <label htmlFor="point-z" className="text-muted text-[11px] font-bold">Position Z</label>
              <input id="point-z" type="range" min="-3" max="3" step="0.05" defaultValue="0" />
            </div>
            <div className="control grid gap-1.5 mt-2.5">
              <label htmlFor="point-pitch" className="text-muted text-[11px] font-bold">Rotate X</label>
              <input id="point-pitch" type="range" min="-180" max="180" step="1" defaultValue="0" />
            </div>
            <div className="control grid gap-1.5 mt-2.5">
              <label htmlFor="point-yaw" className="text-muted text-[11px] font-bold">Rotate Y</label>
              <input id="point-yaw" type="range" min="-180" max="180" step="1" defaultValue="0" />
            </div>
            <div className="control grid gap-1.5 mt-2.5">
              <label htmlFor="point-roll" className="text-muted text-[11px] font-bold">Rotate Z</label>
              <input id="point-roll" type="range" min="-180" max="180" step="1" defaultValue="0" />
            </div>
          </div>
          <div className="segmented mt-2.5 grid grid-cols-3 gap-1" aria-label="Lighting preset">
            <button className="segment active min-h-[32px] border border-transparent rounded-md bg-[#383838] text-text text-[11px] font-bold flex items-center justify-center gap-[5px] hover:bg-button-hover hover:border-line-strong active:scale-[0.96]" data-light="studio" type="button">Studio</button>
            <button className="segment min-h-[32px] border border-transparent rounded-md bg-[#383838] text-text text-[11px] font-bold flex items-center justify-center gap-[5px] hover:bg-button-hover hover:border-line-strong active:scale-[0.96]" data-light="soft" type="button">Soft</button>
            <button className="segment min-h-[32px] border border-transparent rounded-md bg-[#383838] text-text text-[11px] font-bold flex items-center justify-center gap-[5px] hover:bg-button-hover hover:border-line-strong active:scale-[0.96]" data-light="neon" type="button">Neon</button>
          </div>
        </div>
      </section>

      <section className="panel border-0 border-b border-line rounded-none bg-transparent px-[18px] py-[14px]" id="text-format-panel" style={{ display: "none" }}>
        <div className="panel-heading flex items-center gap-2 mb-2.5">
          <CollapseButton label="Text" />
          <h2 className="flex-1 text-xs leading-tight font-bold">Text</h2>
        </div>
        <div className="panel-body">
          <div className="control grid gap-1.5 mt-2.5">
            <label htmlFor="text-kind" className="text-muted text-[11px] font-bold">Type</label>
            <select id="text-kind" className="select-input min-h-[32px] border border-[#3f3f3f] rounded-[7px] px-2.5 text-text bg-[#383838] text-xs font-semibold cursor-pointer focus:outline-none focus:border-blue">
              <option value="headline">Headline</option>
              <option value="body">Body</option>
            </select>
          </div>
          <div className="control grid gap-1.5 mt-2.5">
            <label htmlFor="text-size" className="text-muted text-[11px] font-bold">Size (px)</label>
            <input id="text-size" type="number" min="10" max="120" step="1" defaultValue="36" className="number-input w-full min-h-[32px] border border-[#3f3f3f] rounded-[7px] px-2.5 text-text bg-[#383838] text-xs font-semibold focus:outline-none focus:border-blue" />
          </div>
          <div className="control grid gap-1.5 mt-2.5">
            <label htmlFor="text-color" className="text-muted text-[11px] font-bold">Color</label>
            <div className="color-input-wrap flex items-center gap-1.5">
              <input id="text-color" type="color" defaultValue="#111827" className="color-swatch-input w-[32px] h-[32px] border border-[#3f3f3f] rounded-md p-[2px] cursor-pointer bg-transparent shrink-0" />
              <input id="text-color-hex" type="text" defaultValue="#111827" className="color-hex-input min-h-[32px] border border-[#3f3f3f] rounded-[7px] px-2 text-text bg-[#383838] text-[11px] font-semibold font-mono w-full focus:outline-none focus:border-blue" />
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
}
