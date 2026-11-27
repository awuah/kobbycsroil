export type RegistrationType = "register" | "interest";

export type RegistrationStatus =
  | "pending"
  | "under_review"
  | "confirmed"
  | "waitlisted"
  | "declined";

export interface TrainingRegistration {
  id: string;
  registration_number: string;
  registration_type: RegistrationType;
  full_name: string;
  gender: string;
  age_group: string;
  phone_number: string;
  email: string;
  community: string;
  occupation: string;
  experience_level: string;
  focus_interest: string;
  id_number: string;
  available_all_5_days: boolean;
  notes: string;
  status: RegistrationStatus;
  sms_sent: boolean;
  sms_response?: string;
  admin_notes: string;
  created_at: string;
  updated_at: string;
}

export const EVENT_INFO = {
  title: "5-Day Training in Palm Oil Processing and Value Addition",
  shortTitle: "Palm Oil Processing & Value Addition",
  organizers:
    "CSIR • Oil Palm Research Institute (OPRI) & World University Service of Canada, Ghana (WUSC - Ghana)",
  collaborator:
    "Office of the Member of Parliament — Hon. Kwabena Okyere Darko-Mansah (MP, Takoradi Constituency)",
  invitedGuest: "Hon. Kwabena Okyere Darko-Mansah",
  invitedGuestTitle: "Biochemist & MP, Takoradi Constituency",
  dates: "Tuesday, 8th Dec. 2026 – Saturday, 12th Dec. 2026",
  shortDates: "8th – 12th Dec. 2026",
  venue: "Government Secretariat, Takoradi",
  time: "08:00 AM Daily",
  contactName: "Abena",
  contactPhone: "+233242108535",
  contactPhoneDisplay: "+233 24 210 8535",
};

export const STATUS_CONFIG: Record<
  RegistrationStatus,
  { label: string; color: string; bg: string; border: string; description: string }
> = {
  pending: {
    label: "Pending Review",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    description:
      "Your registration has been received and is awaiting review by the training coordinators.",
  },
  under_review: {
    label: "Under Review",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    description:
      "The CSIR-OPRI & WUSC-Ghana coordination team is currently reviewing your application.",
  },
  confirmed: {
    label: "Confirmed Seat",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    description:
      "Congratulations! Your seat is confirmed. Please report to the Government Secretariat by 08:00 AM on Tuesday, 8th Dec. 2026 (8th – 12th Dec. 2026).",
  },
  waitlisted: {
    label: "Waitlisted",
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
    description:
      "You have been placed on the priority waitlist. We will notify you via SMS immediately if a slot opens up.",
  },
  declined: {
    label: "Not Selected",
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    description:
      "Thank you for your interest. Unfortunately, we could not allocate a slot for this cohort. Please stay tuned for future training sessions.",
  },
};
