"use client";

import { useState } from "react";
import { VideoPlayer } from "@/components/video-player";
import { Button } from "@/components/ui/button";

export default function WatchSimplePage() {
  const [currentEpisode, setCurrentEpisode] = useState(1);
  
  const testVideos = [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  ];

  const handleEpisodeChange = (episode: number) => {
    setCurrentEpisode(episode);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">简化观看页面测试</h1>
        
        {/* 视频播放器 */}
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <VideoPlayer 
            key={currentEpisode}
            src={testVideos[currentEpisode - 1]}
            autoplay={false}
          />
        </div>
        
        {/* 简单控制 */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            disabled={currentEpisode <= 1}
            onClick={() => handleEpisodeChange(currentEpisode - 1)}
          >
            上一集
          </Button>
          <span className="flex items-center px-4 py-2 bg-muted rounded">
            第 {currentEpisode} 集
          </span>
          <Button
            variant="outline"
            disabled={currentEpisode >= testVideos.length}
            onClick={() => handleEpisodeChange(currentEpisode + 1)}
          >
            下一集
          </Button>
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          当前视频源: {testVideos[currentEpisode - 1]}
        </div>
      </div>
    </div>
  );
}