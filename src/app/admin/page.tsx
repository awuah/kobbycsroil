"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  CheckCircle2,
  Clock,
  Download,
  Search,
  LogOut,
  Loader2,
  RefreshCw,
  Eye,
  X,
  MessageSquare,
  Trash2,
  ClipboardCheck,
  HeartHandshake,
} from "lucide-react";
import {
  RegistrationStatus,
  STATUS_CONFIG,
  TrainingRegistration,
} from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<TrainingRegistration[]>([]);
  const [adminName, setAdminName] = useState("Coordinator");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Modal state
  const [selected, setSelected] = useState<TrainingRegistration | null>(null);
  const [editStatus, setEditStatus] = useState<RegistrationStatus>("pending");
  const [editNotes, setEditNotes] = useState("");
  const [sendSmsOnConfirm, setSendSmsOnConfirm] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setRegistrations(data.registrations || []);
      if (data.admin?.name) setAdminName(data.admin.name);
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleLogout = async () => {
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/admin/login");
  };

  const openModal = (reg: TrainingRegistration) => {
    setSelected(reg);
    setEditStatus(reg.status);
    setEditNotes(reg.admin_notes || "");
    setSendSmsOnConfirm(true);
  };

  const handleUpdate = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selected.id,
          status: editStatus,
          admin_notes: editNotes,
          sendConfirmationSms: editStatus === "confirmed" && sendSmsOnConfirm,
        }),
      });
      const data = await res.json();
      if (res.ok && data.registration) {
        setRegistrations((prev) =>
          prev.map((r) => (r.id === selected.id ? data.registration : r))
        );
        setSelected(null);
        showToast(
          data.confirmationSmsSent
            ? "Updated status and sent Confirmation SMS!"
            : "Registration updated successfully."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this registration?")) return;
    const res = await fetch(`/api/admin?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setRegistrations((prev) => prev.filter((r) => r.id !== id));
      setSelected(null);
      showToast("Registration deleted.");
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return registrations.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (typeFilter !== "all" && r.registration_type !== typeFilter) return false;
      if (!q) return true;
      return (
        r.full_name.toLowerCase().includes(q) ||
        r.registration_number.toLowerCase().includes(q) ||
        r.phone_number.toLowerCase().includes(q) ||
        r.community.toLowerCase().includes(q) ||
        r.occupation.toLowerCase().includes(q)
      );
    });
  }, [registrations, search, statusFilter, typeFilter]);

  const stats = useMemo(() => {
    const total = registrations.length;
    const confirmed = registrations.filter((r) => r.status === "confirmed").length;
    const pending = registrations.filter((r) => r.status === "pending").length;
    const registerCount = registrations.filter((r) => r.registration_type === "register").length;
    const interestCount = registrations.filter((r) => r.registration_type === "interest").length;
    const female = registrations.filter((r) => r.gender === "Female").length;
    const male = registrations.filter((r) => r.gender === "Male").length;
    return { total, confirmed, pending, registerCount, interestCount, female, male };
  }, [registrations]);

  const exportCSV = () => {
    const headers = [
      "Ref Number",
      "Type",
      "Full Name",
      "Gender",
      "Age Group",
      "Phone",
      "Email",
      "Community",
      "Occupation",
      "Experience",
      "Focus Area",
      "ID Number",
      "All 5 Days",
      "Status",
      "SMS Sent",
      "Notes",
      "Admin Notes",
      "Submitted At",
    ];
    const rows = filtered.map((r) => [
      r.registration_number,
      r.registration_type,
      r.full_name,
      r.gender,
      r.age_group,
      r.phone_number,
      r.email,
      r.community,
      r.occupation,
      r.experience_level,
      r.focus_interest,
      r.id_number,
      r.available_all_5_days ? "Yes" : "No",
      r.status,
      r.sms_sent ? "Yes" : "No",
      r.notes,
      r.admin_notes,
      r.created_at,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((val) => `"${String(val ?? "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `palm-oil-training-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center gap-3 bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        <p className="text-sm text-slate-500">Loading registrations...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {toast && (
          <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-brand-500/40 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-400" />
            {toast}
          </div>
        )}

        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Training Coordinator Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Signed in as <strong className="text-slate-700">{adminName}</strong> • 5-Day Palm
              Oil Processing &amp; Value Addition Training
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={loadData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV ({filtered.length})
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Total Applicants</span>
              <Users className="w-4 h-4 text-brand-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{stats.total}</div>
            <div className="text-[11px] text-slate-500 mt-1">
              {stats.female} Female • {stats.male} Male
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Registering</span>
              <ClipboardCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700 mt-1">
              {stats.registerCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Direct seat applications</div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Expressed Interest</span>
              <HeartHandshake className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-700 mt-1">{stats.interestCount}</div>
            <div className="text-[11px] text-slate-500 mt-1">Interest submissions</div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Pending Review</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{stats.pending}</div>
            <div className="text-[11px] text-slate-500 mt-1">Awaiting decision</div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Confirmed Seats</span>
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
            </div>
            <div className="text-2xl font-black text-brand-700 mt-1">{stats.confirmed}</div>
            <div className="text-[11px] text-slate-500 mt-1">Approved for training</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, ref number, community, or occupation..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:border-brand-500 outline-none"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">All Types</option>
            <option value="register">Register to Attend</option>
            <option value="interest">Express Interest</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="confirmed">Confirmed</option>
            <option value="waitlisted">Waitlisted</option>
            <option value="declined">Not Selected</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Ref / Date</th>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Community &amp; Role</th>
                  <th className="py-3 px-4">SMS</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No registrations match your current filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((reg) => {
                    const st = STATUS_CONFIG[reg.status] || STATUS_CONFIG.pending;
                    return (
                      <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-mono font-bold text-brand-700">
                            {reg.registration_number}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {formatDate(reg.created_at)}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{reg.full_name}</div>
                          <div className="text-[11px] text-slate-500">
                            {reg.phone_number} • {reg.gender}
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold ${
                              reg.registration_type === "interest"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-brand-50 text-brand-700"
                            }`}
                          >
                            {reg.registration_type === "interest" ? "Interest" : "Register"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">{reg.community}</div>
                          <div className="text-[11px] text-slate-500">{reg.occupation}</div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                              reg.sms_sent ? "text-emerald-600" : "text-slate-400"
                            }`}
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            {reg.sms_sent ? "Sent" : "—"}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${st.bg} ${st.color} ${st.border}`}
                          >
                            {st.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => openModal(reg)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Manage
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail / Update Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-brand-400 font-bold">
                  {selected.registration_number}
                </div>
                <h3 className="text-lg font-extrabold">{selected.full_name}</h3>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-sm">
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Phone</span>
                  <span className="font-bold text-slate-900">{selected.phone_number}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Gender / Age</span>
                  <span className="font-bold text-slate-900">
                    {selected.gender} {selected.age_group ? `(${selected.age_group})` : ""}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Community</span>
                  <span className="font-bold text-slate-900">{selected.community}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Occupation</span>
                  <span className="font-bold text-slate-900">{selected.occupation}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Experience</span>
                  <span className="font-bold text-slate-900">{selected.experience_level}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Focus Interest</span>
                  <span className="font-bold text-slate-900">{selected.focus_interest}</span>
                </div>
                {selected.email && (
                  <div>
                    <span className="text-slate-500 block">Email</span>
                    <span className="font-bold text-slate-900">{selected.email}</span>
                  </div>
                )}
                {selected.id_number && (
                  <div>
                    <span className="text-slate-500 block">ID Number</span>
                    <span className="font-bold text-slate-900">{selected.id_number}</span>
                  </div>
                )}
                <div className="col-span-2">
                  <span className="text-slate-500 block">5-Day Availability</span>
                  <span className="font-bold text-slate-900">
                    {selected.available_all_5_days ? "Confirmed all 5 days" : "Partial / Unsure"}
                  </span>
                </div>
                {selected.notes && (
                  <div className="col-span-2 pt-2 border-t border-slate-200">
                    <span className="text-slate-500 block">Applicant Notes</span>
                    <p className="text-slate-800 mt-0.5">{selected.notes}</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Update Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as RegistrationStatus)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
                  >
                    <option value="pending">Pending Review</option>
                    <option value="under_review">Under Review</option>
                    <option value="confirmed">Confirmed Seat</option>
                    <option value="waitlisted">Waitlisted</option>
                    <option value="declined">Not Selected</option>
                  </select>
                </div>

                {editStatus === "confirmed" && (
                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendSmsOnConfirm}
                      onChange={(e) => setSendSmsOnConfirm(e.target.checked)}
                      className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>
                      <strong>Send Confirmation SMS</strong> to {selected.phone_number} with
                      event date &amp; venue details
                    </span>
                  </label>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Internal Admin Notes
                  </label>
                  <textarea
                    rows={2}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Optional internal remarks..."
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleDelete(selected.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleUpdate}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold"
                  >
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
