import { motion } from 'framer-motion';

const orbConfigs = [
  { size: 420, top: '5%', left: '-10%', duration: 26, delay: 0, color: 'rgba(99, 102, 241, 0.25)' },
  { size: 320, top: '60%', left: '10%', duration: 32, delay: 4, color: 'rgba(59, 130, 246, 0.2)' },
  { size: 260, top: '20%', left: '65%', duration: 28, delay: 2, color: 'rgba(147, 51, 234, 0.18)' },
  { size: 360, top: '70%', left: '70%', duration: 34, delay: 6, color: 'rgba(14, 165, 233, 0.18)' }
];

const AnimatedBackground = () => (
  <div className="animated-bg mesh-bg">
    <motion.div
      className="mesh-gradient"
      animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
      transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
    />
    {orbConfigs.map((orb) => (
      <motion.span
        key={`${orb.top}-${orb.left}`}
        className="floating-orb"
        style={{
          width: orb.size,
          height: orb.size,
          top: orb.top,
          left: orb.left,
          background: orb.color
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, 20, -15, 0],
          opacity: [0.4, 0.65, 0.4]
        }}
        transition={{
          duration: orb.duration,
          repeat: Infinity,
          delay: orb.delay,
          ease: 'easeInOut'
        }}
      />
    ))}
  </div>
);

export default AnimatedBackground;

