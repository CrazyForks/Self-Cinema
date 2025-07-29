"use client";

import { useEffect, useRef } from "react";

interface PlyrComponentProps {
  src: string;
  poster?: string;
  autoplay?: boolean;
}

export default function PlyrComponent({ src, poster, autoplay = false }: PlyrComponentProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const hlsRef = useRef<any>(null);

  useEffect(() => {
    if (!videoRef.current || typeof window === 'undefined') return;

    const initializePlayer = async () => {
      try {
        // 动态导入Plyr和HLS
        const [{ default: Plyr }, { default: Hls }] = await Promise.all([
          import('plyr'),
          import('hls.js')
        ]);

        // 导入CSS
        await import('plyr/dist/plyr.css');

        const video = videoRef.current!;
        
        // 清理之前的实例
        if (playerRef.current) {
          playerRef.current.destroy();
        }
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }

        // 检查是否是 HLS 流
        const isHLS = src.includes('.m3u8');
        
        if (isHLS && Hls.isSupported()) {
          // 设置 HLS
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
          
          hls.on(Hls.Events.ERROR, (event: any, data: any) => {
            console.error('HLS error:', data);
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
          // 直接设置视频源
          video.src = src;
        }

        // 配置 Plyr 播放器
        const player = new Plyr(video, {
          controls: [
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
          ],
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
          disableContextMenu: false
        });

        // 应用自定义主题
        const container = player.elements.container;
        if (container) {
          container.style.setProperty('--plyr-color-main', 'hsl(var(--primary))');
          container.style.setProperty('--plyr-video-background', 'hsl(var(--background))');
        }

        // 事件监听
        player.on('ready', () => {
          console.log('播放器已准备就绪');
        });

        player.on('canplay', () => {
          console.log('视频可以播放');
        });

        player.on('error', (error: any) => {
          console.error('播放器错误:', error);
        });

        playerRef.current = player;

      } catch (error) {
        console.error('播放器初始化失败:', error);
        // 降级到原生视频播放器
        if (videoRef.current) {
          videoRef.current.src = src;
          videoRef.current.controls = true;
        }
      }
    };

    initializePlayer();

    // 清理函数
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.warn('播放器销毁时出现警告:', e);
        }
        playerRef.current = null;
      }
      if (hlsRef.current) {
        try {
          hlsRef.current.destroy();
        } catch (e) {
          console.warn('HLS销毁时出现警告:', e);
        }
        hlsRef.current = null;
      }
    };
  }, [src, autoplay]);

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
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