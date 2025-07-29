"use client";

import { useEffect, useRef, useState } from "react";
import "plyr/dist/plyr.css";
import { saveProgress, getProgress } from "@/lib/progress";
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoplay?: boolean;
  episodeId?: string;
}

export function VideoPlayer({ src, poster, autoplay = false, episodeId }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<unknown | null>(null);
  const hlsRef = useRef<unknown | null>(null);
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTranscoding, setIsTranscoding] = useState(false);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 初始化FFmpeg
  const initFFmpeg = async () => {
    if (!ffmpegRef.current) {
      const ffmpeg = new FFmpeg();
      
      try {
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
        ffmpeg.on('log', ({ message }) => {
          console.log('FFmpeg log:', message);
        });
        
        await ffmpeg.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
        });
        
        ffmpegRef.current = ffmpeg;
        console.log('FFmpeg 初始化成功');
      } catch (error) {
        console.error('FFmpeg 初始化失败:', error);
        throw error;
      }
    }
    return ffmpegRef.current;
  };

  // 转码MKV为MP4
  const transcodeMKV = async (videoSrc: string): Promise<string> => {
    try {
      setIsTranscoding(true);
      console.log('开始转码MKV视频:', videoSrc);
      
      const ffmpeg = await initFFmpeg();
      
      // 下载原始MKV文件
      await ffmpeg.writeFile('input.mkv', await fetchFile(videoSrc));
      
      // 转码为MP4，保持音频轨道
      await ffmpeg.exec([
        '-i', 'input.mkv',
        '-c:v', 'copy',          // 视频编解码器复制（不重新编码）
        '-c:a', 'aac',           // 音频转为AAC（浏览器兼容）
        '-movflags', 'faststart', // 优化流媒体播放
        'output.mp4'
      ]);
      
      // 读取转码后的文件
      const data = await ffmpeg.readFile('output.mp4');
      
      // 创建Blob URL
      const blob = new Blob([data], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      
      console.log('MKV转码完成:', url);
      setIsTranscoding(false);
      
      return url;
    } catch (error) {
      console.error('MKV转码失败:', error);
      setIsTranscoding(false);
      throw error;
    }
  };

  useEffect(() => {
    if (!videoRef.current || typeof window === 'undefined') return;
    if (!src) {
      setError('没有提供视频源');
      setIsLoading(false);
      return;
    }

    console.log('VideoPlayer useEffect triggered - src:', src);
    setError(null);
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

        // 检查文件格式
        const isHLS = src.includes('.m3u8');
        const isMKV = src.toLowerCase().includes('.mkv');
        console.log('是否为HLS:', isHLS);
        console.log('是否为MKV:', isMKV);

        // 对于MKV格式，先进行转码
        if (isMKV) {
          try {
            console.log('MKV格式检测，开始转码处理');
            const transcodedUrl = await transcodeMKV(src);
            video.src = transcodedUrl;
            console.log('MKV转码完成，设置转码后的视频源');
          } catch (transcodingError) {
            console.warn('MKV转码失败，尝试直接播放:', transcodingError);
            // 转码失败时回退到直接播放
            video.crossOrigin = 'anonymous';
            video.preload = 'metadata';
            
            // 监听音频轨道
            video.addEventListener('loadedmetadata', () => {
              console.log('MKV文件元数据加载完成');
              console.log('视频轨道数:', video.videoTracks?.length || 0);
              console.log('音频轨道数:', video.audioTracks?.length || 0);
              
              // 确保音频轨道启用
              if (video.audioTracks && video.audioTracks.length > 0) {
                for (let i = 0; i < video.audioTracks.length; i++) {
                  video.audioTracks[i].enabled = true;
                  console.log(`启用音频轨道 ${i}:`, video.audioTracks[i]);
                }
              }
            });
            
            video.src = src;
          }
        } else if (isHLS) {
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
                setError(`HLS错误: ${data.details}`);
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
          blankVideo: 'https://cdn.plyr.io/static/blank.mp4',
          // 针对MKV格式优化音频处理
          ...(isMKV && {
            previewThumbnails: { enabled: false },
            captions: { active: false },
            // 确保音频处理优先级
            listeners: {
              seek: null,
              play: null,
              pause: null,
              restart: null,
              rewind: null,
              fastForward: null,
              mute: null,
              volume: null,
              captions: null,
              download: null,
              fullscreen: null,
              pip: null,
              airplay: null,
              speed: null,
              quality: null
            }
          })
        });

        console.log('Plyr 实例创建完成');

        // 事件监听
        player.on('ready', () => {
          console.log('播放器已准备就绪');
          setIsLoading(false);
          
          // 对于MKV格式，额外检查音频状态
          if (isMKV) {
            const videoElement = videoRef.current;
            if (videoElement) {
              console.log('MKV音频检查 - muted:', videoElement.muted);
              console.log('MKV音频检查 - volume:', videoElement.volume);
              
              // 确保音频未静音且音量正常
              videoElement.muted = false;
              videoElement.volume = 1;
              
              // 强制触发音频上下文（某些浏览器需要）
              const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
              if (audioContext.state === 'suspended') {
                console.log('恢复音频上下文');
                audioContext.resume();
              }
            }
          }
          
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

        player.on('error', (_event: unknown) => {
          console.error('播放器错误:', event);
          setError('播放器错误');
          setIsLoading(false);
        });

        // 监听原生视频错误
        video.addEventListener('error', (e) => {
          console.error('视频元素错误:', e);
          setError('视频加载失败');
          setIsLoading(false);
        });

        playerRef.current = player;
        console.log('播放器初始化完成');

      } catch (error) {
        console.error('播放器初始化失败:', error);
        setError(error instanceof Error ? error.message : '播放器初始化失败');
        setIsLoading(false);

        // 降级到原生视频播放器
        if (videoRef.current) {
          console.log('降级到原生播放器');
          videoRef.current.src = src;
          videoRef.current.controls = true;
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
      
      // 清理FFmpeg实例
      if (ffmpegRef.current) {
        try {
          // FFmpeg实例不需要显式销毁，只需要清空引用
          ffmpegRef.current = null;
          console.log('FFmpeg 实例已清理');
        } catch (e) {
          console.warn('FFmpeg清理时出现警告:', e);
        }
      }
    };
  }, [src, autoplay, episodeId]);

  if (error) {
    return (
      <div className="relative w-full h-full bg-black rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center text-white p-8">
          <div className="text-red-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">播放器错误</h3>
          <p className="text-sm text-gray-300 mb-4">{error}</p>
          <p className="text-xs text-gray-400">视频源: {src}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      {(isLoading || isTranscoding) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-sm">
              {isTranscoding ? '正在转码MKV视频，请稍候...' : '正在加载播放器...'}
            </p>
            {isTranscoding && (
              <p className="text-xs text-gray-400 mt-2">
                首次播放MKV需要转码处理音频兼容性
              </p>
            )}
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
        // MKV格式额外属性
        {...(src.toLowerCase().includes('.mkv') && {
          controls: false,
          muted: false,
          volume: 1.0,
          'data-setup': '{"techOrder": ["html5"]}'
        })}
      >
        <track kind="captions" label="中文" srcLang="zh" />
        您的浏览器不支持视频播放。请更新浏览器或使用其他浏览器。
      </video>
    </div>
  );
}