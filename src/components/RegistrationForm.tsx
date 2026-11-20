"use client";

import React, { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  Printer,
  Search,
  Send,
  User,
  Phone,
  MapPin,
  Briefcase,
  Sparkles,
  MessageSquare,
  Calendar,
  Clock,
  ClipboardCheck,
  HeartHandshake,
  RotateCcw,
} from "lucide-react";
import { EVENT_INFO, RegistrationType, TrainingRegistration } from "@/lib/types";

const TAKORADI_COMMUNITIES = [
  "Amanful East",
  "Amanful West",
  "New Takoradi",
  "Market Circle",
  "Beach Road",
  "Chapel Hill",
  "Anaji",
  "Windy Ridge",
  "Effia",
  "Effiakuma",
  "Kojokrom",
  "Kwesimintsim",
  "Sekondi",
  "Essikado",
  "Mpintsin",
  "Fijai",
  "Tanokrom",
  "Apollo",
];

const OCCUPATIONS = [
  "Palm Oil Processor",
  "Oil Palm Farmer",
  "Agripreneur / Small Business Owner",
  "Youth / Job Seeker",
  "Student / Graduate",
  "Women's Group / Cooperative Member",
  "Food Vendor / Caterer",
  "Other",
];

const EXPERIENCE_LEVELS = [
  "Beginner (No Prior Experience)",
  "Intermediate (Some Experience)",
  "Experienced Processor / Business Owner",
];

const FOCUS_AREAS = [
  "All Training Modules",
  "Modern Palm Oil Processing Techniques",
  "Value Addition & Packaging",
  "Palm Kernel Oil, Soap & By-Products",
  "Quality Control, Hygiene & Standards",
  "Agribusiness & Market Linkages",
];

