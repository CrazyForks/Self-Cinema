"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { VideoPlayer } from "@/components/video-player";
import { ThemeToggle } from "@/components/theme-toggle";
import { Play, Clock, Calendar, ChevronLeft, ChevronRight, Star, Heart, Share2, Volume2, Settings, Maximize, Users, Eye, Bookmark, Crown, Monitor } from "lucide-react";

// 模拟数据 - 之后会从API获取
const mockData = {
  series: {
    id: "1",
    title: "风起洛阳",
    englishTitle: "The Wind Blows from Longxi",
    description: "武则天统治后期，洛阳发生了一系列离奇命案。不良人组织的密探高秉烛、洛阳县尉郭得友以及司宾寺主簿张归霸受命调查此案，却在调查过程中发现了一个威胁大唐江山社稷的惊天阴谋。随着案情抽丝剥茧，一个隐藏在暗处的反叛集团浮出水面...",
    coverImage: "https://via.placeholder.com/300x450/1a1a1a/ffffff?text=风起洛阳",
    backdropImage: "https://via.placeholder.com/1920x1080/2a2a2a/ffffff?text=风起洛阳+背景",
    totalEpisodes: 39,
    releaseYear: 2021,
    genre: ["古装", "悬疑", "历史", "剧情"],
    rating: 8.2,
    views: "2.1亿",
    status: "已完结",
    director: "谢泽",
    actors: ["王一博", "宋茜", "张志坚", "咏梅"],
    region: "中国大陆",
    language: "普通话",
    updateTime: "每周三、四20:00更新",
    tags: ["热播", "高分", "古装", "悬疑", "推荐"]
  },
  episodes: [
    { id: "1", title: "第1集：神都疑云", episode: 1, duration: "45:30", videoUrl: "https://media.onmicrosoft.cn/Re-He-Road-LIZHI-2018-Unplugged.mp4", description: "洛阳城内接连发生离奇命案，不良人高秉烛奉命调查...", isVip: false },
    { id: "2", title: "第2集：暗流涌动", episode: 2, duration: "46:15", videoUrl: "https://media.onmicrosoft.cn/Re-He-Road-LIZHI-2018-Unplugged.mp4", description: "高秉烛深入调查，发现案件背后的蛛丝马迹...", isVip: false },
    { id: "3", title: "第3集：真相初现", episode: 3, duration: "44:50", videoUrl: "https://media.onmicrosoft.cn/Re-He-Road-LIZHI-2018-Unplugged.mp4", description: "随着调查的深入，一个巨大的阴谋逐渐浮出水面...", isVip: true },
    { id: "4", title: "第4集：危机四伏", episode: 4, duration: "47:20", videoUrl: "https://media.onmicrosoft.cn/Re-He-Road-LIZHI-2018-Unplugged.mp4", description: "高秉烛等人陷入前所未有的危机之中...", isVip: true },
    { id: "5", title: "第5集：峰回路转", episode: 5, duration: "48:10", videoUrl: "https://media.onmicrosoft.cn/Re-He-Road-LIZHI-2018-Unplugged.mp4", description: "在关键时刻，意想不到的转机出现了...", isVip: true },
  ]
};

