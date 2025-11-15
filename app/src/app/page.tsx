"use client";

import {
  Activity,
  ArrowUpRight,
  Brain,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  CloudCog,
  FileText,
  Flame,
  Layers3,
  Paintbrush,
  PenSquare,
  Plus,
  Rocket,
  Sparkles,
  TimerReset,
  Workflow,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

type StageKey = "vision" | "build" | "launch";
type EnergyLevel = "High" | "Medium" | "Low";

interface Task {
  id: string;
  title: string;
  stage: StageKey;
  energy: EnergyLevel;
  due: string;
  service: string;
}

interface Deliverable {
  id: string;
  client: string;
  asset: string;
  service: string;
  due: string;
  status: "Drafting" | "QA" | "Ready";
  link?: string;
}

interface Asset {
  id: string;
  name: string;
  type: "Prompt" | "Workflow" | "Persona" | "Template";
  focus: string;
  freshness: "Evergreen" | "Review" | "Retire";
  updated: string;
}

const stageOrder: StageKey[] = ["vision", "build", "launch"];

const stageMeta: Record<
  StageKey,
  { title: string; blurb: string; accent: string }
> = {
  vision: {
    title: "Vision Map",
    blurb: "Shape demand, scope impact, align intent.",
    accent: "from-indigo-400/80 to-violet-500/80",
  },
  build: {
    title: "Build Sprint",
    blurb: "Engineer, automate, and test service assets.",
    accent: "from-emerald-400/80 to-cyan-400/70",
  },
  launch: {
    title: "Launch & Amplify",
    blurb: "Ship deliverables, trigger automations, follow-up.",
    accent: "from-amber-400/80 to-orange-500/70",
  },
};

const services = [
  {
    id: "custom-engines",
    name: "Custom AI Engines",
    pipeline: [
      { label: "Discovery", status: "done" },
      { label: "Architecture", status: "active" },
      { label: "Training", status: "pending" },
      { label: "Deployment", status: "pending" },
    ],
    health: 76,
    activeDeals: 3,
    nextAction: "Finalize eval harness for retail bot",
  },
  {
    id: "prompt-engineering",
    name: "Prompt Engineering",
    pipeline: [
      { label: "Audit", status: "done" },
      { label: "Design", status: "done" },
      { label: "Validate", status: "active" },
      { label: "Delivery", status: "pending" },
    ],
    health: 88,
    activeDeals: 5,
    nextAction: "Ship persona-specific prompt pack v2",
  },
  {
    id: "creative-production",
    name: "Creative Production",
    pipeline: [
      { label: "Concept", status: "active" },
      { label: "Storyboard", status: "pending" },
      { label: "Scripting", status: "pending" },
      { label: "Delivery", status: "pending" },
    ],
    health: 62,
    activeDeals: 2,
    nextAction: "Lock the visual identity for SaaS teaser",
  },
  {
    id: "workflow-audits",
    name: "Workflow Audits",
    pipeline: [
      { label: "Map", status: "done" },
      { label: "Model", status: "active" },
      { label: "Automate", status: "pending" },
      { label: "Review", status: "pending" },
    ],
    health: 72,
    activeDeals: 4,
    nextAction: "Synthesize async audit report for VegaOps",
  },
  {
    id: "persona-kits",
    name: "Brand Persona Kits",
    pipeline: [
      { label: "Discovery", status: "done" },
      { label: "Identity", status: "done" },
      { label: "Messaging", status: "active" },
      { label: "Toolkit", status: "pending" },
    ],
    health: 91,
    activeDeals: 3,
    nextAction: "Refresh tone matrices with latest campaign data",
  },
  {
    id: "subscription-access",
    name: "Subscription Access",
    pipeline: [
      { label: "Curate", status: "done" },
      { label: "Bundle", status: "active" },
      { label: "Launch", status: "pending" },
      { label: "Retain", status: "pending" },
    ],
    health: 68,
    activeDeals: 120,
    nextAction: "Draft onboarding drip for Pro tier",
  },
];

const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Architect dynamic evaluation ladder for finance copilot",
    stage: "vision",
    energy: "High",
    due: "2025-03-06",
    service: "Custom AI Engines",
  },
  {
    id: "task-2",
    title: "Refine premium persona kit prompts for SaaS visionary",
    stage: "build",
    energy: "Medium",
    due: "2025-03-05",
    service: "Brand Persona Kits",
  },
  {
    id: "task-3",
    title: "Storyboard creative series for workflow automation launch",
    stage: "vision",
    energy: "Low",
    due: "2025-03-08",
    service: "Creative Production",
  },
  {
    id: "task-4",
    title: "QA subscription onboarding automations & trigger flows",
    stage: "launch",
    energy: "Medium",
    due: "2025-03-07",
    service: "Subscription Access",
  },
];

