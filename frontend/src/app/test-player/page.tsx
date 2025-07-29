"use client";

import { VideoPlayer } from "@/components/video-player";

export default function TestPlayerPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold mb-4">播放器测试页面</h1>
      <div className="max-w-4xl mx-auto">
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <VideoPlayer 
            src="https://media.onmicrosoft.cn/Re-He-Road-LIZHI-2018-Unplugged.mp4"
            autoplay={false}
          />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          如果您看到播放器控件，说明组件工作正常。请检查浏览器控制台的日志信息。
        </p>
      </div>
    </div>
  );
}