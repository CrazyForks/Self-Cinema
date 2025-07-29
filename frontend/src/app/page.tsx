import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { DotPattern } from "@/components/dot-pattern";
import { Play, Settings, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <DotPattern />
      
      <div className="absolute top-4 right-4 z-100">
        <ThemeToggle />
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 relative">
            <Sparkles className="absolute -top-4 -left-4 h-8 w-8 text-primary/60 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent animate-in slide-in-from-bottom duration-1000">
              Self Cinema
            </h1>
            <Sparkles className="absolute -bottom-4 -right-4 h-8 w-8 text-purple-500/60 animate-pulse delay-500" />
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 animate-in slide-in-from-bottom duration-1000 delay-200">
            私人影院系统 - 享受专属的观影体验
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:scale-105 animate-in slide-in-from-left duration-1000 delay-300 border-2 hover:border-primary/50">
              <CardHeader className="relative">
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full animate-pulse" />
                <div className="flex items-center gap-2">
                  <Settings className="h-6 w-6 text-primary" />
                  <CardTitle className="group-hover:text-primary transition-colors">管理后台</CardTitle>
                </div>
                <CardDescription>
                  管理电视剧和剧集，创建分享链接
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/login">
                  <Button className="w-full group-hover:bg-primary/90 transition-all duration-300 hover:shadow-lg">
                    进入管理后台
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:scale-105 animate-in slide-in-from-right duration-1000 delay-300 border-2 hover:border-blue-500/50">
              <CardHeader className="relative">
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-1000" />
                <div className="flex items-center gap-2">
                  <Play className="h-6 w-6 text-blue-500" />
                  <CardTitle className="group-hover:text-blue-500 transition-colors">在线观看</CardTitle>
                </div>
                <CardDescription>
                  通过分享链接观看精彩内容
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full group-hover:border-blue-500/50 transition-all duration-300" disabled>
                  需要分享链接
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="backdrop-blur-sm bg-background/50 rounded-lg p-6 border border-border/50 animate-in slide-in-from-bottom duration-1000 delay-500">
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                支持 MP4、MKV、M3U8 等多种视频格式
              </p>
              <p className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-500" />
                完美适配桌面端和移动端
              </p>
              <p className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-1000" />
                现代化界面设计，优质观影体验
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
