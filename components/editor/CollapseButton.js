export default function CollapseButton({ label }) {
  return (
    <button className="panel-collapse-btn" type="button" aria-expanded="true" aria-label={`Toggle ${label} panel`}>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
        <path d="M2 3.5L5 7L8 3.5H2Z" />
      </svg>
    </button>
  );
}
