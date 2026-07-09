import { useState } from "react";
import { Search, Ticket, Users, Layers, LayoutGrid, CheckCircle2, RefreshCw, CalendarDays, ArrowLeftRight } from "lucide-react";
import type { ScheduledArrival, IssuedTokenSummary } from "../types";
import { STATION_NAME } from "../data";

interface MroDashboardProps {
  arrivals: ScheduledArrival[];
  summaries: IssuedTokenSummary[];
  onIssueToken: (arrival: ScheduledArrival) => void;
  isIssuing: string | null;
}

export default function MroDashboard({ arrivals, summaries, onIssueToken, isIssuing }: MroDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const filteredArrivals = arrivals.filter((arr) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      arr.patientName.toLowerCase().includes(q) ||
      arr.assignedDoctor.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm medical-shadow sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-950/70">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block size-2 rounded-full bg-indigo-600 animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
              MRO RECEPTION STATION
            </p>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 mt-1 dark:text-white">
            MRO Desk Workspace
          </h1>
          <p className="text-xs text-slate-500 mt-1 dark:text-zinc-400">
            Current Desk: <b>{STATION_NAME}</b> • Direct verification & token dispatch line
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-right dark:border-zinc-800 dark:bg-zinc-900">
            <span className="text-xxs text-slate-400 uppercase tracking-widest block dark:text-zinc-500 font-medium">TODAY'S SHIFT</span>
            <span className="text-sm font-bold text-slate-800 dark:text-zinc-200">{currentDate}</span>
          </div>
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm medical-shadow flex items-center gap-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-blue-950/30 dark:text-blue-400">
            <Users className="size-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Scheduled Arrivals Today</span>
            <p className="text-2xl font-black text-slate-800 mt-0.5 dark:text-white">{arrivals.length}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm medical-shadow flex items-center gap-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
            <Ticket className="size-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Active Issued Tokens</span>
            <p className="text-2xl font-black text-slate-800 mt-0.5 dark:text-white">
              {summaries.reduce((acc, curr) => acc + curr.waitingCount, 0)}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm medical-shadow flex items-center gap-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="rounded-xl bg-purple-50 p-3 text-purple-600 dark:bg-teal-950/30 dark:text-teal-400">
            <Layers className="size-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Active Doctors On-Duty</span>
            <p className="text-2xl font-black text-slate-800 mt-0.5 dark:text-white">{summaries.length}</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Arrivals on Left, Doctor Token Summary on Right */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        
        {/* Scheduled Arrivals Column */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm medical-shadow overflow-hidden dark:border-zinc-800 dark:bg-zinc-950">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 dark:border-zinc-800">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Outpatient Booking Feed</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Real-time scheduled patient arrivals waiting for clinical physical check-in</p>
            </div>
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-450" />
              <input
                type="text"
                placeholder="Search patient or doctor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-xs focus:bg-white focus:outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:bg-zinc-950"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredArrivals.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-xxs font-bold uppercase tracking-wider text-slate-500 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
                    <th className="py-3 px-6">Patient Name</th>
                    <th className="py-3 px-4">Scheduled Slot</th>
                    <th className="py-3 px-4">Assigned Doctor</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {filteredArrivals.map((arrival) => (
                    <tr
                      key={arrival.id}
                      className="hover:bg-slate-50/50 transition dark:hover:bg-zinc-900/10"
                    >
                      <td className="py-4 px-6 font-bold text-slate-800 dark:text-zinc-200">
                        {arrival.patientName}
                      </td>
                      <td className="py-4 px-4 text-xs font-mono text-slate-600 dark:text-zinc-400">
                        <span className="bg-slate-100 dark:bg-zinc-900 px-2.5 py-1 rounded-md">
                          {arrival.scheduledSlot}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs font-medium text-slate-700 dark:text-zinc-300">
                        {arrival.assignedDoctor}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-2xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-100/30">
                          <CheckCircle2 className="size-3" />
                          Cloud Paid
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => onIssueToken(arrival)}
                          disabled={isIssuing !== null}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white transition py-2 px-3.5 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {isIssuing === arrival.id ? (
                            <>
                              <RefreshCw className="size-3 animate-spin" />
                              Issuing...
                            </>
                          ) : (
                            <>
                              <Ticket className="size-3" />
                              Issue Token
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center text-slate-500 space-y-2 dark:text-zinc-400">
                <p className="text-sm font-semibold">No patient arrivals match criteria</p>
                <p className="text-xs">Patients will appear here once they complete their payment online.</p>
              </div>
            )}
          </div>
        </div>

        {/* Live Counters Column */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm medical-shadow dark:border-zinc-800 dark:bg-zinc-950">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Active Queue Counters</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Real-time load balancing stats of verified queues</p>
            </div>
            
            <div className="mt-5 space-y-4">
              {summaries.map((summary) => (
                <div
                  key={summary.doctorName}
                  className="rounded-xl border border-slate-150 p-4 bg-slate-50/50 flex flex-col gap-3.5 dark:border-zinc-800 dark:bg-zinc-900/20"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block dark:text-zinc-200">{summary.doctorName}</span>
                      <span className="text-xxs text-slate-400 mt-0.5 uppercase dark:text-zinc-500 font-medium">
                        {summary.doctorName.includes("Anand") ? "Cabin Room 2" : "Cabin Room 3"}
                      </span>
                    </div>
                    <span className="size-3.5 rounded-full bg-emerald-500 animate-pulse block" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-slate-100 dark:border-zinc-800">
                    <div className="bg-white rounded-xl py-2 px-1 border border-slate-100 dark:bg-zinc-900 dark:border-zinc-800">
                      <span className="text-xxs text-slate-400 block uppercase dark:text-zinc-500 font-medium">Last Token Call</span>
                      <span className="text-xl font-black text-indigo-600 block mt-0.5 dark:text-indigo-400">
                        {summary.activeToken > 0 ? `#${summary.activeToken}` : "None"}
                      </span>
                    </div>
                    <div className="bg-white rounded-xl py-2 px-1 border border-slate-100 dark:bg-zinc-900 dark:border-zinc-800">
                      <span className="text-xxs text-slate-400 block uppercase dark:text-zinc-500 font-medium">Waiting List</span>
                      <span className="text-xl font-black text-slate-800 block mt-0.5 dark:text-white">
                        {summary.waitingCount} Patients
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center space-y-2 dark:border-zinc-800">
            <LayoutGrid className="size-6 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-800 dark:text-zinc-300">TV Display Auto-Pushes</p>
            <p className="text-xxs text-slate-500 leading-normal dark:text-zinc-400">
              Issuing a token instantly increments the queue atomic counter and broadcasts updates to the public TV Display screen over WebSocket.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
