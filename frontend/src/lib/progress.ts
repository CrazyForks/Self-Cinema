// 播放进度管理工具

export interface WatchProgress {
  episodeId: string;
  currentTime: number;
  duration: number;
  progress: number; // 百分比 0-100
  lastWatched: string; // ISO 时间戳
  completed: boolean; // 是否已完成（进度小于10%时视为完成）
}

const STORAGE_KEY = 'self-cinema-watch-progress';

// 获取所有播放进度
export function getAllProgress(): Record<string, WatchProgress> {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('读取播放进度失败:', error);
    return {};
  }
}

// 获取特定剧集的播放进度
export function getProgress(episodeId: string): WatchProgress | null {
  const allProgress = getAllProgress();
  return allProgress[episodeId] || null;
}

// 保存播放进度
export function saveProgress(episodeId: string, currentTime: number, duration: number): void {
  try {
    const progress = Math.min((currentTime / duration) * 100, 100);
    const completed = progress > 90; // 播放超过90%视为完成
    
    const progressData: WatchProgress = {
      episodeId,
      currentTime,
      duration,
      progress,
      lastWatched: new Date().toISOString(),
      completed
    };

    const allProgress = getAllProgress();
    allProgress[episodeId] = progressData;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
    
    console.log(`保存播放进度: ${episodeId} - ${progress.toFixed(1)}%`);
  } catch (error) {
    console.error('保存播放进度失败:', error);
  }
}

// 获取剧集播放状态
export function getEpisodeStatus(episodeId: string): 'unwatched' | 'watching' | 'completed' {
  const progress = getProgress(episodeId);
  if (!progress) return 'unwatched';
  
  if (progress.completed) return 'completed';
  if (progress.progress > 5) return 'watching'; // 播放超过5%视为观看中
  
  return 'unwatched';
}

// 清除特定剧集的播放进度
export function clearProgress(episodeId: string): void {
  try {
    const allProgress = getAllProgress();
    delete allProgress[episodeId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
  } catch (error) {
    console.error('清除播放进度失败:', error);
  }
}

// 清除所有播放进度
export function clearAllProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('清除所有播放进度失败:', error);
  }
}