import type { ScheduledArrival, IssuedTokenSummary, TvQueueState, DoctorProfile, ActivePatient } from "./types";

export const STATION_NAME = "Front Counter 1";

export const DOCTOR_PROFILES: DoctorProfile[] = [
  {
    id: "doc-001",
    name: "Dr. Anand Kumar",
    cabin: "CABIN ROOM 2",
  },
  {
    id: "doc-002",
    name: "Dr. Sarah Jones",
    cabin: "CABIN ROOM 3",
  },
];

export const INITIAL_ARRIVALS: ScheduledArrival[] = [
  {
    id: "pat-001",
    patientName: "Harihs S.",
    scheduledSlot: "11:30 AM",
    assignedDoctor: "Dr. Anand Kumar",
    paymentStatus: "PAID via Cloud",
  },
  {
    id: "pat-002",
    patientName: "Rahul Mishra",
    scheduledSlot: "11:45 AM",
    assignedDoctor: "Dr. Sarah Jones",
    paymentStatus: "PAID via Cloud",
  },
  {
    id: "pat-003",
    patientName: "Priya Sharma",
    scheduledSlot: "12:00 PM",
    assignedDoctor: "Dr. Anand Kumar",
    paymentStatus: "PAID via Cloud",
  },
  {
    id: "pat-004",
    patientName: "Amit Kumar",
    scheduledSlot: "12:15 PM",
    assignedDoctor: "Dr. Anand Kumar",
    paymentStatus: "PAID via Cloud",
  },
  {
    id: "pat-005",
    patientName: "Suresh K.",
    scheduledSlot: "12:30 PM",
    assignedDoctor: "Dr. Sarah Jones",
    paymentStatus: "PAID via Cloud",
  },
];

export const INITIAL_TOKEN_SUMMARY: IssuedTokenSummary[] = [
  {
    doctorName: "Dr. Anand Kumar",
    activeToken: 4,
    waitingCount: 3,
  },
  {
    doctorName: "Dr. Sarah Jones",
    activeToken: 2,
    waitingCount: 1,
  },
];

export const INITIAL_TV_STATE: TvQueueState = {
  nowServing: {
    token: 5,
    cabin: "CABIN ROOM 2",
    doctor: "DR. ANAND",
  },
  upNext: [
    { token: 6, patientInitials: "Rahul M." },
    { token: 7, patientInitials: "Suresh K." },
    { token: 8, patientInitials: "Priya S." },
    { token: 9, patientInitials: "Vikram R." },
    { token: 10, patientInitials: "Amit K." },
    { token: 11, patientInitials: "Neha J." },
  ],
};

export const ACTIVE_PATIENT: ActivePatient = {
  token: 5,
  name: "Harihs S.",
  slot: "11:30 AM",
  historyAlert: "Patient has a record of Mild Chronic Kidney Disease - Feb 2026",
};

export const DEFAULT_DIAGNOSIS = "Patient complaining of acute lower back pain for 3 days, worse when sitting. Reflexes and physical responses appear completely normal.";

export const DEFAULT_PRESCRIPTION = "Paracetamol 650mg\nTwice a day\nFor 5 days.";