const initialDeliverables: Deliverable[] = [
  {
    id: "deliverable-1",
    client: "Helios Labs",
    asset: "LLM Engine Blueprint",
    service: "Custom AI Engines",
    due: "Mar 9",
    status: "QA",
    link: "https://figma.com/file/helios-llm",
  },
  {
    id: "deliverable-2",
    client: "Atlas Studio",
    asset: "Creative Launch Kit",
    service: "Creative Production",
    due: "Mar 11",
    status: "Drafting",
  },
  {
    id: "deliverable-3",
    client: "Neon Quill",
    asset: "Persona DNA System",
    service: "Brand Persona Kits",
    due: "Mar 6",
    status: "Ready",
    link: "https://notion.so/neonquill",
  },
  {
    id: "deliverable-4",
    client: "VegaOps",
    asset: "Automation Audit Scorecard",
    service: "Workflow Audits",
    due: "Mar 10",
    status: "QA",
  },
];

const initialAssets: Asset[] = [
  {
    id: "asset-1",
    name: "Persona Dial: Challenger x Visionary matrix",
    type: "Persona",
    focus: "Brand Persona Kits",
    freshness: "Evergreen",
    updated: "Mar 2",
  },
  {
    id: "asset-2",
    name: "Prompt Ladder / Founder's Launch Narrative",
    type: "Prompt",
    focus: "Prompt Engineering",
    freshness: "Review",
    updated: "Feb 27",
  },
  {
    id: "asset-3",
    name: "Automation Audit Heatmap Template",
    type: "Workflow",
    focus: "Workflow Audits",
    freshness: "Evergreen",
    updated: "Mar 3",
  },
  {
    id: "asset-4",
    name: "Tiered Access Pricing Scenario Model",
    type: "Template",
    focus: "Subscription Access",
    freshness: "Review",
    updated: "Feb 24",
  },
  {
    id: "asset-5",
    name: "Creative Launch Storyboard Pack v4",
    type: "Template",
    focus: "Creative Production",
    freshness: "Evergreen",
    updated: "Mar 1",
  },
];

const focusBlocks = [
  {
    id: "focus-1",
    label: "Deep Work: Engine Architectures",
    start: "09:00",
    end: "11:30",
    energy: "High",
    intent: "Unlock finance copilot blueprint milestones",
  },
  {
    id: "focus-2",
    label: "Client Delivery Sprint",
    start: "13:00",
    end: "15:00",
    energy: "Medium",
    intent: "Ship Neon Quill persona toolkit & QA VegaOps audit",
  },
  {
    id: "focus-3",
    label: "Brand Studio Play",
    start: "16:00",
    end: "17:15",
    energy: "Low",
    intent: "Design creative launch motifs for subscription tiers",
  },
];

