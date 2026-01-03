"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  subtitle?: string;
  title?: string;
  description: string;
  ctaText: string;
  regions: Region[];
}

export function InternationalTransfer({
  subtitle,
  title,
  description,
  ctaText,
  regions,
}: InternationalTransferProps) {
  const [openRegionId, setOpenRegionId] = useState<string | null>(null);

  const toggleRegion = (id: string) => {
    setOpenRegionId(prevId => (prevId === id ? null : id));
  };

  return (
    <main className="max-w-5xl w-full mx-auto font-sans antialiased">
      {(title || subtitle) && (
        <header className="text-center mb-12 space-y-3">
          {subtitle && <h2 className="text-sky-500 text-xs md:text-sm font-bold tracking-widest uppercase">{subtitle}</h2>}
          {title && <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">{title}</h1>}
        </header>
      )}

      <section className="bg-[#fbfefb] rounded-xl border border-slate-100 overflow-hidden">
        <div className="divide-y divide-slate-200/60">
          {regions.map((region) => (
            <RegionRow 
              key={region.id} 
              region={region} 
              isOpen={openRegionId === region.id} 
              onToggle={() => toggleRegion(region.id)} 
            />
          ))}
        </div>
      </section>

      <footer className="mt-10 flex flex-col items-center space-y-8">
        <p className="text-slate-500 text-sm leading-relaxed text-center max-w-2xl">
          {description}
        </p>
        <button className="bg-slate-900 text-white px-10 py-3.5 rounded-full font-semibold text-sm hover:bg-black hover:scale-105 active:scale-95 transition-all duration-200 shadow-xl shadow-slate-200">
          {ctaText}
        </button>
      </footer>
    </main>
  );
}

function RegionRow({ 
  region, 
  isOpen, 
  onToggle 
}: { 
  region: Region; 
  isOpen: boolean; 
  onToggle: () => void 
}) {
  const visible = region.countries.slice(0, 4);
  const hidden = region.countries.slice(4);

  return (
    <div
      className={cn(
        "group transition-all duration-300",
        isOpen 
          ? "bg-white scale-[1.01] z-10" 
          : "hover:bg-white"
      )}
    >
      <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-12">
        <div className="md:w-32 flex-shrink-0 pt-1">
          <span className={cn("font-semibold text-sm tracking-wide", region.colorClass)}>
            {region.label}
          </span>
        </div>

        <div className="flex-grow">
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4">
            {visible.map((country) => (
              <CountryItem key={country.code} country={country} />
            ))}
          </ul>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <div className="h-6" />
                <ul className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4">
                  {hidden.map((country) => (
                    <CountryItem key={country.code} country={country} />
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {hidden.length > 0 && (
          <div className="md:w-32 flex justify-start md:justify-end flex-shrink-0 pt-1">
            <button
              onClick={onToggle}
              className={cn(
                "group/btn flex items-center gap-2 text-sm font-medium transition-colors",
                isOpen ? "text-slate-800" : "text-slate-500 hover:text-slate-800"
              )}
            >
              <span>{isOpen ? "Show less" : "Show all"}</span>
              <span 
                className={cn(
                  "text-lg leading-none transform transition-transform duration-300 group-hover/btn:scale-110",
                  isOpen ? "rotate-45" : "rotate-0"
                )}
              >
                +
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CountryItem({ country }: { country: Country }) {
  return (
    <li className="flex items-center gap-3 group/item cursor-default bg-slate-50 py-2 pl-2 pr-1 rounded-full border border-transparent hover:border-slate-200 transition-colors">
      <div className="w-7 h-7 rounded-full overflow-hidden shadow-sm border border-white relative bg-slate-200 flex-shrink-0 group-hover/item:scale-110 transition-all duration-300">
        <img
          src={`https://flagcdn.com/${country.code}.svg`}
          alt={country.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-slate-500 text-sm font-normal group-hover/item:text-slate-900 transition-colors truncate">
        {country.name}
      </span>
    </li>
  );
}