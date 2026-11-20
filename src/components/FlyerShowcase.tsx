"use client";

import React, { useState } from "react";
import { Maximize2, X } from "lucide-react";

export default function FlyerShowcase() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="relative group">
        <div className="absolute -inset-1.5 bg-gradient-to-tr from-brand-500/40 via-palm-400/30 to-emerald-400/40 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity" />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative block w-full overflow-hidden rounded-2xl border-2 border-white/20 bg-slate-900 shadow-2xl focus:outline-none focus:ring-2 focus:ring-brand-400"
          aria-label="Enlarge official training flyer"
        >
          <img
            src="/oiltraining.jpeg"
            alt="Official Flyer: 5-Day Training in Palm Oil Processing and Value Addition"
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.01]"
          />
          <div className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur text-white text-xs font-semibold border border-white/15">
            <Maximize2 className="w-3.5 h-3.5 text-brand-400" />
            Click to Enlarge
          </div>
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative max-w-2xl w-full max-h-[92vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute -top-3 -right-3 z-10 w-10 h-10 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center hover:bg-slate-100 transition-colors"
              aria-label="Close flyer preview"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src="/oiltraining.jpeg"
              alt="Official Training Flyer Full Size"
              className="max-h-[88vh] w-auto rounded-2xl shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}
    </>
  );
}
