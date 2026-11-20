import Link from "next/link";
import RegistrationForm from "@/components/RegistrationForm";
import FlyerShowcase from "@/components/FlyerShowcase";
import {
  Calendar,
  MapPin,
  Clock,
  Phone,
  Sparkles,
  ArrowDown,
  Search,
  ArrowRight,
  Award,
  FlaskConical,
  Factory,
  Users,
  CheckCircle2,
  Building2,
} from "lucide-react";
import { EVENT_INFO } from "@/lib/types";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section (Mirrors KobbyDrive slate-900 + brand green aesthetic) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white py-12 sm:py-20">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-palm-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs sm:text-sm font-semibold tracking-wide">
                <Sparkles className="w-4 h-4 text-palm-400 shrink-0" />
                CSIR – OPRI &amp; WUSC-Ghana • Takoradi Constituency
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                A 5-Day Training in <br />
                <span className="bg-gradient-to-r from-palm-300 via-brand-400 to-emerald-300 bg-clip-text text-transparent">
                  Palm Oil Processing &amp; Value Addition
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Organized by the <strong className="text-white">CSIR – Oil Palm Research Institute</strong>{" "}
                and <strong className="text-white">World University Service of Canada, Ghana (WUSC - Ghana)</strong>{" "}
                in collaboration with the Office of the Member of Parliament,{" "}
                <strong className="text-brand-300">{EVENT_INFO.invitedGuest}</strong>{" "}
                (<em>{EVENT_INFO.invitedGuestTitle}</em>).
              </p>

              {/* Key Event Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
                <div className="bg-slate-800/70 border border-slate-700/70 rounded-xl p-3.5 backdrop-blur">
                  <Calendar className="w-5 h-5 text-palm-400 mb-1.5" />
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                    Date
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white mt-0.5">
                    26th – 30th Nov. 2026
                  </div>
                  <div className="text-[11px] text-slate-400">Thursday to Monday</div>
                </div>

                <div className="bg-slate-800/70 border border-slate-700/70 rounded-xl p-3.5 backdrop-blur">
                  <MapPin className="w-5 h-5 text-brand-400 mb-1.5" />
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                    Venue
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white mt-0.5">
                    Government Secretariat
                  </div>
                  <div className="text-[11px] text-slate-400">Takoradi, Western Region</div>
                </div>

                <div className="bg-slate-800/70 border border-slate-700/70 rounded-xl p-3.5 backdrop-blur">
                  <Clock className="w-5 h-5 text-emerald-400 mb-1.5" />
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                    Time &amp; Contact
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white mt-0.5">08:00 AM Daily</div>
                  <div className="text-[11px] text-brand-300">
                    Abena: {EVENT_INFO.contactPhoneDisplay}
                  </div>
                </div>
              </div>

              {/* Hero CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <a
                  href="#register-form"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-brand-500/25 group"
                >
                  Register Now
                  <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </a>

                <Link
                  href="/track"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700 transition-all shadow-md hover:border-slate-600 group"
                >
                  <Search className="w-4 h-4 text-brand-400" />
                  Check Application Status
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Column: Official Flyer */}
            <div className="lg:col-span-5 max-w-md mx-auto w-full">
              <FlyerShowcase />
            </div>
          </div>
        </div>
      </section>

      {/* Program Highlights Section */}
      <section id="program-details" className="py-14 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-100 px-3 py-1 rounded-full">
              Program Overview
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 mb-2">
              Hands-On Skills for the Oil Palm Value Chain
            </h2>
            <p className="text-sm text-slate-600">
              Practical, research-backed training delivered by experts from CSIR – Oil Palm
              Research Institute and WUSC-Ghana to boost productivity, product quality, and
              enterprise growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                <Factory className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Modern Oil Processing
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Efficient extraction methods, hygiene standards, and best practices that maximize
                yield and reduce post-harvest losses.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <FlaskConical className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Value Addition &amp; Products
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transform palm oil and kernel by-products into higher-value packaged goods, soaps,
                and marketable agro-processed products.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Expert Facilitation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Led by scientists and industry specialists from CSIR-OPRI and WUSC-Ghana, with
                keynote participation by Hon. Kwabena Okyere Darko-Mansah.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                5-Day Intensive Cohort
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Runs Thursday 26th Nov. to Monday 30th Nov. 2026 at 08:00 AM daily at the
                Government Secretariat, Takoradi.
              </p>
            </div>
          </div>

          {/* Partner & Contact Strip */}
          <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 hidden sm:flex">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-brand-700">
                  Invited Guest &amp; Collaborating Office
                </div>
                <div className="text-sm font-bold text-slate-900">
                  {EVENT_INFO.invitedGuest} — {EVENT_INFO.invitedGuestTitle}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`tel:${EVENT_INFO.contactPhone}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200 text-xs font-bold transition-colors"
              >
                <Phone className="w-4 h-4 text-brand-600" />
                Call {EVENT_INFO.contactName}: {EVENT_INFO.contactPhoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Registration Form Section */}
      <section id="register-form" className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Training Registration Form
            </h2>
            <p className="text-sm text-slate-600">
              Complete the form below to register. Your seat is automatically confirmed with an
              instant SMS confirmation.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1.5 rounded-full self-start sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Instant Seat Confirmation &amp; SMS
          </div>
        </div>

        <RegistrationForm />
      </section>
    </div>
  );
}
