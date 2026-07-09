import { useState, useEffect } from "react";
import { User, ClipboardList, Activity, Monitor, ShieldCheck, HelpCircle, ActivityIcon } from "lucide-react";
import type { ScheduledArrival, IssuedTokenSummary, TvQueueState, ActivePatient, DoctorProfile, TvUpNextItem } from "./types";
import { 
  INITIAL_ARRIVALS, 
  INITIAL_TOKEN_SUMMARY, 
  INITIAL_TV_STATE, 
  DOCTOR_PROFILES,
  ACTIVE_PATIENT
} from "./data";

import PatientPortal from "./components/PatientPortal";
import MroDashboard from "./components/MroDashboard";
import DoctorDashboard from "./components/DoctorDashboard";
import TvDisplay from "./components/TvDisplay";

type ViewRole = "patient" | "mro" | "doctor" | "tv";

export default function App() {
  const [currentRole, setCurrentRole] = useState<ViewRole>("mro");
  
  // Simulated Central Database State
  const [arrivals, setArrivals] = useState<ScheduledArrival[]>(INITIAL_ARRIVALS);
  const [summaries, setSummaries] = useState<IssuedTokenSummary[]>(INITIAL_TOKEN_SUMMARY);
  const [tvState, setTvState] = useState<TvQueueState>(INITIAL_TV_STATE);
  
  // State for active doctor in Doctor Suite
  const [activeDoctor, setActiveDoctor] = useState<DoctorProfile>(DOCTOR_PROFILES[0]);
  
  // We can track the current active patient for each doctor
  const [activePatientDoc1, setActivePatientDoc1] = useState<ActivePatient | null>(ACTIVE_PATIENT);
  const [activePatientDoc2, setActivePatientDoc2] = useState<ActivePatient | null>({
    token: 2,
    name: "Rahul Mishra",
    slot: "11:45 AM",
    historyAlert: "Patient has no recorded chronic conditions."
  });

  // Atomic token numbers incrementing
  const [lastAssignedToken, setLastAssignedToken] = useState(11);
  const [flashTrigger, setFlashTrigger] = useState(0);
  const [isIssuing, setIsIssuing] = useState<string | null>(null);
  const [isCalling, setIsCalling] = useState(false);

  // Helper to get initials
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length > 1) {
      return `${parts[0]} ${parts[parts.length - 1][0]}.`;
    }
    return name;
  };

  // 1. Patient Books Appointment
  const handleAddArrival = (newArrival: ScheduledArrival) => {
    setArrivals((prev) => [...prev, newArrival]);
  };

  // 2. MRO Desk Verifies & Issues Token Ticket
  const handleIssueToken = (arrival: ScheduledArrival) => {
    setIsIssuing(arrival.id);
    
    setTimeout(() => {
      // 1. Remove from scheduled arrivals
      setArrivals((prev) => prev.filter((item) => item.id !== arrival.id));
      
      // 2. Generate new atomic token
      const newToken = lastAssignedToken + 1;
      setLastAssignedToken(newToken);
      
      // 3. Add to TV Up Next queue
      const upNextItem: TvUpNextItem = {
        token: newToken,
        patientInitials: getInitials(arrival.patientName)
      };
      setTvState((prev) => ({
        ...prev,
        upNext: [...prev.upNext, upNextItem]
      }));

      // 4. Update the doctor's waiting count in the summary card
      setSummaries((prev) =>
        prev.map((sum) => {
          if (sum.doctorName === arrival.assignedDoctor) {
            return {
              ...sum,
              waitingCount: sum.waitingCount + 1
            };
          }
          return sum;
        })
      );
      
      setIsIssuing(null);
    }, 1000);
  };

  // 3. Doctor Cabin Calls Next Patient
  const handleCallNextPatient = () => {
    if (tvState.upNext.length === 0) return;
    
    setIsCalling(true);
    
    setTimeout(() => {
      // Pull oldest patient from the waiting list
      const nextInLine = tvState.upNext[0];
      const remainingQueue = tvState.upNext.slice(1);

      // Create patient context
      const newActivePatient: ActivePatient = {
        token: nextInLine.token,
        name: nextInLine.patientInitials.includes("Rahul") ? "Rahul Mishra" : nextInLine.patientInitials.includes("Suresh") ? "Suresh Kumar" : nextInLine.patientInitials.includes("Priya") ? "Priya Sharma" : nextInLine.patientInitials.includes("Vikram") ? "Vikram Rao" : nextInLine.patientInitials.includes("Amit") ? "Amit Kumar" : "General Patient",
        slot: "Immediate Queue Walk-in",
        historyAlert: nextInLine.patientInitials.includes("Rahul") 
          ? "Patient has no recorded chronic conditions." 
          : nextInLine.patientInitials.includes("Suresh")
          ? "Patient has a history of Mild Hypertension."
          : "Patient has a record of Mild Chronic Kidney Disease - Feb 2026"
      };

      // Set active patient for the currently logged in doctor
      if (activeDoctor.id === "doc-001") {
        setActivePatientDoc1(newActivePatient);
      } else {
        setActivePatientDoc2(newActivePatient);
      }

      // Update TV Screen
      setTvState({
        nowServing: {
          token: nextInLine.token,
          cabin: activeDoctor.cabin,
          doctor: activeDoctor.name.split(" ")[1].toUpperCase() // "ANAND" or "SARAH"
        },
        upNext: remainingQueue
      });

      // Update summaries
      setSummaries((prev) =>
        prev.map((sum) => {
          if (sum.doctorName === activeDoctor.name) {
            return {
              ...sum,
              activeToken: nextInLine.token,
              waitingCount: Math.max(0, sum.waitingCount - 1)
            };
          }
          return sum;
        })
      );

      setFlashTrigger((prev) => prev + 1);
      setIsCalling(false);
    }, 800);
  };

  const getActivePatientForSelectedDoctor = () => {
    return activeDoctor.id === "doc-001" ? activePatientDoc1 : activePatientDoc2;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col font-sans">
      
      {/* Top Perspectives/Role Selector bar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-600 p-2.5 text-white shadow-md">
            <ActivityIcon className="size-5" />
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-850 tracking-widest font-sans uppercase">
              METAI CLINICAL PORTAL
            </h1>
            <span className="text-3xs text-slate-500 font-mono tracking-wider block mt-0.5 font-semibold">INTEGRATED HEALTHCARE SYSTEMS</span>
          </div>
        </div>

        {/* Navigator buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60 flex-wrap">
          <button
            onClick={() => setCurrentRole("patient")}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xxs font-bold rounded-lg transition cursor-pointer ${
              currentRole === "patient"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-950 hover:bg-slate-200/50"
            }`}
          >
            <User className="size-3.5" />
            Patient App
          </button>
          
          <button
            onClick={() => setCurrentRole("mro")}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xxs font-bold rounded-lg transition cursor-pointer ${
              currentRole === "mro"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-950 hover:bg-slate-200/50"
            }`}
          >
            <ClipboardList className="size-3.5" />
            MRO Front Desk
          </button>
          
          <button
            onClick={() => setCurrentRole("doctor")}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xxs font-bold rounded-lg transition cursor-pointer ${
              currentRole === "doctor"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-950 hover:bg-slate-200/50"
            }`}
          >
            <Activity className="size-3.5" />
            Doctor Cabin
          </button>
          
          <button
            onClick={() => setCurrentRole("tv")}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xxs font-bold rounded-lg transition cursor-pointer ${
              currentRole === "tv"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-950 hover:bg-slate-200/50"
            }`}
          >
            <Monitor className="size-3.5" />
            Public Smart TV
          </button>
        </div>

        {/* Integration indicators */}
        <div className="hidden xl:flex items-center gap-4 text-slate-500 text-xxs font-semibold">
          <span className="flex items-center gap-1.5"><ShieldCheck className="size-4 text-indigo-600" /> Server-side Gemini Live</span>
          <span className="flex items-center gap-1.5"><Monitor className="size-4 text-indigo-600" /> HTML5 TTS Audio on TV</span>
        </div>
      </nav>

      {/* Main Workspace Frame */}
      <main className="flex-1 mx-auto w-full max-w-7xl p-6">
        
        {/* Patient Portal */}
        {currentRole === "patient" && (
          <div className="flex flex-col items-center justify-center py-6">
            <PatientPortal 
              onAddArrival={handleAddArrival} 
              arrivals={arrivals}
            />
          </div>
        )}

        {/* MRO Dashboard */}
        {currentRole === "mro" && (
          <MroDashboard 
            arrivals={arrivals}
            summaries={summaries}
            onIssueToken={handleIssueToken}
            isIssuing={isIssuing}
          />
        )}

        {/* Doctor Dashboard */}
        {currentRole === "doctor" && (
          <DoctorDashboard 
            activeDoctor={activeDoctor}
            onChangeDoctor={setActiveDoctor}
            activePatient={getActivePatientForSelectedDoctor()}
            upNext={tvState.upNext}
            onCallNextPatient={handleCallNextPatient}
            isCalling={isCalling}
          />
        )}

        {/* TV Waiting Display */}
        {currentRole === "tv" && (
          <div className="max-w-5xl mx-auto py-4">
            <TvDisplay 
              queueState={tvState} 
              flashTrigger={flashTrigger}
            />
          </div>
        )}

      </main>

      {/* Persistent helper tooltip for AI Studio Sandbox */}
      <div className="bg-white border-t border-slate-200 py-4 px-6 text-center text-3xs text-slate-500 flex flex-col md:flex-row md:items-center justify-between gap-2 dark:bg-zinc-950 dark:border-zinc-900 select-none">
        <span className="flex items-center justify-center gap-1.5 font-semibold mx-auto md:mx-0">
          <HelpCircle className="size-3.5 text-indigo-600" />
          💡 <b>Interactive Workspace Guide:</b> Try booking a patient in the Patient App, then switch roles to MRO, Doctor, or Smart TV to see the queue flow in real-time!
        </span>
        <span className="font-mono text-slate-400">Environment: AI Studio Build Container • Port 3000 Ingress</span>
      </div>

    </div>
  );
}
