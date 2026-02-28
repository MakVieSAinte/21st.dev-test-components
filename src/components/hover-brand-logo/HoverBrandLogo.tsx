import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const brands = [
  { id: 'react', name: 'React', icon: '⚛️' },
  { id: 'vue', name: 'Vue', icon: '💚' },
  { id: 'angular', name: 'Angular', icon: '🅰️' },
  { id: 'svelte', name: 'Svelte', icon: '🔥' },
  { id: 'next', name: 'Next.js', icon: '▲' },
  { id: 'nuxt', name: 'Nuxt', icon: '💚' },
  { id: 'remix', name: 'Remix', icon: '🎵' },
  { id: 'astro', name: 'Astro', icon: '🚀' },
];

export default function HoverBrandLogo() {
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);

  return (
    <div className="w-full">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          Use Supabase with
          <br />
          <AnimatePresence mode="wait">
            <motion.span
              key={hoveredBrand || 'any'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent"
            >
              {hoveredBrand
                ? brands.find(b => b.id === hoveredBrand)?.name
                : 'any framework'}
            </motion.span>
          </AnimatePresence>
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Seamlessly integrate with your favorite framework
        </p>
      </div>

      <motion.div
        className="grid grid-cols-5 gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.08, delayChildren: 0.2 }}
      >
        {brands.map((brand) => (
          <motion.button
            key={brand.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            onMouseEnter={() => setHoveredBrand(brand.id)}
            onMouseLeave={() => setHoveredBrand(null)}
            whileHover={{ scale: 1.15 }}
            className={`h-20 rounded-lg border-2 transition-all flex items-center justify-center text-3xl font-bold ${
              hoveredBrand === brand.id
                ? 'border-cyan-500 bg-cyan-500/10'
                : hoveredBrand && hoveredBrand !== brand.id
                ? 'border-border opacity-30'
                : 'border-border hover:border-muted-foreground'
            }`}
          >
            <motion.div
              animate={{
                scale: hoveredBrand === brand.id ? 1.2 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {brand.icon}
            </motion.div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