export default function Home() {
  const [now, setNow] = useState(() => new Date());
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [deliverables, setDeliverables] =
    useState<Deliverable[]>(initialDeliverables);
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [assetFilter, setAssetFilter] = useState<
    Asset["type"] | "All"
  >("All");
  const [notes, setNotes] = useState(
    "• Turn finance copilot into marquee case study\n• Record Loom of prompt governance workflow\n• Layer storytelling arc into upcoming founder newsletter"
  );
  const [newTask, setNewTask] = useState<Omit<Task, "id">>({
    title: "",
    stage: "vision",
    energy: "Medium",
    due: "",
    service: "Custom AI Engines",
  });
  const [newAsset, setNewAsset] = useState<Omit<Asset, "id">>({
    name: "",
    type: "Prompt",
    focus: "Prompt Engineering",
    freshness: "Evergreen",
    updated: "Today",
  });

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(now);
  }, [now]);

  const dueFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }),
    []
  );

  const stageTallies = useMemo(() => {
    return stageOrder.reduce<Record<StageKey, number>>(
      (acc, stage) => ({
        ...acc,
        [stage]: tasks.filter((task) => task.stage === stage).length,
      }),
      {
        vision: 0,
        build: 0,
        launch: 0,
      }
    );
  }, [tasks]);

  const runwayScore = useMemo(() => {
    const velocity = tasks.filter((task) => task.stage !== "vision").length;
    const weighting = deliverables.filter((deliverable) => deliverable.status !== "Drafting").length;
    return Math.min(100, 46 + velocity * 6 + weighting * 5);
  }, [tasks, deliverables]);

  const filteredAssets = useMemo(() => {
    if (assetFilter === "All") return assets;
    return assets.filter((asset) => asset.type === assetFilter);
  }, [assetFilter, assets]);

  const handleTaskSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTask.title.trim()) {
      return;
    }
    const id =
      globalThis.crypto?.randomUUID() ??
      Math.random().toString(36).slice(2, 9);
    setTasks((prev) => [
      ...prev,
      {
        ...newTask,
        id,
      },
    ]);
    setNewTask({
      title: "",
      stage: "vision",
      energy: "Medium",
      due: "",
      service: "Custom AI Engines",
    });
  };

  const handleAdvanceTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        const index = stageOrder.indexOf(task.stage);
        const next = Math.min(stageOrder.length - 1, index + 1);
        return { ...task, stage: stageOrder[next] };
      })
    );
  };

  const handleRewindTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        const index = stageOrder.indexOf(task.stage);
        const next = Math.max(0, index - 1);
        return { ...task, stage: stageOrder[next] };
      })
    );
  };

  const toggleDeliverableStatus = (id: string) => {
    setDeliverables((prev) =>
      prev.map((deliverable) => {
        if (deliverable.id !== id) return deliverable;
        const cycle: Deliverable["status"][] = ["Drafting", "QA", "Ready"];
        const currentIndex = cycle.indexOf(deliverable.status);
        const next = cycle[(currentIndex + 1) % cycle.length];
        return { ...deliverable, status: next };
      })
    );
  };

  const handleAssetSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newAsset.name.trim()) {
      return;
    }
    const id =
      globalThis.crypto?.randomUUID() ??
      Math.random().toString(36).slice(2, 9);
    setAssets((prev) => [
      {
        ...newAsset,
        id,
        updated: "Today",
      },
      ...prev,
    ]);
    setNewAsset({
      name: "",
      type: "Prompt",
      focus: "Prompt Engineering",
      freshness: "Evergreen",
      updated: "Today",
    });
  };

  return (
    <main className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-6 pb-16 pt-10 md:px-8 lg:px-12">
      <header className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/12 via-white/8 to-white/5 p-8 shadow-[0_60px_120px_-50px_rgba(2,8,20,0.95)] backdrop-blur-lg">
        <div className="absolute -top-24 right-14 h-48 w-48 rounded-full bg-[radial-gradient(circle_at_center,_rgba(124,92,255,0.2),_transparent_65%)]" />
        <div className="absolute -bottom-32 left-20 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,_rgba(56,248,192,0.18),_transparent_68%)]" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[560px] space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-sm font-medium text-white/80 backdrop-blur">
              <Sparkles className="h-4 w-4 text-violet-200" />
              Command Console: Solo Founder Mode
            </span>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Orchestrate every AI service move from one luminous cockpit.
              </h1>
              <p className="mt-3 text-base text-white/70">
                {formattedDate} · Flight plan locked. Continue scaling strategic
                engagements, automate delivery, and keep every asset ready to
                ship.
              </p>
            </div>
          </div>
          <div className="grid gap-3 text-sm md:grid-cols-2">
            <MetricPill
              title="Operating Tempo"
              value={`${runwayScore}%`}
              detail="Momentum vs. target"
              icon={<Activity className="h-4 w-4 text-emerald-300" />}
            />
            <MetricPill
              title="Revenue Pulse"
              value="$38.6K"
              detail="60-day recurring"
              icon={<Rocket className="h-4 w-4 text-amber-300" />}
            />
            <MetricPill
              title="Active Programs"
              value={`${services.length}`}
              detail="6 service lines"
              icon={<Workflow className="h-4 w-4 text-sky-200" />}
            />
            <MetricPill
              title="Delivery Confidence"
              value="92%"
              detail="Client satisfaction trend"
              icon={<ClipboardList className="h-4 w-4 text-violet-200" />}
            />
          </div>
        </div>
      </header>

      <section className="grid gap-8 xl:grid-cols-[3fr_2fr]">
        <div className="space-y-8">
          <section className="rounded-[28px] border border-white/10 bg-white/[0.08] p-6 backdrop-blur-2xl">
            <header className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  Mission Control Board
                </h2>
                <p className="text-sm text-white/60">
                  Plan, execute, and launch across the three operating horizons.
                </p>
              </div>
              <div className="flex overflow-hidden rounded-full border border-white/10">
                {stageOrder.map((stage) => (
                  <div
                    key={stage}
                    className={`flex items-center gap-2 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/70 ${stageMeta[stage].accent.includes("emerald") ? "bg-white/10" : ""}`}
                  >
                    <span className="h-4 w-4 rounded-full border border-white/20 bg-white/10" />
                    {stageMeta[stage].title}
                    <span className="text-white/50">
                      {stageTallies[stage]} active
                    </span>
                  </div>
                ))}
              </div>
            </header>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              {stageOrder.map((stage) => (
                <div
                  key={stage}
                  className="relative flex h-full flex-col gap-4 rounded-[24px] border border-white/10 bg-gradient-to-br from-white/12 to-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                >
                  <div className="absolute inset-x-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">
                        {stageMeta[stage].title}
                      </h3>
                      <p className="text-xs text-white/60">
                        {stageMeta[stage].blurb}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full bg-gradient-to-r ${stageMeta[stage].accent} px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/90`}
                    >
                      {stageTallies[stage]} live
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-3">
                    {tasks
                      .filter((task) => task.stage === stage)
                      .map((task) => (
                        <article
                          key={task.id}
                          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.08] p-4 transition-all duration-200 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.12]"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wide text-white/60">
                              {task.service}
                            </span>
                            <span className="text-xs text-white/50">
                              {task.due
                                ? `due ${dueFormatter.format(new Date(`${task.due}T00:00:00`))}`
                                : "due TBD"}
                            </span>
                          </div>
                          <h4 className="mt-2 text-sm font-medium leading-5 text-white/90">
                            {task.title}
                          </h4>
                          <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-wide text-white/50">
                            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1">
                              <Flame className="h-3 w-3 text-rose-200" />
                              {task.energy} Energy
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleRewindTask(task.id)}
                                className="rounded-full border border-white/10 bg-white/5 p-1 transition hover:border-white/30 hover:bg-white/10"
                              >
                                <ChevronLeft className="h-4 w-4 text-white/60" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAdvanceTask(task.id)}
                                className="rounded-full border border-white/10 bg-white/5 p-1 transition hover:border-white/30 hover:bg-white/10"
                              >
                                <ChevronRight className="h-4 w-4 text-white/70" />
                              </button>
                            </div>
                          </div>
                        </article>
                      ))}
                    {tasks.filter((task) => task.stage === stage).length ===
                      0 && (
                      <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.03] text-xs text-white/40">
                        Drop a mission here next.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleTaskSubmit}
              className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 md:grid-cols-[2fr_1fr_1fr_auto]"
            >
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wide text-white/50">
                  Task
                </label>
                <input
                  className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none transition focus:border-violet-400/80 focus:ring-2 focus:ring-violet-500/40"
                  placeholder="Define the next decisive move…"
                  value={newTask.title}
                  onChange={(event) =>
                    setNewTask((prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wide text-white/50">
                  Service
                </label>
                <select
                  className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-violet-400/80 focus:ring-2 focus:ring-violet-500/40"
                  value={newTask.service}
                  onChange={(event) =>
                    setNewTask((prev) => ({
                      ...prev,
                      service: event.target.value,
                    }))
                  }
                >
                  {services.map((service) => (
                    <option key={service.id}>{service.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-wide text-white/50">
                    Stage
                  </label>
                  <select
                    className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-violet-400/80 focus:ring-2 focus:ring-violet-500/40"
                    value={newTask.stage}
                    onChange={(event) =>
                      setNewTask((prev) => ({
                        ...prev,
                        stage: event.target.value as StageKey,
                      }))
                    }
                  >
                    {stageOrder.map((stage) => (
                      <option key={stage} value={stage}>
                        {stageMeta[stage].title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-wide text-white/50">
                    Energy
                  </label>
                  <select
                    className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-violet-400/80 focus:ring-2 focus:ring-violet-500/40"
                    value={newTask.energy}
                    onChange={(event) =>
                      setNewTask((prev) => ({
                        ...prev,
                        energy: event.target.value as EnergyLevel,
                      }))
                    }
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col justify-end gap-2 md:flex-row md:items-end">
                <div className="flex flex-col gap-2 md:w-36">
                  <label className="text-xs uppercase tracking-wide text-white/50 md:hidden">
                    Due
                  </label>
                  <input
                    type="date"
                    className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/70 outline-none focus:border-violet-400/80 focus:ring-2 focus:ring-violet-500/40"
                    value={newTask.due}
                    onChange={(event) =>
                      setNewTask((prev) => ({
                        ...prev,
                        due: event.target.value,
                      }))
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 self-end rounded-xl border border-violet-500/40 bg-violet-500/30 px-4 py-3 text-sm font-semibold text-white/90 transition hover:-translate-y-[1px] hover:border-violet-400/90 hover:bg-violet-500/40"
                >
                  <Plus className="h-4 w-4" />
                  Queue Task
                </button>
              </div>
            </form>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.08] p-6 backdrop-blur-xl">
              <header className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Service Pipelines</h2>
                  <p className="text-sm text-white/60">
                    Monitor depth across every service universe.
                  </p>
                </div>
                <PenSquare className="h-5 w-5 text-white/50" />
              </header>
              <div className="mt-5 space-y-4">
                {services.map((service) => (
                  <article
                    key={service.id}
                    className="rounded-2xl border border-white/10 bg-gradient-to-r from-white/10 via-white/6 to-transparent p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-medium text-white">
                          {service.name}
                        </h3>
                        <p className="text-xs uppercase tracking-wide text-white/50">
                          {service.activeDeals} active streams
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/70">
                        <Rocket className="h-4 w-4 text-emerald-300" />
                        Health {service.health}%
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-[11px] uppercase tracking-wide text-white/40">
                      {service.pipeline.map((step, index) => (
                        <div key={step.label} className="flex items-center gap-2">
                          <div
                            className={`flex h-7 min-w-[110px] items-center justify-between rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-white/70 ${
                              step.status === "done"
                                ? "bg-emerald-500/30 border-emerald-400/40 text-white"
                                : step.status === "active"
                                  ? "bg-violet-500/30 border-violet-400/40 text-white"
                                  : "bg-white/5"
                            }`}
                          >
                            {step.label}
                            {step.status === "active" && (
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            )}
                          </div>
                          {index < service.pipeline.length - 1 && (
                            <span className="h-px w-6 bg-gradient-to-r from-white/10 via-white/20 to-transparent" />
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 text-sm text-white/70">
                      Next: {service.nextAction}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="flex h-full flex-col gap-5">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-xl">
                <h3 className="text-lg font-semibold">Subscription Ladder</h3>
                <p className="text-xs uppercase tracking-wide text-white/50">
                  Prompt + model access tiers
                </p>
                <div className="mt-4 space-y-4">
                  {[
                    {
                      tier: "Core",
                      price: "$149",
                      members: 58,
                      highlight: "Weekly prompt refills & office hours",
                      accent: "from-white/12 via-white/8 to-transparent",
                    },
                    {
                      tier: "Pro",
                      price: "$329",
                      members: 42,
                      highlight: "Model gallery + workflow automation vault",
                      accent: "from-violet-500/25 via-purple-500/20 to-transparent",
                    },
                    {
                      tier: "Signature",
                      price: "$780",
                      members: 20,
                      highlight: "Custom engine tuning & 1:1 command guidance",
                      accent: "from-emerald-400/30 via-teal-400/20 to-transparent",
                    },
                  ].map((tier) => (
                    <div
                      key={tier.tier}
                      className={`rounded-2xl border border-white/10 bg-gradient-to-r ${tier.accent} p-4`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-white/60">
                            {tier.tier} Tier
                          </p>
                          <h4 className="text-lg font-semibold">{tier.price}</h4>
                        </div>
                        <span className="text-sm text-white/70">
                          {tier.members} members
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-white/70">
                        {tier.highlight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-xl">
                <h3 className="text-lg font-semibold">Focus Blocks</h3>
                <p className="text-xs uppercase tracking-wide text-white/50">
                  Anchor your energy arcs
                </p>
                <div className="mt-4 space-y-3">
                  {focusBlocks.map((block) => (
                    <div
                      key={block.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.06] p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-wide text-white/50">
                          {block.start} – {block.end}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/30 px-2 py-1 text-[10px] uppercase tracking-wide text-white/60">
                          <TimerReset className="h-3.5 w-3.5 text-emerald-300" />
                          {block.energy} focus
                        </span>
                      </div>
                      <h4 className="mt-2 text-sm font-medium text-white/90">
                        {block.label}
                      </h4>
                      <p className="text-xs text-white/60">{block.intent}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.08] p-6 backdrop-blur-xl">
              <header className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Client Delivery</h2>
                  <p className="text-sm text-white/60">
                    Track momentum, approvals, and links ready to ship.
                  </p>
                </div>
                <CalendarCheck className="h-5 w-5 text-white/60" />
              </header>
              <div className="mt-5 space-y-3">
                {deliverables.map((deliverable) => (
                  <div
                    key={deliverable.id}
                    className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm font-semibold text-white/90">
                          {deliverable.asset}
                        </h3>
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] uppercase tracking-wide text-white/60">
                          {deliverable.service}
                        </span>
                      </div>
                      <p className="text-xs text-white/60">
                        {deliverable.client} · due {deliverable.due}
                      </p>
                      {deliverable.link && (
                        <a
                          href={deliverable.link}
                          className="mt-2 inline-flex items-center gap-2 text-xs text-violet-200 hover:text-violet-100"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Open working file
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleDeliverableStatus(deliverable.id)}
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                          deliverable.status === "Ready"
                            ? "border-emerald-400/50 bg-emerald-500/30 text-emerald-100"
                            : deliverable.status === "QA"
                              ? "border-amber-400/50 bg-amber-500/25 text-amber-100"
                              : "border-white/10 bg-white/5 text-white/70"
                        }`}
                      >
                        {deliverable.status}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                      <div className="hidden min-w-[100px] flex-col text-right text-[11px] uppercase tracking-wide text-white/50 sm:flex">
                        <span>next check-in</span>
                        <span className="text-white/70">
                          {deliverable.status === "Ready"
                            ? "Send launch recap"
                            : "QA sync today"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.08] p-6 backdrop-blur-xl">
                <h3 className="text-lg font-semibold">Systems Radar</h3>
                <p className="text-xs uppercase tracking-wide text-white/50">
                  Automation + audits
                </p>
                <div className="mt-4 space-y-4">
                  {[
                    {
                      label: "Model governance checks",
                      load: 78,
                      icon: Brain,
                      detail: "Weekly evaluation suite executed",
                    },
                    {
                      label: "Automation uptime",
                      load: 96,
                      icon: CloudCog,
                      detail: "36 webhooks firing · 0 failures",
                    },
                    {
                      label: "Workflow audit pipeline",
                      load: 68,
                      icon: Layers3,
                      detail: "2 ready for automation rollout",
                    },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                            <item.icon className="h-5 w-5 text-violet-200" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white/90">
                              {item.label}
                            </p>
                            <p className="text-xs text-white/60">
                              {item.detail}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-white/80">
                          {item.load}%
                        </span>
                      </div>
                      <div className="mt-3 h-2 w-full rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-400 via-emerald-400 to-sky-400"
                          style={{ width: `${item.load}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.08] p-6 backdrop-blur-xl">
                <h3 className="text-lg font-semibold">Notebook // Signals</h3>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="mt-4 h-40 w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/80 outline-none focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/30"
                  spellCheck={false}
                />
                <p className="mt-3 text-[11px] uppercase tracking-wide text-white/40">
                  Freewrite insights, meeting hooks, IP sparks.
                </p>
              </div>
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-8">
          <section className="rounded-[28px] border border-white/10 bg-white/[0.08] p-6 backdrop-blur-xl">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Blueprint Vault & Assets
                </h2>
                <p className="text-sm text-white/60">
                  Govern prompts, workflows, personas, and templates.
                </p>
              </div>
              <ClipboardList className="h-5 w-5 text-white/60" />
            </header>

            <div className="mt-5 flex flex-wrap gap-2">
              {(["All", "Prompt", "Workflow", "Persona", "Template"] as const).map(
                (type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAssetFilter(type)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-wide transition ${
                      assetFilter === type
                        ? "border-violet-400/60 bg-violet-500/20 text-white"
                        : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white/80"
                    }`}
                  >
                    {type}
                  </button>
                )
              )}
            </div>

            <div className="mt-6 space-y-3">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] p-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white/90">
                      {asset.name}
                    </h3>
                    <span className="text-xs uppercase tracking-wide text-white/50">
                      {asset.updated}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide text-white/50">
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/30 px-2 py-1">
                      <FileText className="h-3.5 w-3.5 text-violet-200" />
                      {asset.type}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-white/60">
                      {asset.focus}
                    </span>
                    <span
                      className={`rounded-full border px-2 py-1 ${
                        asset.freshness === "Evergreen"
                          ? "border-emerald-400/40 bg-emerald-500/20 text-emerald-100"
                          : asset.freshness === "Review"
                            ? "border-amber-400/40 bg-amber-500/20 text-amber-50"
                            : "border-rose-400/40 bg-rose-500/20 text-rose-50"
                      }`}
                    >
                      {asset.freshness}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleAssetSubmit}
              className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-black/30 p-4"
            >
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wide text-white/50">
                  Title
                </label>
                <input
                  value={newAsset.name}
                  onChange={(event) =>
                    setNewAsset((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/80 outline-none focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/30"
                  placeholder="Asset name"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-wide text-white/50">
                    Type
                  </label>
                  <select
                    value={newAsset.type}
                    onChange={(event) =>
                      setNewAsset((prev) => ({
                        ...prev,
                        type: event.target.value as Asset["type"],
                      }))
                    }
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/80 outline-none focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/30"
                  >
                    <option value="Prompt">Prompt</option>
                    <option value="Workflow">Workflow</option>
                    <option value="Persona">Persona</option>
                    <option value="Template">Template</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-wide text-white/50">
                    Service Focus
                  </label>
                  <select
                    value={newAsset.focus}
                    onChange={(event) =>
                      setNewAsset((prev) => ({
                        ...prev,
                        focus: event.target.value,
                      }))
                    }
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/80 outline-none focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/30"
                  >
                    {services.map((service) => (
                      <option key={service.id} value={service.name}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wide text-white/50">
                  Refresh Cadence
                </label>
                <select
                  value={newAsset.freshness}
                  onChange={(event) =>
                    setNewAsset((prev) => ({
                      ...prev,
                      freshness: event.target.value as Asset["freshness"],
                    }))
                  }
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/80 outline-none focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/30"
                >
                  <option value="Evergreen">Evergreen</option>
                  <option value="Review">Review</option>
                  <option value="Retire">Retire</option>
                </select>
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-violet-500/40 bg-violet-500/30 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-[1px] hover:border-violet-400/80 hover:bg-violet-500/40"
              >
                <Plus className="h-4 w-4" />
                Capture Asset
              </button>
            </form>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/[0.08] p-6 backdrop-blur-xl">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Launch Timeline</h2>
                <p className="text-sm text-white/60">
                  Visualize the next ten-day choreography.
                </p>
              </div>
              <Paintbrush className="h-5 w-5 text-white/60" />
            </header>
            <div className="mt-5 space-y-4">
              {[
                {
                  date: "Mar 05",
                  label: "Neon Quill launch rehearsal & client review",
                  type: "Brand Persona Kits",
                },
                {
                  date: "Mar 06",
                  label: "Finance copilot architecture freeze & QA",
                  type: "Custom AI Engines",
                },
                {
                  date: "Mar 08",
                  label: "Subscription Pro tier onboarding drip go-live",
                  type: "Subscription Access",
                },
                {
                  date: "Mar 10",
                  label: "VegaOps automation report + Loom walkthrough",
                  type: "Workflow Audits",
                },
              ].map((event) => (
                <div
                  key={event.label}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4"
                >
                  <div className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/30 via-purple-500/20 to-transparent text-sm font-semibold text-white">
                    {event.date.split(" ")[0]}
                    <span className="text-[10px] uppercase tracking-wide text-white/70">
                      {event.date.split(" ")[1]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/90">
                      {event.label}
                    </p>
                    <p className="text-xs uppercase tracking-wide text-white/50">
                      {event.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/[0.08] p-6 backdrop-blur-xl">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Creative Lab Queue</h2>
                <p className="text-sm text-white/60">
                  Prototype upcoming assets, campaigns, and experiments.
                </p>
              </div>
              <Sparkles className="h-5 w-5 text-white/60" />
            </header>
            <div className="mt-5 space-y-4">
              {[
                {
                  title: "AI Engine Demo Reel",
                  detail:
                    "Narrative-driven product trailer pairing human + agent collaboration examples.",
                  status: "In Concept",
                },
                {
                  title: "Prompt Architecture Field Guide",
                  detail:
                    "Design modular prompt recipes for enterprise ops teams, printable PDF + Notion kit.",
                  status: "Drafting",
                },
                {
                  title: "Brand Persona Field Test",
                  detail:
                    "Capture client results in 72h challenge, collect testimonials & metrics.",
                  status: "Scoping",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white/90">
                      {item.title}
                    </h3>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-wide text-white/60">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-white/60">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}

function MetricPill({
  title,
  value,
  detail,
  icon,
}: {
  title: string;
  value: string;
  detail: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/40">
        {icon}
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-[11px] uppercase tracking-wide text-white/50">
          {title}
        </span>
        <span className="text-base font-semibold text-white/90">{value}</span>
        <span className="text-[11px] text-white/50">{detail}</span>
      </div>
    </div>
  );
}
