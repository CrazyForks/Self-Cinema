"use client";

import { useEffect, useRef, useState } from "react";
import "plyr/dist/plyr.css";
import { saveProgress, getProgress } from "@/lib/progress";
import { ErrorBoundary } from "./error-boundary";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoplay?: boolean;
  episodeId?: string;
}

function VideoPlayerCore({ src, poster, autoplay = false, episodeId }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<unknown | null>(null);
  const hlsRef = useRef<unknown | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!videoRef.current || typeof window === 'undefined') return;
    if (!src) {
      setError('没有提供视频源');
      setErrorDetails('视频源URL为空或未定义');
      setIsLoading(false);
      return;
    }

    console.log('VideoPlayer useEffect triggered - src:', src);
    setError(null);
    setErrorDetails(null);
    setIsLoading(true);

    const initializePlayer = async () => {
      try {
        console.log('开始初始化播放器，视频源:', src);

        const video = videoRef.current!;

        // 清理之前的实例
        if (playerRef.current) {
          console.log('销毁之前的播放器实例');
          try {
            (playerRef.current as { destroy(): void }).destroy();
          } catch (e) {
            console.warn('销毁播放器时出错:', e);
          }
          playerRef.current = null;
        }
        if (hlsRef.current) {
          console.log('销毁之前的HLS实例');
          try {
            (hlsRef.current as { destroy(): void }).destroy();
          } catch (e) {
            console.warn('销毁HLS时出错:', e);
          }
          hlsRef.current = null;
        }

        // 重置video元素
        video.src = '';
        video.load();

        // 动态导入 Plyr
        const { default: Plyr } = await import('plyr');
        console.log('Plyr 导入成功');

        // 检查是否是 HLS 流
        const isHLS = src.includes('.m3u8');
        console.log('是否为HLS:', isHLS);

        if (isHLS) {
          try {
            const { default: Hls } = await import('hls.js');

            if (Hls.isSupported()) {
              console.log('HLS 支持检测通过');
              const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90,
              });

              hls.loadSource(src);
              hls.attachMedia(video);

              hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log('HLS manifest loaded');
              });

              hls.on(Hls.Events.ERROR, (_event: unknown, data: { details: string; fatal: boolean; type: unknown }) => {
                console.error('HLS error:', data);
                const errorMsg = `HLS错误: ${data.details}`;
                setError(errorMsg);
                setErrorDetails(`错误类型: ${String(data.type)}, 详情: ${data.details}, 致命错误: ${data.fatal}`);
                if (data.fatal) {
                  switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                      hls.startLoad();
                      break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                      hls.recoverMediaError();
                      break;
                    default:
                      hls.destroy();
                      break;
                  }
                }
              });

              hlsRef.current = hls;
            } else {
              console.log('浏览器不支持 HLS，使用直接源');
              video.src = src;
            }
          } catch {
            console.warn('HLS.js not available, using direct video source');
            video.src = src;
          }
        } else {
          console.log('设置直接视频源:', src);
          video.src = src;
        }

        console.log('开始初始化 Plyr');

        // 等待一小段时间确保video源设置完成
        await new Promise(resolve => setTimeout(resolve, 100));

        // 检测是否为移动端
        const isMobile = window.innerWidth <= 768;
        
        // 根据设备类型配置控制栏
        const mobileControls = [
          'play-large',
          'play',
          'progress',
          'current-time',
          'mute',
          'fullscreen'
        ];
        
        const desktopControls = [
          'play-large',
          'rewind',
          'play',
          'fast-forward',
          'progress',
          'current-time',
          'duration',
          'mute',
          'volume',
          'settings',
          'pip',
          'fullscreen'
        ];

        // 初始化 Plyr 播放器
        const player = new Plyr(video, {
          controls: isMobile ? mobileControls : desktopControls,
          settings: ['quality', 'speed'],
          speed: {
            selected: 1,
            options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
          },
          ratio: '16:9',
          fullscreen: {
            enabled: true,
            fallback: true,
            iosNative: true
          },
          storage: {
            enabled: true,
            key: 'self-cinema-player'
          },
          keyboard: {
            focused: true,
            global: false
          },
          tooltips: {
            controls: true,
            seek: true
          },
          hideControls: true,
          autoplay: autoplay,
          autopause: true,
          seekTime: 10,
          volume: 1,
          muted: false,
          clickToPlay: true,
          disableContextMenu: false,
          // 强制使用内置 SVG 图标
          iconUrl: 'https://npm.onmicrosoft.cn/plyr@3.7.8/dist/plyr.svg',
          // 确保图标正确渲染
          blankVideo: 'https://cdn.plyr.io/static/blank.mp4'
        });

        console.log('Plyr 实例创建完成');

        // 事件监听
        player.on('ready', () => {
          console.log('播放器已准备就绪');
          setIsLoading(false);
          
          // 恢复播放进度
          if (episodeId) {
            const savedProgress = getProgress(episodeId);
            if (savedProgress && savedProgress.currentTime > 10) {
              console.log(`恢复播放进度: ${savedProgress.currentTime}s`);
              (player as unknown as { currentTime: number }).currentTime = savedProgress.currentTime;
            }
          }
        });

        player.on('canplay', () => {
          console.log('视频可以播放');
          setIsLoading(false);
        });

        player.on('loadeddata', () => {
          console.log('视频数据已加载');
        });

        // 播放进度监听
        player.on('timeupdate', () => {
          if (episodeId && (player as unknown as { duration: number; currentTime: number }).duration > 0) {
            // 每5秒保存一次进度
            if (progressTimerRef.current) {
              clearTimeout(progressTimerRef.current);
            }
            progressTimerRef.current = setTimeout(() => {
              const playerInstance = player as unknown as { duration: number; currentTime: number };
              saveProgress(episodeId, playerInstance.currentTime, playerInstance.duration);
            }, 1000);
          }
        });

        // 播放结束时标记为已完成
        player.on('ended', () => {
          if (episodeId) {
            const playerInstance = player as unknown as { duration: number };
            saveProgress(episodeId, playerInstance.duration, playerInstance.duration);
          }
        });

        player.on('error', (event: unknown) => {
          console.error('播放器错误:', event);
          const errorMsg = 'Plyr播放器错误';
          setError(errorMsg);
          setErrorDetails(event ? String(event) : '未知播放器错误');
          setIsLoading(false);
        });

        // 监听原生视频错误
        video.addEventListener('error', (e) => {
          console.error('视频元素错误:', e);
          const target = e.target as HTMLVideoElement;
          const errorCode = target?.error?.code;
          const errorMsg = '视频加载失败';
          let errorDetail = '未知视频错误';
          
          if (errorCode) {
            switch (errorCode) {
              case 1:
                errorDetail = 'MEDIA_ERR_ABORTED: 视频加载被中止';
                break;
              case 2:
                errorDetail = 'MEDIA_ERR_NETWORK: 网络错误导致视频下载失败';
                break;
              case 3:
                errorDetail = 'MEDIA_ERR_DECODE: 视频解码错误';
                break;
              case 4:
                errorDetail = 'MEDIA_ERR_SRC_NOT_SUPPORTED: 视频格式不支持或源不可用';
                break;
              default:
                errorDetail = `未知错误码: ${errorCode}`;
            }
          }
          
          setError(errorMsg);
          setErrorDetails(errorDetail);
          setIsLoading(false);
        });

        playerRef.current = player;
        console.log('播放器初始化完成');

      } catch (error) {
        console.error('播放器初始化失败:', error);
        const errorMsg = '播放器初始化失败';
        let errorDetail = '未知初始化错误';
        
        if (error instanceof Error) {
          errorDetail = `${error.name}: ${error.message}`;
          if (error.stack) {
            errorDetail += `\n堆栈信息: ${error.stack.split('\n').slice(0, 3).join('\n')}`;
          }
        } else {
          errorDetail = String(error);
        }
        
        setError(errorMsg);
        setErrorDetails(errorDetail);
        setIsLoading(false);

        // 降级到原生视频播放器
        if (videoRef.current) {
          console.log('降级到原生播放器');
          try {
            videoRef.current.src = src;
            videoRef.current.controls = true;
          } catch (fallbackError) {
            console.error('原生播放器降级也失败:', fallbackError);
            setErrorDetails(errorDetail + `\n原生播放器降级失败: ${String(fallbackError)}`);
          }
        }
      }
    };

    initializePlayer();

    // 清理函数
    return () => {
      console.log('VideoPlayer 组件清理');
      
      // 清理进度保存定时器
      if (progressTimerRef.current) {
        clearTimeout(progressTimerRef.current);
        progressTimerRef.current = null;
      }
      
      if (playerRef.current) {
        try {
          (playerRef.current as { destroy(): void }).destroy();
        } catch (e) {
          console.warn('播放器销毁时出现警告:', e);
        }
        playerRef.current = null;
      }
      if (hlsRef.current) {
        try {
          (hlsRef.current as { destroy(): void }).destroy();
        } catch (e) {
          console.warn('HLS销毁时出现警告:', e);
        }
        hlsRef.current = null;
      }
    };
  }, [src, autoplay, episodeId]);

  if (error) {
    return (
      <div className="relative w-full h-full bg-black rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center text-white p-8 max-w-2xl">
          <div className="text-red-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-4">播放器组件错误</h3>
          
          {/* 错误信息展示 */}
          <div className="mb-6 p-4 bg-red-900/30 rounded-lg border border-red-500/30 text-left">
            <div className="mb-3">
              <span className="text-sm font-semibold text-red-300">错误信息：</span>
              <p className="text-sm text-red-100 mt-1 font-mono bg-red-900/50 p-2 rounded break-words">
                {error}
              </p>
            </div>
            
            {errorDetails && (
              <div className="mb-3">
                <span className="text-sm font-semibold text-red-300">详细信息：</span>
                <p className="text-sm text-red-100 mt-1 font-mono bg-red-900/50 p-2 rounded break-words whitespace-pre-wrap">
                  {errorDetails}
                </p>
              </div>
            )}
            
            <div>
              <span className="text-sm font-semibold text-red-300">视频源：</span>
              <p className="text-sm text-red-100 mt-1 font-mono bg-red-900/50 p-2 rounded break-all">
                {src}
              </p>
            </div>
          </div>
          
          <div className="text-xs text-gray-400 space-y-1">
            <p>• 请检查视频文件是否存在且格式正确</p>
            <p>• 支持的格式：MP4, MKV, M3U8</p>
            <p>• 如问题持续，请联系管理员</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-sm">正在加载播放器...</p>
          </div>
        </div>
      )}
      <video
        ref={videoRef}
        className="w-full h-full"
        crossOrigin="anonymous"
        playsInline
        poster={poster}
        preload="metadata"
        style={{ aspectRatio: '16/9' }}
      >
        <track kind="captions" label="中文" srcLang="zh" />
        您的浏览器不支持视频播放。请更新浏览器或使用其他浏览器。
      </video>
    </div>
  );
}

// 用 ErrorBoundary 包装的 VideoPlayer 组件
export function VideoPlayer(props: VideoPlayerProps) {
  return (
    <ErrorBoundary>
      <VideoPlayerCore {...props} />
    </ErrorBoundary>
  );
}