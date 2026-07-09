import { useEffect, useState, useRef } from "react";
import { Volume2, Monitor, Tv, Wifi, Clock } from "lucide-react";
import type { TvQueueState } from "../types";

interface TvDisplayProps {
  queueState: TvQueueState;
  flashTrigger: number;
}

export default function TvDisplay({ queueState, flashTrigger }: TvDisplayProps) {
  const [time, setTime] = useState("");
  const [isFlashing, setIsFlashing] = useState(false);
  const previousTokenRef = useRef<number | null>(null);

  // Clock ticking
  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Flashing & Vocal text-to-speech trigger on Now Serving changes
  useEffect(() => {
    if (flashTrigger > 0 && queueState.nowServing.token > 0) {
      setIsFlashing(true);
      const timer = setTimeout(() => setIsFlashing(false), 3500);

      // Trigger standard browser HTML5 text-to-speech announcement
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel(); // Cancel any ongoing speech
        
        const text = `Token ${queueState.nowServing.token}. Please proceed to ${queueState.nowServing.cabin.toLowerCase()}. Doctor ${queueState.nowServing.doctor.toLowerCase()}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95; // Slightly slower for clear hospital announcement feel
        utterance.pitch = 1.05;
        utterance.lang = "en-IN"; // English with Indian accent for local feel
        
        // Find suitable voice if possible
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.includes("IN") || v.lang.includes("GB") || v.name.toLowerCase().includes("google"));
        if (preferredVoice) utterance.voice = preferredVoice;

        window.speechSynthesis.speak(utterance);
      }

      return () => clearTimeout(timer);
    }
  }, [flashTrigger, queueState.nowServing]);

  const nowServing = queueState.nowServing;
  const upNext = queueState.upNext || [];

  return (
    <div className="flex min-h-[580px] flex-col rounded-3xl overflow-hidden bg-zinc-950 text-zinc-100 font-sans shadow-2xl border border-zinc-900 select-none">
      {/* Smart TV Header */}
      <header className="flex items-center justify-between border-b border-zinc-900 bg-zinc-900/50 px-8 py-5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="rounded bg-indigo-500/10 p-1.5 text-indigo-400">
            <Tv className="size-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-widest text-indigo-400 uppercase font-mono">
              METAI CLINIC AND HOSPITALS
            </h1>
            <span className="text-3xs text-zinc-500 block uppercase font-semibold">Waiting Room Main TV Board</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-3xs uppercase tracking-widest text-zinc-500 font-bold font-mono">
              Live WebSocket Sync
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-bold text-zinc-300">
            <Clock className="size-4 text-zinc-500" />
            <span>{time}</span>
          </div>
        </div>
      </header>

      {/* Main Grid content */}
      <main className="grid flex-1 gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr]">
        
        {/* Left Side: Now Serving */}
        <section className="flex flex-col gap-3">
          <div className="text-xxs font-bold uppercase tracking-widest text-zinc-400">
            CURRENT CONSULTATION CALL
          </div>

          <div className={`relative flex flex-1 flex-col items-center justify-center rounded-2xl border transition-all duration-500 min-h-[350px] ${
            isFlashing
              ? "border-indigo-500 bg-indigo-950/25 shadow-[0_0_60px_rgba(99,102,241,0.18)] scale-[1.01]"
              : "border-zinc-900 bg-zinc-900/20"
          }`}>
            {isFlashing && (
              <div className="absolute inset-0 animate-pulse rounded-2xl border-2 border-indigo-500/35 opacity-40 pointer-events-none" />
            )}

            {nowServing.token > 0 ? (
              <div className="flex flex-col items-center gap-4 text-center">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-indigo-400">
                  <Volume2 className="size-4 animate-bounce" />
                  Please Proceed
                </span>

                <h2 className={`text-9xl font-black tracking-tighter sm:text-9xl md:text-9xl transition-all duration-300 ${
                  isFlashing ? "text-indigo-450 scale-105" : "text-white"
                }`}>
                  #{nowServing.token}
                </h2>

                <div className="mt-4 space-y-1">
                  <div className="text-3xl font-black tracking-tight text-white uppercase font-mono font-sans">
                    {nowServing.cabin}
                  </div>
                  <div className="text-xs tracking-[0.2em] text-zinc-500 font-bold uppercase">
                    {nowServing.doctor}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center font-bold text-zinc-500 space-y-2">
                <Wifi className="size-8 mx-auto text-zinc-600 animate-pulse" />
                <p className="text-sm">Please stand by...</p>
                <p className="text-xxs text-zinc-600">The counter receptionist or doctors will dispatch new calls shortly.</p>
              </div>
            )}
          </div>
        </section>

        {/* Right Side: Up Next */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xxs font-bold uppercase tracking-widest text-zinc-400">
              QUEUE UP NEXT
            </span>
            <span className="rounded-full bg-zinc-900 px-2.5 py-0.5 text-3xs text-zinc-500 font-bold border border-zinc-800 uppercase tracking-wider font-mono">
              {upNext.length} Waiting List
            </span>
          </div>

          <div className="flex flex-1 flex-col rounded-2xl border border-zinc-900 bg-zinc-900/10 p-5 overflow-hidden">
            <div className="grid grid-cols-2 gap-3 auto-rows-max overflow-y-auto max-h-[350px] pr-1">
              {upNext.length > 0 ? (
                upNext.map((item, idx) => (
                  <div
                    key={`${item.token}-${idx}`}
                    className="flex flex-col justify-between items-center rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 transition-all duration-200 hover:border-zinc-700/50"
                  >
                    <span className="text-2xl font-black text-white font-mono">
                      #{item.token}
                    </span>
                    <span className="mt-1 text-3xs font-bold uppercase tracking-wider text-zinc-500 font-mono">
                      {item.patientInitials}
                    </span>
                  </div>
                ))
              ) : (
                <div className="col-span-2 flex flex-col items-center justify-center gap-2 py-16 text-zinc-600">
                  <span className="text-3xs font-bold uppercase tracking-widest">
                    No Pending Queue List
                  </span>
                </div>
              )}
            </div>

            <div className="mt-auto pt-4 border-t border-zinc-900 text-center text-xxs text-zinc-600 tracking-wider">
              Token status updates instantly in real-time
            </div>
          </div>
        </section>

      </main>

      {/* Bottom Footer Info */}
      <footer className="border-t border-zinc-900 bg-zinc-950 px-8 py-4 text-center text-xxs text-zinc-500 flex justify-between">
        <span>Powered by Antigravity Hospital SaaS</span>
        <span>For check-in assistance, consult Station Reception Desk 1</span>
      </footer>
    </div>
  );
}
