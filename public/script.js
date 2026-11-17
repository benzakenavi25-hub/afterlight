// Elevator-doors intro (see src/components/ElevatorDoors.tsx): decided before first paint.
// Plays on every page load/refresh, except with reduced motion or when the URL has a #hash.
try {
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && !location.hash) {
    document.documentElement.setAttribute('data-doors', 'pending');
  }
} catch (e) {}
