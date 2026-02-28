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
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 sm:gap-12 lg:gap-20 w-full max-w-4xl mx-auto px-8 py-10">
      {/* Left: text */}
      <div className="flex-shrink-0 min-w-[200px]">
        <p className="text-sm text-muted-foreground font-medium mb-1 tracking-tight">
          Use Supabase with
        </p>
        <div className="h-9 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={hoveredId ?? 'default'}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.16, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-[28px] font-bold text-foreground leading-9 tracking-tight"
            >
              {activeBrand?.name ?? 'any framework'}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Right: icon row */}
      <div className="flex items-center gap-0.5 flex-wrap">
        {brands.map(({ id, name, Icon }) => {
          const isActive = hoveredId === id;
          const isDimmed = hoveredId !== null && !isActive;
          return (
            <button
              key={id}
              aria-label={name}
              className={cn(
                'p-2.5 rounded-lg border transition-all duration-200',
                isActive
                  ? 'border-foreground/30 text-foreground bg-foreground/5'
                  : 'border-transparent text-foreground/30',
                isDimmed ? 'opacity-40' : '',
              )}
              onMouseEnter={() => setHoveredId(id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
