import Link from "next/link";
import { Sprout, ShieldCheck, Calendar, MapPin, Phone, Clock } from "lucide-react";
import { EVENT_INFO } from "@/lib/types";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 text-slate-400 pt-14 pb-10 border-t border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800/80">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-emerald-800 border border-brand-500/30 flex items-center justify-center">
                <Sprout className="w-5 h-5 text-palm-300" />
              </div>
              <div>
                <span className="font-bold text-white text-base sm:text-lg tracking-tight">
                  CSIR-OPRI &amp; <span className="text-brand-400">WUSC-Ghana</span>
                </span>
                <p className="text-xs text-slate-500">
                  5-Day Training in Palm Oil Processing &amp; Value Addition
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Organized by the CSIR – Oil Palm Research Institute and World University Service of
              Canada, Ghana (WUSC - Ghana), in collaboration with the Office of the Member of
              Parliament, <strong className="text-slate-200">{EVENT_INFO.invitedGuest}</strong>{" "}
              (Biochemist &amp; MP, Takoradi Constituency).
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 pt-1">
              <span className="inline-flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-brand-400" />
                Contact {EVENT_INFO.contactName}:{" "}
                <a
                  href={`tel:${EVENT_INFO.contactPhone}`}
                  className="text-brand-300 hover:underline font-semibold"
                >
                  {EVENT_INFO.contactPhoneDisplay}
                </a>
              </span>
            </div>
          </div>

          {/* Schedule Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Event Schedule
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <Calendar className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                <span>{EVENT_INFO.dates}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                <span>{EVENT_INFO.venue}</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                <span>{EVENT_INFO.time}</span>
              </li>
            </ul>
          </div>

          {/* Portal Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Portal &amp; Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/#register-form" className="hover:text-white transition-colors">
                  Register for Training
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-white transition-colors">
                  Track Application Status
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                  Coordinator Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            © {new Date().getFullYear()} Office of the MP, Takoradi Constituency • CSIR-OPRI &amp;
            WUSC-Ghana Training Initiative.
          </div>
          <div>Takoradi, Western Region, Ghana</div>
        </div>
      </div>
    </footer>
  );
}
