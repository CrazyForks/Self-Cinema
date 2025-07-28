'use client';

export function DotPattern() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(var(--foreground)/0.15)_1px,transparent_0)] [background-size:20px_20px] dark:bg-[radial-gradient(circle_at_1px_1px,rgb(var(--foreground)/0.1)_1px,transparent_0)]" />
      
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-background/50 to-transparent" />
    </div>
  );
}