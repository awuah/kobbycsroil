"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sprout,
  Search,
  Shield,
  Calendar,
  Phone,
  Menu,
  X,
  ClipboardCheck,
} from "lucide-react";
import { EVENT_INFO } from "@/lib/types";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-xl shadow-md group-hover:scale-105 transition-transform bg-gradient-to-br from-brand-600 to-emerald-800 text-white flex items-center justify-center border border-brand-500/30">
            <Sprout className="w-5 h-5 text-palm-300" />
          </div>
          <div>
            <span className="font-bold text-sm sm:text-base text-slate-900 tracking-tight flex items-center gap-1.5">
              CSIR-OPRI <span className="text-brand-600">Palm Oil Training</span>
            </span>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              With WUSC-Ghana &amp; Office of the MP, Takoradi
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1.5">
          <Link
            href="/"
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              pathname === "/"
                ? "bg-brand-50 text-brand-700 font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            Register / Express Interest
          </Link>

          <a
            href="/#program-details"
            className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Program Details
          </a>

          <Link
            href="/track"
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              pathname === "/track"
                ? "bg-brand-50 text-brand-700 font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            Track Status
          </Link>

          <a
            href={`tel:${EVENT_INFO.contactPhone}`}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg text-brand-700 bg-brand-50/70 hover:bg-brand-100 transition-colors hidden lg:flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" />
            {EVENT_INFO.contactName}: {EVENT_INFO.contactPhoneDisplay}
          </a>

          <Link
            href="/admin"
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              pathname.startsWith("/admin")
                ? "bg-slate-900 text-white"
                : "text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Admin
          </Link>
        </nav>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/track"
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 text-xs font-semibold flex items-center gap-1"
          >
            <Search className="w-4 h-4" />
            <span className="hidden xs:inline">Track</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 shadow-xl space-y-1.5">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 text-sm font-medium rounded-lg ${
              pathname === "/"
                ? "bg-brand-50 text-brand-700 font-bold"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            Register / Express Interest
          </Link>
          <a
            href="/#program-details"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-50"
          >
            Program Details
          </a>
          <a
            href={`tel:${EVENT_INFO.contactPhone}`}
            className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg text-brand-700 bg-brand-50"
          >
            <Phone className="w-4 h-4" />
            Call {EVENT_INFO.contactName}: {EVENT_INFO.contactPhoneDisplay}
          </a>
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
            <Link
              href="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2 px-3 text-center text-xs font-bold text-slate-700 bg-slate-100 rounded-lg"
            >
              Track Status
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2 px-3 text-center text-xs font-bold text-white bg-slate-900 rounded-lg"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
