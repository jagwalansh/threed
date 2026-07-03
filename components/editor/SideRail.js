const railItems = [
  {
    id: "file",
    label: "File",
    icon: <path d="M5 2.5h5l3 3v10H5z M10 2.5v3h3" />,
  },
  {
    id: "assets",
    label: "Assets",
    icon: <><circle cx="9" cy="9" r="7" /><path d="M9 5v8M5 9h8" /></>,
  },

];

export default function SideRail({ activeTab, onTabChange }) {
  return (
    <nav className="side-rail" aria-label="Primary">
      {railItems.map((item) => (
        <button
          className={`rail-item ${activeTab === item.id ? "active" : ""}`}
          type="button"
          title={item.label}
          key={item.id}
          onClick={() => onTabChange(item.id)}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {item.icon}
          </svg>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
