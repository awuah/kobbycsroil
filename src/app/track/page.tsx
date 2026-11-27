"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Calendar,
  MapPin,
  Phone,
  ArrowLeft,
  FileCheck2,
  Sparkles,
} from "lucide-react";
import { EVENT_INFO, STATUS_CONFIG, TrainingRegistration } from "@/lib/types";
import { formatDate } from "@/lib/utils";

function TrackContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [record, setRecord] = useState<TrainingRegistration | null>(null);

  const performLookup = async (searchVal: string) => {
    const trimmed = searchVal.trim();
    if (!trimmed) {
      setError("Please enter your Reference Number (e.g. OPR-2026-XXXXX) or Phone Number.");
      return;
    }

    setLoading(true);
    setError(null);
    setRecord(null);

    try {
      const res = await fetch(`/api/registrations?q=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "No registration found for that query.");
        return;
      }
      setRecord(data.registration);
    } catch {
      setError("Network error while checking status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      performLookup(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLookup(query);
  };

  const statusMeta = record ? STATUS_CONFIG[record.status] || STATUS_CONFIG.pending : null;

  const currentStep = !record
    ? 0
    : record.status === "pending"
    ? 1
    : record.status === "under_review"
    ? 2
    : 3;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-700 transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Registration Portal
          </Link>

          <div className="bg-gradient-to-r from-slate-900 to-brand-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-400">
              <Sparkles className="w-3.5 h-3.5" />
              Real-Time Status Lookup
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
              Track Your Training Application
            </h1>
            <p className="text-sm text-slate-300 mt-1.5">
              Enter your Reference Number (e.g. <span className="font-mono text-white">OPR-2026-XXXXX</span>)
              or the Phone Number you registered with.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter Ref Number (OPR-2026-...) or Phone Number"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:bg-brand-700 text-slate-950 font-bold text-sm transition-colors inline-flex items-center justify-center gap-2 shrink-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Check Status
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {record && statusMeta && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Applicant Name
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {record.full_name}
                </h2>
                <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                  <span className="font-mono font-bold text-brand-700">
                    {record.registration_number}
                  </span>
                  <span>•</span>
                  <span>5-Day Training Registration</span>
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${statusMeta.bg} ${statusMeta.color} ${statusMeta.border}`}
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                {statusMeta.label}
              </span>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Status Message */}
              <div
                className={`rounded-xl p-4 border text-sm ${statusMeta.bg} ${statusMeta.color} ${statusMeta.border}`}
              >
                {statusMeta.description}
              </div>

              {/* 3-Step Progress Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {[
                  {
                    step: 1,
                    title: "Registration Submitted",
                    desc: "Participant details recorded",
                  },
                  {
                    step: 2,
                    title: "Seat Confirmed",
                    desc: "Automatic acceptance & SMS sent",
                  },
                  {
                    step: 3,
                    title:
                      record.status === "confirmed"
                        ? "Ready to Attend"
                        : record.status === "waitlisted"
                        ? "Waitlisted"
                        : record.status === "declined"
                        ? "Not Selected"
                        : "Attend Training",
                    desc:
                      record.status === "confirmed"
                        ? "8th – 12th Dec 2026, 08:00 AM"
                        : "Check status updates here",
                  },
                ].map((item) => {
                  const done = currentStep >= item.step;
                  return (
                    <div
                      key={item.step}
                      className={`rounded-xl p-4 border ${
                        done
                          ? "bg-brand-50/70 border-brand-200"
                          : "bg-slate-50 border-slate-200 opacity-65"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        {done ? (
                          <CheckCircle2 className="w-5 h-5 text-brand-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-slate-400" />
                        )}
                        <span className="text-xs font-bold text-slate-900">
                          Step {item.step}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-slate-900">{item.title}</div>
                      <div className="text-xs text-slate-600 mt-0.5">{item.desc}</div>
                    </div>
                  );
                })}
              </div>

              {/* Application Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs border-t border-slate-100 pt-5">
                <div>
                  <span className="text-slate-500 block">Community</span>
                  <span className="font-bold text-slate-900">{record.community}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Occupation</span>
                  <span className="font-bold text-slate-900">{record.occupation}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Submitted On</span>
                  <span className="font-bold text-slate-900">
                    {formatDate(record.created_at)}
                  </span>
                </div>
              </div>

              {/* Venue Reminder */}
              <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-brand-400 uppercase tracking-wider text-[11px]">
                    Training Event Details
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-200">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-palm-400" />
                      {EVENT_INFO.shortDates}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-palm-400" />
                      {EVENT_INFO.venue}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-palm-400" />
                      {EVENT_INFO.time}
                    </span>
                  </div>
                </div>
                <a
                  href={`tel:${EVENT_INFO.contactPhone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-brand-300 font-semibold shrink-0"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {EVENT_INFO.contactName}: {EVENT_INFO.contactPhoneDisplay}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        </div>
      }
    >
      <TrackContent />
    </Suspense>
  );
}
