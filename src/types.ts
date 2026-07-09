export interface ScheduledArrival {
  id: string;
  patientName: string;
  scheduledSlot: string;
  assignedDoctor: string;
  paymentStatus: "PAID via Cloud" | "PAID";
}

export interface IssuedTokenSummary {
  doctorName: string;
  activeToken: number;
  waitingCount: number;
}

export interface TvNowServing {
  token: number;
  cabin: string;
  doctor: string;
}

export interface TvUpNextItem {
  token: number;
  patientInitials: string;
}

export interface TvQueueState {
  nowServing: TvNowServing;
  upNext: TvUpNextItem[];
}

export interface ActivePatient {
  token: number;
  name: string;
  slot: string;
  historyAlert: string;
}

export interface DoctorProfile {
  id: string;
  name: string;
  cabin: string;
}

export interface PrescriptionPayload {
  doctorId: string;
  patientToken: number;
  diagnosis: string;
  prescription: string;
}
