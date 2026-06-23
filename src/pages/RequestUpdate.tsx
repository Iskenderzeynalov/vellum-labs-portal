import { useState } from "react";
import { Send, CheckCircle, Clock } from "lucide-react";
import { Card, PageHeader } from "../components/Card";

type FormState = "idle" | "loading" | "success" | "error";

export function RequestUpdate() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setFormState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: subject.trim(), message: message.trim() }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `Request failed (HTTP ${res.status})`);
      }

      setFormState("success");
      setSubject("");
      setMessage("");
    } catch (err) {
      setFormState("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again or email us directly."
      );
    }
  };

  if (formState === "success") {
    return (
      <div className="space-y-6">
        <PageHeader title="Request Update" />
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
          <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-zinc-100 mb-2">Message Sent</h2>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            Your message has been sent to the Vellum Labs team. We'll get back to you within 1 business day.
          </p>
          <button
            onClick={() => setFormState("idle")}
            className="mt-6 text-sm text-violet-400 hover:text-violet-300 transition-colors"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Request Update"
        subtitle="Send a message to the Vellum Labs team. We'll respond within 1 business day."
      />

      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <Clock className="w-3.5 h-3.5" />
        <span>Typical response time: within 1 business day</span>
      </div>

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="subject" className="block text-xs font-medium text-zinc-400 mb-1.5">
              Subject <span className="text-zinc-600">(optional)</span>
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Question about last week's results"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-xs font-medium text-zinc-400 mb-1.5">
              Message <span className="text-red-400">*</span>
            </label>
            <textarea
              id="message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What would you like to know or discuss? Be as specific as possible so we can help you quickly."
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors resize-none"
            />
          </div>

          {formState === "error" && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
              <p className="text-sm text-red-400">{errorMsg}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={formState === "loading" || !message.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white disabled:text-zinc-400 rounded-lg text-sm font-medium transition-all"
          >
            {formState === "loading" ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Message
              </>
            )}
          </button>
        </form>
      </Card>

      <div className="max-w-2xl">
        <p className="text-xs text-zinc-500">
          Prefer email?{" "}
          <a href="mailto:hello@vellumlabs.com" className="text-violet-400 hover:text-violet-300 transition-colors">
            hello@vellumlabs.com
          </a>
        </p>
      </div>
    </div>
  );
}
