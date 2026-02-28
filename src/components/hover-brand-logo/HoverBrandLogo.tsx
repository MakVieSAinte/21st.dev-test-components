import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  SiReact,
  SiNextdotjs,
  SiAngular,
  SiFlutter,
  SiSvelte,
  SiVuedotjs,
  SiNuxtdotjs,
  SiRemix,
  SiAstro,
  SiTypescript,
} from 'react-icons/si';
import { cn } from '../../lib/utils';

const brands = [
  { id: 'react',      name: 'React',      Icon: SiReact },
  { id: 'next',       name: 'Next.js',    Icon: SiNextdotjs },
  { id: 'angular',    name: 'Angular',    Icon: SiAngular },
  { id: 'flutter',    name: 'Flutter',    Icon: SiFlutter },
  { id: 'svelte',     name: 'Svelte',     Icon: SiSvelte },
  { id: 'vue',        name: 'Vue',        Icon: SiVuedotjs },
  { id: 'nuxt',       name: 'Nuxt',       Icon: SiNuxtdotjs },
  { id: 'remix',      name: 'Remix',      Icon: SiRemix },
  { id: 'astro',      name: 'Astro',      Icon: SiAstro },
  { id: 'typescript', name: 'TypeScript', Icon: SiTypescript },
];

export default function HoverBrandLogo() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const activeBrand = brands.find(b => b.id === hoveredId);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 lg:gap-16 w-full max-w-5xl mx-auto px-3 sm:px-8 py-10">
      {/* Left: text */}
      <div className="flex-shrink-0 w-[200px]">
        <p className="text-base text-muted-foreground font-medium mb-1.5 tracking-tight">
          Build your app with
        </p>
        <div className="h-10 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={hoveredId ?? 'default'}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.16, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-[23px] sm:text-[27px] font-bold text-foreground leading-10 tracking-tight"
            >
              {activeBrand?.name ?? 'any framework'}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Right: icon grid — wraps on small screens */}
      <div className="flex items-center gap-1 flex-wrap max-w-full sm:max-w-none">
        {brands.map(({ id, name, Icon }) => {
          const isActive = hoveredId === id;
          const isDimmed = hoveredId !== null && !isActive;
          return (
            <button
              key={id}
              aria-label={name}
              className={cn(
                'p-2.5 sm:p-3 rounded-lg border transition-all duration-200',
                isActive
                  ? 'border-foreground/30 text-foreground bg-foreground/5'
                  : 'border-transparent text-foreground/30',
                isDimmed ? 'opacity-40' : '',
              )}
              onMouseEnter={() => setHoveredId(id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Icon size={22} className="sm:hidden" />
              <Icon size={25} className="hidden sm:block" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
