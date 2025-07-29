"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// 动态导入以避免SSR问题
const PlyrComponent = dynamic(() => import("./plyr-component"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">正在加载播放器...</p>
      </div>
    </div>
  ),
});

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoplay?: boolean;
}

export function VideoPlayer({ src, poster, autoplay = false }: VideoPlayerProps) {
  return (
    <div className="relative w-full">
      <PlyrComponent src={src} poster={poster} autoplay={autoplay} />
    </div>
  );
}