import { useState, useEffect, FormEvent } from "react";
import { Clock, Calendar, CheckCircle, ShieldAlert, CreditCard, Sparkles, User, RefreshCw, Smartphone } from "lucide-react";
import type { ScheduledArrival, DoctorProfile } from "../types";
import { DOCTOR_PROFILES } from "../data";

interface PatientPortalProps {
  onAddArrival: (arrival: ScheduledArrival) => void;
  arrivals: ScheduledArrival[];
}

export default function PatientPortal({ onAddArrival, arrivals }: PatientPortalProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile>(DOCTOR_PROFILES[0]);
  const [patientName, setPatientName] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookingStep, setBookingStep] = useState<"details" | "payment" | "confirmed">("details");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isVerifying, setIsVerifying] = useState(false);
  const [confirmedToken, setConfirmedToken] = useState<number | null>(null);

  // Available timeslots
  const timeSlots = [
    "11:30 AM", "11:45 AM", "12:00 PM", "12:15 PM", "12:30 PM", "12:45 PM", "01:00 PM"
  ];

  // Lock timer countdown
  useEffect(() => {
    if (bookingStep !== "payment") return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setBookingStep("details");
          return 600;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [bookingStep]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartBooking = (e: FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;
    if (!selectedSlot) return;
    setTimeLeft(600);
    setBookingStep("payment");
  };

  const handleSimulatePayment = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setBookingStep("confirmed");
      
      const newArrival: ScheduledArrival = {
        id: `pat-${Date.now()}`,
        patientName: patientName.trim(),
        scheduledSlot: selectedSlot,
        assignedDoctor: selectedDoctor.name,
        paymentStatus: "PAID via Cloud"
      };
      
      onAddArrival(newArrival);
    }, 1500);
  };

  const handleReset = () => {
    setPatientName("");
    setSelectedSlot("");
    setBookingStep("details");
  };

  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl medical-shadow dark:border-zinc-800 dark:bg-zinc-950">
      {/* Mobile Device Mockup Header */}
      <div className="bg-slate-900 px-6 py-4 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Smartphone className="size-4 text-indigo-400" />
          <span className="text-xs font-mono text-slate-300">PATIENT BOOKING APP</span>
        </div>
        <div className="h-4 w-12 rounded-full bg-slate-800" /> {/* Speaker bar */}
        <div className="text-xs font-mono text-slate-400">5G • 100%</div>
      </div>

      <div className="p-6">
        {bookingStep === "details" && (
          <form onSubmit={handleStartBooking} className="space-y-5">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">Book Appointment</h2>
              <p className="text-xs text-slate-500 mt-1 dark:text-zinc-400">Explore specialists and secure your outpatient slot instantly</p>
            </div>

            {/* Doctor Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider dark:text-zinc-400">Select Doctor</label>
              <div className="grid grid-cols-2 gap-3">
                {DOCTOR_PROFILES.map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setSelectedDoctor(doc)}
                    className={`flex flex-col items-start rounded-2xl border p-3.5 text-left transition ${
                      selectedDoctor.id === doc.id
                        ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20"
                        : "border-slate-200 hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                    }`}
                  >
                    <User className={`size-4 mb-2 ${selectedDoctor.id === doc.id ? "text-indigo-600" : "text-slate-400"}`} />
                    <span className="text-sm font-bold block truncate w-full text-slate-800 dark:text-zinc-200">{doc.name}</span>
                    <span className="text-xxs text-slate-400 mt-1 uppercase dark:text-zinc-500">{doc.cabin}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Patient Name Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider dark:text-zinc-400">Patient Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Mishra"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
              />
            </div>

            {/* Slot Picker */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider dark:text-zinc-400">Choose Available Slot</label>
              <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
                {timeSlots.map((slot) => {
                  const isBooked = arrivals.some(
                    (arr) => arr.scheduledSlot === slot && arr.assignedDoctor === selectedDoctor.name
                  );
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isBooked}
                      onClick={() => setSelectedSlot(slot)}
                      className={`rounded-xl py-2 px-1 text-center text-xs font-medium transition ${
                        isBooked
                          ? "bg-slate-100 text-slate-300 line-through dark:bg-zinc-900 dark:text-zinc-600 cursor-not-allowed"
                          : selectedSlot === slot
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "border border-slate-200 hover:border-slate-300 text-slate-700 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price block */}
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 flex justify-between items-center dark:bg-zinc-900/50 dark:border-zinc-800">
              <div>
                <span className="text-xs text-slate-400 block dark:text-zinc-500">Consultation Fee</span>
                <span className="text-lg font-bold text-slate-800 dark:text-white">₹500.00</span>
              </div>
              <span className="text-xxs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full uppercase tracking-wider dark:bg-emerald-950/40 dark:text-emerald-300">
                100% Secure
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!patientName.trim() || !selectedSlot}
              className="w-full rounded-2xl bg-indigo-600 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 shadow-lg shadow-indigo-600/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Continue to Payment
            </button>
          </form>
        )}

        {bookingStep === "payment" && (
          <div className="space-y-5 text-center">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">Scan UPI QR to Pay</h2>
              <p className="text-xs text-slate-500 mt-1 dark:text-zinc-400">Complete payment to finalize your booking</p>
            </div>

            {/* Lock notification */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-800 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/55">
              <Clock className="size-3.5 animate-pulse text-amber-500" />
              <span>Slot locked for <b>{formatTime(timeLeft)}</b> minutes</span>
            </div>

            {/* Payment Summary */}
            <div className="rounded-2xl bg-slate-50 p-4 text-left space-y-1.5 border border-slate-100 dark:bg-zinc-900/50 dark:border-zinc-800">
              <div className="flex justify-between text-xs text-slate-500"><span className="dark:text-zinc-400">Doctor</span><span className="font-semibold text-slate-800 dark:text-white">{selectedDoctor.name}</span></div>
              <div className="flex justify-between text-xs text-slate-500"><span className="dark:text-zinc-400">Slot Block</span><span className="font-semibold text-slate-800 dark:text-white">{selectedSlot}</span></div>
              <div className="flex justify-between text-xs text-slate-500"><span className="dark:text-zinc-400">Patient</span><span className="font-semibold text-slate-800 dark:text-white">{patientName}</span></div>
              <div className="border-t border-slate-200 my-1.5 pt-1.5 flex justify-between text-sm font-bold dark:border-zinc-800"><span className="text-slate-800 dark:text-zinc-300">Amount Due</span><span className="text-indigo-600 dark:text-teal-400">₹500.00</span></div>
            </div>

            {/* Dynamic QR Box */}
            <div className="relative mx-auto size-48 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-inner flex flex-col items-center justify-center dark:border-zinc-800">
              {/* Fake QR visual */}
              <div className="size-full opacity-90 relative">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=hospital@upi%26pn=MetroHospital%26am=500%26cu=INR%26tn=Appt-${patientName.replace(/\s+/g, '')}`} 
                  alt="UPI QR Code" 
                  className="size-full rounded"
                />
                <div className="absolute inset-0 border border-indigo-500/20 rounded pointer-events-none animate-pulse" />
              </div>
            </div>

            <p className="text-xxs text-slate-400 tracking-wide dark:text-zinc-500">Scan using GPay, PhonePe, Paytm, or any banking app</p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setBookingStep("details")}
                className="w-1/3 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 cursor-pointer"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleSimulatePayment}
                disabled={isVerifying}
                className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="size-3.5 animate-spin" />
                    Verifying Payment...
                  </>
                ) : (
                  <>
                    <CheckCircle className="size-3.5" />
                    Simulate Payment Success
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {bookingStep === "confirmed" && (
          <div className="space-y-6 py-4 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/40">
              <Sparkles className="size-7 text-emerald-650 dark:text-emerald-400" />
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">Booking Confirmed!</h2>
              <p className="text-sm text-slate-500 mt-1 dark:text-zinc-400">Your cloud-verified booking is complete.</p>
            </div>

            {/* Receipt details */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-left space-y-2 dark:border-zinc-800 dark:bg-zinc-900/20">
              <div className="text-xs text-slate-500 flex justify-between"><span className="dark:text-zinc-400">Patient</span><span className="font-bold text-slate-800 dark:text-white">{patientName}</span></div>
              <div className="text-xs text-slate-500 flex justify-between"><span className="dark:text-zinc-400">Doctor Assigned</span><span className="font-bold text-slate-800 dark:text-white">{selectedDoctor.name}</span></div>
              <div className="text-xs text-slate-500 flex justify-between"><span className="dark:text-zinc-400">Cabin Room</span><span className="font-bold text-slate-800 dark:text-white uppercase">{selectedDoctor.cabin}</span></div>
              <div className="text-xs text-slate-500 flex justify-between"><span className="dark:text-zinc-400">Time Block</span><span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedSlot}</span></div>
              <div className="text-xs text-slate-500 flex justify-between"><span className="dark:text-zinc-400">Payment Status</span><span className="font-semibold text-emerald-600 flex items-center gap-0.5"><CheckCircle className="size-3" /> Cloud Secured</span></div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3.5 text-left text-xxs text-indigo-800 dark:bg-indigo-950/20 dark:border-indigo-900/30 dark:text-indigo-400">
              💡 <b>Next Step:</b> Approach the front desk <b>Reception Counter 1</b> upon arriving at the clinic. The Medical Record Officer (MRO) will instantly verify your payment and issue your atomic token queue ticket!
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-full rounded-xl bg-slate-800 py-3 text-xs font-bold text-white hover:bg-slate-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer"
            >
              Book Another Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
