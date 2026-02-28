import { motion } from 'framer-motion';

interface Brand {
  id: string;
  name: string;
  icon: string;
}

interface LogoCloudProps {
  brands: Brand[];
  onHover: (id: string | null) => void;
  hoveredBrand: string | null;
}

export function LogoCloud({ brands, onHover, hoveredBrand }: LogoCloudProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <motion.div
      className="logos-grid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {brands.map((brand) => (
        <motion.div
          key={brand.id}
          className={`logo-btn ${hoveredBrand === brand.id ? 'active' : ''} ${
            hoveredBrand && hoveredBrand !== brand.id ? 'dimmed' : ''
          }`}
          variants={itemVariants}
          onMouseEnter={() => onHover(brand.id)}
          onMouseLeave={() => onHover(null)}
          whileHover={{ scale: 1.15 }}
          transition={{ type: 'spring', stiffness: 300, damping: 10 }}
        >
          <motion.div
            className="logo-icon"
            animate={{
              scale: hoveredBrand === brand.id ? 1.2 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            {brand.icon}
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}
