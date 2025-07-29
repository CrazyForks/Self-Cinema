'use client';

export function DotPattern() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* 主要的点状背景 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(var(--foreground)/0.1)_1px,transparent_0)] [background-size:24px_24px] dark:bg-[radial-gradient(circle_at_1px_1px,rgb(var(--foreground)/0.08)_1px,transparent_0)]" />
      
      {/* 更细密的点状层 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0.5px_0.5px,rgb(var(--foreground)/0.05)_0.5px,transparent_0)] [background-size:12px_12px] dark:bg-[radial-gradient(circle_at_0.5px_0.5px,rgb(var(--foreground)/0.03)_0.5px,transparent_0)]" />
      
      {/* 更强的光晕效果 */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/6 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-purple-500/4 rounded-full blur-3xl" />
      
      {/* 渐变遮罩让边缘更自然 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-background/80 via-transparent to-background/80" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-background/20 to-transparent" />
    </div>
  );
}