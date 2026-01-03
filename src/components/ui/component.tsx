"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "../../lib/utils";

export interface Country {
  code: string;
  name: string;
}

export interface Region {
  id: string;
  label: string;
  colorClass: string;
  countries: Country[];
}

interface InternationalTransferProps {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  regions: Region[];
  className?: string;
}

export function InternationalTransfer({
  title,
  subtitle,
  description,
  ctaText,
  regions,
  className,
}: InternationalTransferProps) {
  return (
    <section className={cn("w-full max-w-5xl mx-auto px-4 py-12 font-sans", className)}>
      <div className="text-center mb-12 space-y-3">
        <h2 className="text-sky-500 text-xs md:text-sm font-bold tracking-widest uppercase italic">
          {subtitle}
        </h2>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
          {title}
        </h1>
      </div>

      <div className="bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="flex flex-col">
          {regions.map((region) => (
            <RegionRow key={region.id} region={region} />
          ))}
        </div>
      </div>

      <div className="mt-10 text-center">
        <p className="text-slate-500 text-sm leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      <div className="mt-8 flex justify-center">
        <button className="bg-black text-white px-10 py-3.5 rounded-full font-semibold text-sm hover:scale-105 active:scale-95 transition-all duration-200 shadow-xl">
          {ctaText}
        </button>
      </div>
    </section>
  );
}

export function RegionRow({ region }: { region: Region }) {
  const [isOpen, setIsOpen] = useState(false);
  const visible = region.countries.slice(0, 4);
  const hidden = region.countries.slice(4);

  return (
    <div className={cn(
      "group transition-all duration-300 border-b last:border-0 border-slate-100",
      isOpen ? "bg-white shadow-md z-10 scale-[1.01] rounded-xl my-1 border-transparent" : "hover:bg-white/50"
    )}>
      <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-12 items-start">
        <div className="md:w-32 flex-shrink-0 pt-1">
          <span className={cn("font-semibold text-sm tracking-wide", region.colorClass)}>
            {region.label}
          </span>
        </div>

        <div className="flex-grow w-full">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4">
            {visible.map((c) => <CountryItem key={c.code} country={c} />)}
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4">
                  {hidden.map((c) => <CountryItem key={c.code} country={c} />)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {hidden.length > 0 && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:w-32 flex items-center justify-end gap-2 text-slate-400 hover:text-black text-sm font-medium ml-auto"
          >
            <span>{isOpen ? "Show less" : "Show all"}</span>
            <motion.span animate={{ rotate: isOpen ? 45 : 0 }}><Plus size={16} /></motion.span>
          </button>
        )}
      </div>
    </div>
  );
}

function CountryItem({ country }: { country: Country }) {
  return (
    <div className="flex items-center gap-3 group/item">
      <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-100 shadow-sm flex-shrink-0">
        <img 
          src={`https://flagcdn.com/${country.code}.svg`} 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-slate-600 text-sm font-medium group-hover/item:text-black transition-colors">
        {country.name}
      </span>
    </div>
  );
}