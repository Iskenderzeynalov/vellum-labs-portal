import { Video, CheckSquare, ArrowRight, Calendar } from "lucide-react";
import { PageHeader } from "../components/Card";
import { useData } from "../hooks/useData";
import type { ApiMeeting } from "../types";

export function Meetings() {
  const { data: meetings, loading, error } = useData<ApiMeeting[]>("/api/meetings");

  return (
    <div className="space-y-6">
      <PageHeader title="Meetings" subtitle="Summaries, decisions, and action items from your sessions." />

      {loading && (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-64 rounded-xl border border-zinc-800 bg-zinc-900 animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4">
          <p className="text-sm text-red-400">Failed to load meetings: {error}</p>
        </div>
      )}

      {!loading && !error && (!meetings || meetings.length === 0) && (
        <div className="py-12 text-center text-zinc-500 text-sm">No meeting notes yet.</div>
      )}

      {!loading && !error && meetings && meetings.length > 0 && (
        <div className="space-y-4">
          {meetings.map((meeting) => <MeetingCard key={meeting.id} meeting={meeting} />)}
        </div>
      )}
    </div>
  );
}

function MeetingCard({ meeting }: { meeting: ApiMeeting }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      <div className="flex items-start justify-between p-5 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-zinc-500" />
            <span className="text-xs text-zinc-500">
              {meeting.date ? formatDate(meeting.date) : ""}
            </span>
          </div>
          <h2 className="text-base font-semibold text-zinc-100">{meeting.title}</h2>
        </div>
        {meeting.recordingLink && (
          <a
            href={meeting.recordingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 px-3 py-1.5 rounded-lg border border-violet-500/20 hover:bg-violet-500/10 transition-all shrink-0 ml-4"
          >
            <Video className="w-3 h-3" /> Recording
          </a>
        )}
      </div>
      <div className="p-5 space-y-4">
        {meeting.summary && (
          <Section label="Summary" icon={null} text={meeting.summary} />
        )}
        {meeting.decisions && (
          <SectionBox label="Decisions Made" text={meeting.decisions} color="zinc" />
        )}
        {meeting.actionItems && (
          <SectionBox
            label="Action Items"
            text={meeting.actionItems}
            color="amber"
            icon={<CheckSquare className="w-3.5 h-3.5 text-amber-400" />}
          />
        )}
        {meeting.nextSteps && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Next Steps</p>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">{meeting.nextSteps}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ label, icon, text }: { label: string; icon: React.ReactNode; text: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <p className="text-xs text-zinc-500 uppercase tracking-wider">{label}</p>
      </div>
      <p className="text-sm text-zinc-300 leading-relaxed">{text}</p>
    </div>
  );
}

function SectionBox({
  label, text, color, icon,
}: {
  label: string; text: string; color: "zinc" | "amber"; icon?: React.ReactNode;
}) {
  const bg = color === "amber" ? "bg-amber-400/5 border-amber-400/15" : "bg-zinc-800/50 border-zinc-700/50";
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <p className="text-xs text-zinc-500 uppercase tracking-wider">{label}</p>
      </div>
      <div className={"rounded-lg border p-3 " + bg}>
        <p className="text-sm text-zinc-300 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}
