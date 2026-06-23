export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Base radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,60,255,0.15),transparent)]" />

      {/* Animated orbs */}
      <div className="absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-3xl animate-pulse-slow" />
      <div
        className="absolute right-1/4 top-1/3 h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl animate-pulse-slow"
        style={{ animationDelay: '1s' }}
      />
      <div
        className="absolute bottom-1/4 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-600/8 blur-3xl animate-pulse-slow"
        style={{ animationDelay: '2s' }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}
