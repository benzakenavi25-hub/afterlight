// Elevator-doors intro (see src/components/ElevatorDoors.tsx): decided before first paint.
// Plays on every page load/refresh, except with reduced motion.
try {
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.setAttribute('data-doors', 'pending');
  }
} catch (e) {}