export default function RegistrationForm() {
  const [registrationType, setRegistrationType] = useState<RegistrationType>("register");
  const [formData, setFormData] = useState({
    full_name: "",
    gender: "",
    age_group: "",
    phone_number: "",
    email: "",
    community: "",
    occupation: "",
    experience_level: "Beginner (No Prior Experience)",
    focus_interest: "All Training Modules",
    id_number: "",
    available_all_5_days: true,
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingRef, setExistingRef] = useState<string | null>(null);
  const [submittedRecord, setSubmittedRecord] = useState<TrainingRegistration | null>(null);
  const [smsSent, setSmsSent] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (error) {
      setError(null);
      setExistingRef(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setExistingRef(null);

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          registration_type: registrationType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please check your details and try again.");
        if (data.existingRef) {
          setExistingRef(data.existingRef);
        }
        return;
      }

      setSubmittedRecord(data.registration);
      setSmsSent(Boolean(data.smsSent));

      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#16a34a", "#22c55e", "#facc15", "#ffffff"],
        });
      } catch {
        // Ignore confetti errors on unsupported environments
      }
    } catch {
      setError("Network error. Please check your internet connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedRecord(null);
    setSmsSent(false);
    setError(null);
    setExistingRef(null);
    setFormData({
      full_name: "",
      gender: "",
      age_group: "",
      phone_number: "",
      email: "",
      community: "",
      occupation: "",
      experience_level: "Beginner (No Prior Experience)",
      focus_interest: "All Training Modules",
      id_number: "",
      available_all_5_days: true,
      notes: "",
    });
  };

  if (submittedRecord) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden print-card">
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-emerald-600 text-white px-6 py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-white/15 border-2 border-white/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-9 h-9 text-white" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-2">
            {submittedRecord.registration_type === "interest"
              ? "Expression of Interest Received"
              : "Registration Submitted"}
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Thank You, {submittedRecord.full_name}!
          </h3>
          <p className="text-brand-100 text-sm mt-2 max-w-lg mx-auto">
            Your application for the <strong>{EVENT_INFO.title}</strong> has been recorded. Please
            await confirmation on the success of your application.
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Reference Number Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Application Reference Number
              </div>
              <div className="text-2xl sm:text-3xl font-black text-brand-700 tracking-wider font-mono mt-0.5">
                {submittedRecord.registration_number}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Keep this reference number safe to check your approval status anytime.
              </p>
            </div>
            <div className="px-3.5 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
              Status: Pending Confirmation
            </div>
          </div>

          {/* SMS Notification Banner */}
          <div
            className={`rounded-xl p-4 border flex items-start gap-3 ${
              smsSent
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-slate-50 border-slate-200 text-slate-700"
            }`}
          >
            <MessageSquare
              className={`w-5 h-5 shrink-0 mt-0.5 ${
                smsSent ? "text-emerald-600" : "text-slate-400"
              }`}
            />
            <div className="text-xs sm:text-sm leading-relaxed">
              {smsSent ? (
                <>
                  <strong className="font-bold">SMS Confirmation Sent!</strong> We have sent an SMS
                  to <span className="font-mono font-bold">{submittedRecord.phone_number}</span>{" "}
                  confirming receipt of your application. You will be notified once your slot is
                  confirmed.
                </>
              ) : (
                <>
                  <strong className="font-bold">Application Recorded!</strong> Your details are
                  safely saved under{" "}
                  <span className="font-mono font-bold">
                    {submittedRecord.registration_number}
                  </span>
                  . Please keep this slip and await confirmation from our coordinators.
                </>
              )}
            </div>
          </div>

          {/* Submitted Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm border-t border-slate-100 pt-5">
            <div>
              <span className="text-xs text-slate-500 block">Full Name</span>
              <span className="font-semibold text-slate-900">{submittedRecord.full_name}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Phone Number</span>
              <span className="font-semibold text-slate-900">{submittedRecord.phone_number}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Community / Electoral Area</span>
              <span className="font-semibold text-slate-900">{submittedRecord.community}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Role / Occupation</span>
              <span className="font-semibold text-slate-900">{submittedRecord.occupation}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Experience Level</span>
              <span className="font-semibold text-slate-900">
                {submittedRecord.experience_level}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Focus Area</span>
              <span className="font-semibold text-slate-900">{submittedRecord.focus_interest}</span>
            </div>
          </div>

          {/* Event Reminder */}
          <div className="bg-slate-900 text-white rounded-xl p-5 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-brand-400">
              Training Schedule Reminder
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-palm-400 shrink-0" />
                <span>{EVENT_INFO.shortDates}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-palm-400 shrink-0" />
                <span>{EVENT_INFO.venue}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-palm-400 shrink-0" />
                <span>{EVENT_INFO.time}</span>
              </div>
            </div>
            <div className="text-xs text-slate-400 pt-2 border-t border-slate-800">
              Enquiries? Call {EVENT_INFO.contactName} on{" "}
              <a
                href={`tel:${EVENT_INFO.contactPhone}`}
                className="text-brand-300 font-semibold hover:underline"
              >
                {EVENT_INFO.contactPhoneDisplay}
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 no-print">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print Confirmation Slip
            </button>
            <Link
              href={`/track?q=${encodeURIComponent(submittedRecord.registration_number)}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition-colors"
            >
              <Search className="w-4 h-4" />
              Track Status
            </Link>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              New Registration
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      {/* Form Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-brand-950 text-white px-6 sm:px-8 py-6 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-400">
              <Sparkles className="w-3.5 h-3.5" />
              Official Online Registration Portal
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold mt-1">
              Register or Express Interest
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Complete the form below to apply for the 5-Day Palm Oil Processing &amp; Value
              Addition Training. An instant SMS receipt will be sent to your phone.
            </p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
          <button
            type="button"
            onClick={() => setRegistrationType("register")}
            className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
              registrationType === "register"
                ? "bg-brand-500/20 border-brand-400 text-white shadow-sm"
                : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                registrationType === "register"
                  ? "bg-brand-500 text-slate-950"
                  : "bg-slate-700 text-slate-300"
              }`}
            >
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold">Register to Attend</div>
              <div className="text-[11px] text-slate-300">
                Apply for a training seat (26th – 30th Nov 2026)
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setRegistrationType("interest")}
            className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
              registrationType === "interest"
                ? "bg-palm-500/20 border-palm-400 text-white shadow-sm"
                : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                registrationType === "interest"
                  ? "bg-palm-400 text-slate-950"
                  : "bg-slate-700 text-slate-300"
              }`}
            >
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold">Express Interest</div>
              <div className="text-[11px] text-slate-300">
                Indicate interest &amp; receive confirmation updates
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
        {error && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 flex items-start gap-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <p className="font-medium">{error}</p>
              {existingRef && (
                <Link
                  href={`/track?q=${encodeURIComponent(existingRef)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 underline hover:text-rose-900"
                >
                  <Search className="w-3.5 h-3.5" />
                  Check status for {existingRef}
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Section 1: Personal Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              1. Personal Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleChange}
                placeholder="e.g. Kwame Mensah / Ama Serwaa"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Gender <span className="text-rose-500">*</span>
              </label>
              <select
                name="gender"
                required
                value={formData.gender}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
              >
                <option value="">Select gender...</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Age Group
              </label>
              <select
                name="age_group"
                value={formData.age_group}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
              >
                <option value="">Select age group (optional)...</option>
                <option value="18 - 25">18 – 25 years</option>
                <option value="26 - 35">26 – 35 years</option>
                <option value="36 - 45">36 – 45 years</option>
                <option value="46 - 55">46 – 55 years</option>
                <option value="56+">56+ years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Location */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              2. Contact &amp; Community Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Phone Number (SMS / WhatsApp) <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                name="phone_number"
                required
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="e.g. 024 123 4567"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
              />
              <p className="text-[11px] text-brand-700 font-medium mt-1">
                An instant SMS receipt will be sent to this number.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. name@example.com"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Community / Electoral Area <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="community"
                required
                list="takoradi-communities"
                value={formData.community}
                onChange={handleChange}
                placeholder="e.g. Amanful, New Takoradi, Anaji..."
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
              />
              <datalist id="takoradi-communities">
                {TAKORADI_COMMUNITIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Ghana Card / ID Number <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                name="id_number"
                value={formData.id_number}
                onChange={handleChange}
                placeholder="e.g. GHA-XXXXXXXXX-X"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Training Profile */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              3. Background &amp; Training Interest
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Current Role / Occupation <span className="text-rose-500">*</span>
              </label>
              <select
                name="occupation"
                required
                value={formData.occupation}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
              >
                <option value="">Select occupation...</option>
                {OCCUPATIONS.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Palm Oil Processing Experience <span className="text-rose-500">*</span>
              </label>
              <select
                name="experience_level"
                required
                value={formData.experience_level}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
              >
                {EXPERIENCE_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Primary Area of Interest
              </label>
              <select
                name="focus_interest"
                value={formData.focus_interest}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
              >
                {FOCUS_AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                What do you hope to gain from this training?{" "}
                <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                placeholder="Share any goals, current business details, or questions for the facilitators..."
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
              />
            </div>
          </div>

          {/* 5-day attendance checkbox */}
          <label className="flex items-start gap-3 p-4 rounded-xl bg-brand-50/60 border border-brand-200 cursor-pointer">
            <input
              type="checkbox"
              name="available_all_5_days"
              checked={formData.available_all_5_days}
              onChange={handleChange}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              <strong className="text-slate-900">5-Day Attendance Confirmation:</strong> I am
              available to attend the sessions from{" "}
              <strong>Thursday 26th Nov. 2026 to Monday 30th Nov. 2026</strong> starting at{" "}
              <strong>08:00 AM</strong> at the <strong>Government Secretariat, Takoradi</strong>.
            </span>
          </label>
        </div>

        {/* Submit */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            By submitting, you consent to receive SMS updates regarding your application status.
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-bold text-sm shadow-lg shadow-brand-600/25 transition-all"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting Application...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                {registrationType === "interest"
                  ? "Submit Expression of Interest"
                  : "Complete Registration"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
