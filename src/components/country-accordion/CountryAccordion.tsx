import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface Country {
  code: string;
  name: string;
}

export interface Region {
  id: string;
  label: string;
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
    setOpenRegionId(prev => (prev === id ? null : id));
  };

  return (
    <main className="max-w-4xl w-full mx-auto font-sans antialiased">
      {(title || subtitle) && (
        <header className="text-center mb-10 space-y-2">
          {subtitle && (
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">
              {subtitle}
            </p>
          )}
          {title && (
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              {title}
            </h1>
          )}
        </header>
      )}

      <section className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="divide-y divide-border">
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

      <footer className="mt-8 flex flex-col items-center gap-6">
        <p className="text-sm text-muted-foreground leading-relaxed text-center max-w-xl">
          {description}
        </p>
        <CtaButton label={ctaText} />
      </footer>
    </main>
  );
}

/* ─────────────────────────────────────────
   CTA Button with sliding arrow
───────────────────────────────────────── */

function CtaButton({ label }: { label: string }) {
  return (
    <button className="group flex items-center gap-2 bg-foreground text-background px-7 py-3 rounded-full font-semibold text-sm hover:opacity-90 active:scale-95 transition-all duration-200 shadow-md">
      <span>{label}</span>
      <span className="relative overflow-hidden flex items-center justify-center w-4 h-4">
        <ArrowRight
          size={14}
          className="absolute transition-all duration-300 ease-in-out group-hover:translate-x-5 group-hover:opacity-0"
        />
        <ArrowRight
          size={14}
          className="absolute -translate-x-5 opacity-0 transition-all duration-300 ease-in-out group-hover:translate-x-0 group-hover:opacity-100"
        />
      </span>
    </button>
  );
}

/* ─────────────────────────────────────────
   Region row
───────────────────────────────────────── */

function RegionRow({
  region,
  isOpen,
  onToggle,
}: {
  region: Region;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const visible = region.countries.slice(0, 4);
  const hidden = region.countries.slice(4);

  return (
    <div
      className={cn(
        'transition-colors duration-200',
        isOpen ? 'bg-muted/40' : 'hover:bg-muted/20',
      )}
    >
      <div className="p-5 md:p-6 flex flex-col md:flex-row gap-4 md:gap-10">
        {/* Region label */}
        <div className="md:w-28 flex-shrink-0 pt-0.5">
          <span className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground">
            {region.label}
          </span>
        </div>

        {/* Countries grid */}
        <div className="flex-grow">
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {visible.map((country) => (
              <CountryItem key={country.code} country={country} />
            ))}
          </ul>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                  {hidden.map((country) => (
                    <CountryItem key={country.code} country={country} />
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Toggle button */}
        {hidden.length > 0 && (
          <div className="md:w-24 flex justify-start md:justify-end flex-shrink-0 pt-0.5">
            <button
              onClick={onToggle}
              className={cn(
                'flex items-center gap-1.5 text-xs font-medium transition-colors duration-200',
                isOpen ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <span>{isOpen ? 'Show less' : 'Show all'}</span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="text-base leading-none"
              >
                +
              </motion.span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Country pill
───────────────────────────────────────── */

function CountryItem({ country }: { country: Country }) {
  return (
    <li className="group/item flex items-center gap-2 px-2 py-1.5 rounded-lg bg-muted/30 border border-transparent hover:border-border transition-all duration-200 cursor-default">
      <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 shadow-sm">
        <img
          src={`https://flagcdn.com/${country.code}.svg`}
          alt={country.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-xs text-muted-foreground group-hover/item:text-foreground transition-colors truncate">
        {country.name}
      </span>
    </li>
  );
}
