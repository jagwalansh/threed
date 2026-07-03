"use client";

import { useState } from "react";
import RuntimeLoader from "./RuntimeLoader";
import SideRail from "./SideRail";
import LeftSidebar from "./LeftSidebar";
import TopBar from "./TopBar";
import Stage from "./Stage";
import RightInspector from "./RightInspector";
import Overlays, { LoadingSkeleton } from "./Overlays";

export default function EditorApp() {
  const [activeTab, setActiveTab] = useState("file");
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const shellClassName = [
    "app-shell",
    "ready",
    leftCollapsed ? "left-collapsed" : "",
    rightCollapsed ? "right-collapsed" : "",
  ].filter(Boolean).join(" ");

  return (
    <>
      <LoadingSkeleton />
      <main className={shellClassName} id="app-shell">
        <SideRail activeTab={activeTab} onTabChange={setActiveTab} />
        <LeftSidebar activeTab={activeTab} collapsed={leftCollapsed} onToggleCollapse={() => setLeftCollapsed((value) => !value)} />
        <section className="workspace">
          <TopBar />
          <Stage />
        </section>
        <RightInspector collapsed={rightCollapsed} onToggleCollapse={() => setRightCollapsed((value) => !value)} />
      </main>
      <Overlays />
      <RuntimeLoader />
    </>
  );
}
