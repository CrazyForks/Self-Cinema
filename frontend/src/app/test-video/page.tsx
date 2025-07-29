"use client";

import { VideoPlayer } from "@/components/video-player";

export default function TestVideoPage() {
  const testVideos = [
    {
      name: "Big Buck Bunny (Google CDN)",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
    },
    {
      name: "Elephants Dream (Google CDN)",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg"
    },
    {
      name: "For Bigger Blazes (Google CDN)",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">视频播放器测试</h1>
        
        <div className="space-y-8">
          {testVideos.map((video, index) => (
            <div key={index} className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">{video.name}</h2>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <VideoPlayer 
                  src={video.url}
                  poster={video.poster}
                  autoplay={false}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                视频源: {video.url}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">调试信息</h3>
          <p className="text-sm text-muted-foreground">
            请打开浏览器开发者工具查看控制台输出，了解播放器初始化过程。
          </p>
        </div>
      </div>
    </div>
  );
}
