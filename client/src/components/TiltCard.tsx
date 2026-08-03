import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Zap } from 'lucide-react';

interface TiltCardProps {
  cardType?: string;
  maskedPan?: string;
  cardholderName?: string;
  expiryMonth?: number | string;
  expiryYear?: number | string;
  status?: string;
  className?: string;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  cardType = 'Virtual Visa',
  maskedPan = '4111 •••• •••• 9821',
  cardholderName = 'ALEX VANCE',
  expiryMonth = 12,
  expiryYear = 28,
  status = 'READY',
  className = '',
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [15, -15]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-15, 15]), { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className={className}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative p-6 rounded-2xl bg-gradient-to-br from-[#0B0D12] via-[#141822] to-[#1E1B4B] border border-glass-border shadow-2xl space-y-4 overflow-hidden group cursor-pointer"
      >
        {/* Holographic Card Metallic Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-gold/10 via-transparent to-violet/15 opacity-80 group-hover:opacity-100 transition-opacity" />

        <div className="relative z-10 flex justify-between items-center" style={{ transform: 'translateZ(20px)' }}>
          <span className="font-mono font-bold text-xs tracking-widest text-gold">
            NOVABANK
          </span>
          <div className="flex items-center gap-1">
            <Zap className="h-4 w-4 text-gold animate-pulse" />
            <span className="text-xs font-mono font-semibold text-ink-muted uppercase">{cardType}</span>
          </div>
        </div>

        <div className="relative z-10 font-mono text-base tracking-widest text-ink font-bold my-4" style={{ transform: 'translateZ(30px)' }}>
          {maskedPan}
        </div>

        <div className="relative z-10 flex justify-between items-end text-xs text-ink-muted font-mono" style={{ transform: 'translateZ(20px)' }}>
          <div>
            <div className="text-ink-faint uppercase text-xs font-semibold">Cardholder</div>
            <div className="font-bold text-ink">{cardholderName}</div>
          </div>
          <div>
            <div className="text-ink-faint uppercase text-xs font-semibold">Expires / Status</div>
            <div className="font-bold text-success">
              {expiryMonth}/{expiryYear} • {status}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
