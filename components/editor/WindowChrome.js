export default function WindowChrome() {
  return (
    <header className="window-chrome" aria-label="App window">
      <div className="traffic-lights" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <button className="chrome-home" type="button" title="Home">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
          <path d="M2.5 7.2L8 2.8l5.5 4.4v6.3h-4V9h-3v4.5h-4z" />
        </svg>
      </button>
      <div className="chrome-tab active">
        <span className="tab-icon" />
        <strong>Untitled</strong>
        <button type="button" title="Close">×</button>
      </div>
      <div className="chrome-tab">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <path d="M5 3l8 5-8 5z" />
        </svg>
        <strong>Untitled</strong>
      </div>
      <button className="chrome-plus" type="button" title="New file">+</button>
      <div className="chrome-spacer" />
      <span className="chrome-status">PathForge</span>
    </header>
  );
}