export default function WatchPage() {
  const params = useParams();
  const hash = params.hash as string;
  
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [watchProgress, setWatchProgress] = useState(65);

  const handleEpisodeChange = (episodeNumber: number) => {
    setCurrentEpisode(episodeNumber);
    setWatchProgress(Math.floor(Math.random() * 100));
  };

  const currentEpisodeData = mockData.episodes.find(ep => ep.episode === currentEpisode);

  return (
    <div className="min-h-screen bg-background">      
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                返回
              </Button>
              <div className="hidden md:flex items-center gap-2">
                <img src={mockData.series.coverImage} alt={mockData.series.title} className="w-8 h-12 object-cover rounded" />
                <div>
                  <h1 className="font-semibold text-sm">{mockData.series.title}</h1>
                  <p className="text-xs text-muted-foreground">{currentEpisodeData?.title}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsLiked(!isLiked)}>
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsBookmarked(!isBookmarked)}>
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-primary text-primary' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* 主要内容区域 */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* 视频播放器区域 */}
            <div className="relative">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <VideoPlayer 
                  key={`episode-${currentEpisode}`}
                  src={currentEpisodeData?.videoUrl || "https://media.onmicrosoft.cn/Re-He-Road-LIZHI-2018-Unplugged.mp4"}
                  autoplay={false}
                />
              </div>
              
              {/* 播放器信息覆盖层 - 临时注释以测试播放器 */}
              {/* <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-red-600 text-white border-0">
                        <Monitor className="h-3 w-3 mr-1" />
                        超清
                      </Badge>
                      {currentEpisodeData?.isVip && (
                        <Badge variant="secondary" className="bg-yellow-600 text-white border-0">
                          <Crown className="h-3 w-3 mr-1" />
                          VIP
                        </Badge>
                      )}
                      <Badge variant="secondary" className="bg-blue-600 text-white border-0">
                        第 {currentEpisode} 集
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Eye className="h-4 w-4" />
                      {mockData.series.views}
                    </div>
                  </div>
                  <Progress value={watchProgress} className="h-1 bg-white/20" />
                  <p className="text-xs mt-1 text-white/80">已观看 {watchProgress}%</p>
                </div>
              </div> */}
            </div>

            {/* 剧集详细信息 */}
            <Card className="border-2 border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div>
                      <CardTitle className="text-3xl font-bold mb-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 dark:from-primary dark:via-blue-600 dark:to-purple-600 bg-clip-text text-transparent">
                        {mockData.series.title}
                      </CardTitle>
                      <p className="text-lg text-muted-foreground">{mockData.series.englishTitle}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{mockData.series.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {mockData.series.releaseYear}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {mockData.series.status}
                      </div>
                      <div className="flex items-center gap-1">
                        <Play className="h-4 w-4" />
                        第 {currentEpisode} 集 / 共 {mockData.series.totalEpisodes} 集
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 max-w-xs">
                    {mockData.series.tags.map((tag, index) => (
                      <Badge key={tag} variant="outline" className={`
                        ${index === 0 ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/50 dark:border-red-800 dark:text-red-400' : ''}
                        ${index === 1 ? 'bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-950/50 dark:border-yellow-800 dark:text-yellow-400' : ''}
                        ${index === 2 ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-400' : ''}
                        ${index === 3 ? 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950/50 dark:border-purple-800 dark:text-purple-400' : ''}
                        ${index === 4 ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950/50 dark:border-green-800 dark:text-green-400' : ''}
                      `}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="info">剧集信息</TabsTrigger>
                    <TabsTrigger value="cast">演员表</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="info" className="mt-6 space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2 text-lg">剧情简介</h3>
                      <p className="text-muted-foreground leading-relaxed">{mockData.series.description}</p>
                    </div>
                    <Separator />
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">导演：</span>
                          <span>{mockData.series.director}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">地区：</span>
                          <span>{mockData.series.region}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">语言：</span>
                          <span>{mockData.series.language}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">类型：</span>
                          <span>{mockData.series.genre.join(" / ")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">更新：</span>
                          <span>{mockData.series.updateTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">播放量：</span>
                          <span>{mockData.series.views}</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="cast" className="mt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {mockData.series.actors.map((actor, index) => (
                        <div key={actor} className="text-center">
                          <Avatar className="w-16 h-16 mx-auto mb-2">
                            <AvatarImage src={`https://via.placeholder.com/64x64/3b82f6/ffffff?text=${actor.charAt(0)}`} />
                            <AvatarFallback>{actor.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <p className="font-medium text-sm">{actor}</p>
                          <p className="text-xs text-muted-foreground">主演</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* 右侧集数选择器 */}
          <div className="lg:col-span-1 xl:col-span-1">
            <Card className="sticky top-24 border-2 border-border/50 shadow-lg min-w-0">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Play className="h-5 w-5 text-primary" />
                  选集播放
                </CardTitle>
                <CardDescription className="flex items-center justify-between">
                  <span>共 {mockData.series.totalEpisodes} 集</span>
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400">
                    {mockData.series.status}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="px-4 pb-2">
                  <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-2 text-center">
                    正在播放：第 {currentEpisode} 集
                  </div>
                </div>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2 p-4 pt-2">
                    {mockData.episodes.map((episode) => (
                      <div
                        key={episode.id}
                        className={`relative group rounded-lg border-2 transition-all duration-300 hover:shadow-md ${
                          currentEpisode === episode.episode 
                            ? "border-primary bg-primary/5 shadow-lg" 
                            : "border-transparent hover:border-accent bg-card hover:bg-accent/5"
                        }`}
                      >
                        <Button
                          variant="ghost"
                          className="w-full h-auto p-0 rounded-lg overflow-hidden min-w-0"
                          onClick={() => handleEpisodeChange(episode.episode)}
                        >
                          <div className="w-full p-3 min-w-0">
                            {/* 顶部信息栏 */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                  currentEpisode === episode.episode 
                                    ? "bg-primary text-primary-foreground" 
                                    : "bg-muted text-muted-foreground group-hover:bg-accent group-hover:text-accent-foreground"
                                }`}>
                                  {episode.episode}
                                </div>
                                <span className="text-xs font-medium truncate">第 {episode.episode} 集</span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                {episode.isVip && (
                                  <Crown className="h-3 w-3 text-yellow-500" />
                                )}
                                <span className="text-xs text-muted-foreground">{episode.duration}</span>
                              </div>
                            </div>
                            
                            {/* 标题 */}
                            <h4 className="text-xs font-medium text-left line-clamp-1 mb-1">
                              {episode.title.replace(`第${episode.episode}集：`, "")}
                            </h4>
                            
                            {/* 描述 */}
                            <p className="text-xs text-left text-muted-foreground line-clamp-1 leading-relaxed">
                              {episode.description}
                            </p>
                            
                            {/* 底部状态栏 */}
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30">
                              <div className="flex items-center gap-1">
                                {currentEpisode === episode.episode ? (
                                  <>
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">正在播放</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">未观看</span>
                                  </>
                                )}
                              </div>
                              {episode.isVip && (
                                <Badge variant="outline" className="text-xs h-4 px-1 bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-950/50 dark:border-yellow-800 dark:text-yellow-400">
                                  VIP
                                </Badge>
                              )}
                            </div>
                          </div>
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                {/* 底部统计信息 */}
                <div className="p-4 border-t border-border/50 bg-muted/20">
                  <div className="text-xs text-muted-foreground text-center space-y-1">
                    <div className="flex items-center justify-between">
                      <span>观看进度</span>
                      <span>{currentEpisode} / {mockData.series.totalEpisodes}</span>
                    </div>
                    <Progress value={(currentEpisode / mockData.series.totalEpisodes) * 100} className="h-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 底部控制栏 */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border/50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentEpisode <= 1}
                  onClick={() => handleEpisodeChange(currentEpisode - 1)}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  上一集
                </Button>
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-md border border-primary/20">
                  <Play className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">第 {currentEpisode} 集</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentEpisode >= mockData.series.totalEpisodes}
                  onClick={() => handleEpisodeChange(currentEpisode + 1)}
                  className="gap-2"
                >
                  下一集
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Volume2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 底部留白避免内容被固定栏遮挡 */}
      <div className="h-20"></div>
    </div>
  );
}