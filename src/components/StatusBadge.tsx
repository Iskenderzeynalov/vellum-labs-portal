import clsx from "clsx";

type Status =
  | "Active"
  | "On Track"
  | "At Risk"
  | "Paused"
  | "Completed"
  | "In Progress"
  | "Awaiting Client"
  | "Pending"
  | "Paid"
  | "Due"
  | "Overdue"
  | "Draft"
  | string;

const statusConfig: Record<string, { dot: string; text: string; bg: string }> =
  {
    "On Track": {
      dot: "bg-emerald-400",
      text: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    Active: {
      dot: "bg-emerald-400",
      text: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    Completed: {
      dot: "bg-zinc-400",
      text: "text-zinc-400",
      bg: "bg-zinc-400/10",
    },
    Paid: {
      dot: "bg-emerald-400",
      text: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    "In Progress": {
      dot: "bg-blue-400",
      text: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    "Awaiting Client": {
      dot: "bg-amber-400",
      text: "text-amber-400",
      bg: "bg-amber-400/10",
    },
    Pending: {
      dot: "bg-zinc-500",
      text: "text-zinc-400",
      bg: "bg-zinc-500/10",
    },
    Due: {
      dot: "bg-amber-400",
      text: "text-amber-400",
      bg: "bg-amber-400/10",
    },
    Overdue: {
      dot: "bg-red-400",
      text: "text-red-400",
      bg: "bg-red-400/10",
    },
    "At Risk": {
      dot: "bg-red-400",
      text: "text-red-400",
      bg: "bg-red-400/10",
    },
    Paused: {
      dot: "bg-zinc-500",
      text: "text-zinc-400",
      bg: "bg-zinc-500/10",
    },
    Draft: {
      dot: "bg-zinc-500",
      text: "text-zinc-400",
      bg: "bg-zinc-500/10",
    },
  };

const priorityConfig: Record<
  string,
  { text: string; bg: string; border: string }
> = {
  High: {
    text: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
  },
  Medium: {
    text: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
  },
  Low: {
    text: "text-zinc-400",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/20",
  },
};

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status] ?? {
    dot: "bg-zinc-500",
    text: "text-zinc-400",
    bg: "bg-zinc-500/10",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        config.bg,
        config.text
      )}
    >
      <span className={clsx("w-1.5 h-1.5 rounded-full", config.dot)} />
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const config = priorityConfig[priority] ?? {
    text: "text-zinc-400",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/20",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
        config.bg,
        config.text,
        config.border
      )}
    >
      {priority}
    </span>
  );
}

export function TypeBadge({ type }: { type: string }) {
  const isClient = type === "Client";
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
        isClient
          ? "bg-violet-400/10 text-violet-400 border-violet-400/20"
          : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
      )}
    >
      {isClient ? "Your task" : "Vellum"}
    </span>
  );
}
