'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ThemeToggle } from '@/components/theme-toggle';
import { apiClient, SeriesAPI, EpisodeAPI, CreateSeriesRequest, CreateEpisodeRequest } from '@/lib/api';
import { getToken, removeToken } from '@/lib/auth';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Share2, 
  Play, 
  Settings, 
  LogOut, 
  Film, 
  Users, 
  Clock,
  Star,
  Calendar,
  Tv,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [series, setSeries] = useState<SeriesAPI[]>([]);
  const [episodes, setEpisodes] = useState<{[key: string]: EpisodeAPI[]}>({});
  const [selectedSeries, setSelectedSeries] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 对话框状态
  const [isSeriesDialogOpen, setIsSeriesDialogOpen] = useState(false);
  const [isEpisodeDialogOpen, setIsEpisodeDialogOpen] = useState(false);
  const [editingSeries, setEditingSeries] = useState<SeriesAPI | null>(null);
  const [editingEpisode, setEditingEpisode] = useState<EpisodeAPI | null>(null);

  // 表单状态
  const [seriesForm, setSeriesForm] = useState<CreateSeriesRequest>({
    title: '',
    englishTitle: '',
    description: '',
    coverImage: '',
    backdropImage: '',
    totalEpisodes: 0,
    releaseYear: new Date().getFullYear(),
    genre: [],
    rating: 0,
    views: '0',
    status: '待播出',
    director: '',
    actors: [],
    region: '中国大陆',
    language: '普通话',
    updateTime: '',
    tags: []
  });

  const [episodeForm, setEpisodeForm] = useState<CreateEpisodeRequest>({
    series_id: '',
    episode: 1,
    title: '',
    description: '',
    videoUrl: '',
    duration: '',
    cover_image: '',
    isVip: false
  });

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const seriesData = await apiClient.getSeries();
      setSeries(seriesData);
      
      // 获取每个电视剧的剧集
      const episodesData: {[key: string]: EpisodeAPI[]} = {};
      for (const s of seriesData) {
        try {
          const eps = await apiClient.getEpisodes(s.id);
          episodesData[s.id] = eps;
        } catch (err) {
          console.error(`Failed to fetch episodes for series ${s.id}:`, err);
          episodesData[s.id] = [];
        }
      }
      setEpisodes(episodesData);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('获取数据失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    router.push('/admin/login');
  };

  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 3000);
  };

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(''), 3000);
  };

  // 电视剧相关操作
  const handleCreateSeries = async () => {
    try {
      await apiClient.createSeries(seriesForm);
      showSuccess('电视剧创建成功');
      setIsSeriesDialogOpen(false);
      resetSeriesForm();
      fetchData();
    } catch (err) {
      showError('创建失败');
    }
  };

  const handleUpdateSeries = async () => {
    if (!editingSeries) return;
    try {
      await apiClient.updateSeries(editingSeries.id, seriesForm);
      showSuccess('电视剧更新成功');
      setIsSeriesDialogOpen(false);
      setEditingSeries(null);
      resetSeriesForm();
      fetchData();
    } catch (err) {
      showError('更新失败');
    }
  };

  const handleDeleteSeries = async (id: string) => {
    if (!confirm('确定删除此电视剧吗？此操作将同时删除所有相关剧集。')) return;
    try {
      await apiClient.deleteSeries(id);
      showSuccess('电视剧删除成功');
      fetchData();
    } catch (err) {
      showError('删除失败');
    }
  };

  const handleShareSeries = async (id: string) => {
    try {
      const response = await apiClient.createShareLink(id);
      navigator.clipboard.writeText(response.shareUrl);
      showSuccess('分享链接已复制到剪贴板');
    } catch (err) {
      showError('生成分享链接失败');
    }
  };

  // 剧集相关操作
  const handleCreateEpisode = async () => {
    try {
      await apiClient.createEpisode(episodeForm);
      showSuccess('剧集创建成功');
      setIsEpisodeDialogOpen(false);
      resetEpisodeForm();
      fetchData();
    } catch (err) {
      showError('创建失败');
    }
  };

  const handleUpdateEpisode = async () => {
    if (!editingEpisode) return;
    try {
      await apiClient.updateEpisode(editingEpisode.id, episodeForm);
      showSuccess('剧集更新成功');
      setIsEpisodeDialogOpen(false);
      setEditingEpisode(null);
      resetEpisodeForm();
      fetchData();
    } catch (err) {
      showError('更新失败');
    }
  };

  const handleDeleteEpisode = async (id: string) => {
    if (!confirm('确定删除此剧集吗？')) return;
    try {
      await apiClient.deleteEpisode(id);
      showSuccess('剧集删除成功');
      fetchData();
    } catch (err) {
      showError('删除失败');
    }
  };

  // 表单重置
  const resetSeriesForm = () => {
    setSeriesForm({
      title: '',
      englishTitle: '',
      description: '',
      coverImage: '',
      backdropImage: '',
      totalEpisodes: 0,
      releaseYear: new Date().getFullYear(),
      genre: [],
      rating: 0,
      views: '0',
      status: '待播出',
      director: '',
      actors: [],
      region: '中国大陆',
      language: '普通话',
      updateTime: '',
      tags: []
    });
  };

  const resetEpisodeForm = () => {
    setEpisodeForm({
      series_id: selectedSeries,
      episode: 1,
      title: '',
      description: '',
      videoUrl: '',
      duration: '',
      cover_image: '',
      isVip: false
    });
  };

  // 编辑操作
  const startEditSeries = (s: SeriesAPI) => {
    setEditingSeries(s);
    setSeriesForm({
      title: s.title,
      englishTitle: s.englishTitle || '',
      description: s.description || '',
      coverImage: s.coverImage || '',
      backdropImage: s.backdropImage || '',
      totalEpisodes: s.totalEpisodes,
      releaseYear: s.releaseYear || new Date().getFullYear(),
      genre: s.genre,
      rating: s.rating,
      views: s.views,
      status: s.status,
      director: s.director || '',
      actors: s.actors,
      region: s.region || '中国大陆',
      language: s.language || '普通话',
      updateTime: s.updateTime || '',
      tags: s.tags
    });
    setIsSeriesDialogOpen(true);
  };

  const startEditEpisode = (ep: EpisodeAPI) => {
    setEditingEpisode(ep);
    setEpisodeForm({
      series_id: ep.series_id,
      episode: ep.episode,
      title: ep.title,
      description: ep.description || '',
      videoUrl: ep.videoUrl,
      duration: ep.duration || '',
      cover_image: ep.cover_image || '',
      isVip: ep.isVip
    });
    setIsEpisodeDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">风</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Self Cinema 管理后台</h1>
                <p className="text-sm text-muted-foreground">电视剧与剧集管理系统</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                退出登录
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* 消息提示 */}
        {success && (
          <Alert className="mb-4 border-green-200 bg-green-50 dark:bg-green-950/20">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-400">{success}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="flex items-center p-6">
              <Tv className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">{series.length}</p>
                <p className="text-sm text-muted-foreground">电视剧总数</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Play className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">
                  {Object.values(episodes).reduce((total, eps) => total + eps.length, 0)}
                </p>
                <p className="text-sm text-muted-foreground">剧集总数</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Users className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">
                  {series.filter(s => s.status === '已完结').length}
                </p>
                <p className="text-sm text-muted-foreground">已完结</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Clock className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">
                  {series.filter(s => s.status === '更新中').length}
                </p>
                <p className="text-sm text-muted-foreground">更新中</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主要内容 */}
        <Tabs defaultValue="series" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="series">电视剧管理</TabsTrigger>
            <TabsTrigger value="episodes">剧集管理</TabsTrigger>
          </TabsList>

          {/* 电视剧管理 */}
          <TabsContent value="series" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">电视剧列表</h2>
              <Dialog open={isSeriesDialogOpen} onOpenChange={setIsSeriesDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { resetSeriesForm(); setEditingSeries(null); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    添加电视剧
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingSeries ? '编辑电视剧' : '添加新电视剧'}
                    </DialogTitle>
                    <DialogDescription>
                      请填写电视剧的详细信息
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">剧集标题 *</Label>
                        <Input
                          id="title"
                          value={seriesForm.title}
                          onChange={(e) => setSeriesForm({...seriesForm, title: e.target.value})}
                          placeholder="输入剧集标题"
                        />
                      </div>
                      <div>
                        <Label htmlFor="englishTitle">英文标题</Label>
                        <Input
                          id="englishTitle"
                          value={seriesForm.englishTitle}
                          onChange={(e) => setSeriesForm({...seriesForm, englishTitle: e.target.value})}
                          placeholder="输入英文标题"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">剧情简介</Label>
                      <Textarea
                        id="description"
                        value={seriesForm.description}
                        onChange={(e) => setSeriesForm({...seriesForm, description: e.target.value})}
                        placeholder="输入剧情简介"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="director">导演</Label>
                        <Input
                          id="director"
                          value={seriesForm.director}
                          onChange={(e) => setSeriesForm({...seriesForm, director: e.target.value})}
                          placeholder="导演姓名"
                        />
                      </div>
                      <div>
                        <Label htmlFor="releaseYear">发行年份</Label>
                        <Input
                          id="releaseYear"
                          type="number"
                          value={seriesForm.releaseYear}
                          onChange={(e) => setSeriesForm({...seriesForm, releaseYear: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="totalEpisodes">总集数</Label>
                        <Input
                          id="totalEpisodes"
                          type="number"
                          value={seriesForm.totalEpisodes}
                          onChange={(e) => setSeriesForm({...seriesForm, totalEpisodes: parseInt(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="rating">评分 (0-10)</Label>
                        <Input
                          id="rating"
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={seriesForm.rating}
                          onChange={(e) => setSeriesForm({...seriesForm, rating: parseFloat(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="status">状态</Label>
                        <select
                          className="w-full px-3 py-2 border rounded-md"
                          value={seriesForm.status}
                          onChange={(e) => setSeriesForm({...seriesForm, status: e.target.value})}
                        >
                          <option value="待播出">待播出</option>
                          <option value="更新中">更新中</option>
                          <option value="已完结">已完结</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="region">地区</Label>
                        <Input
                          id="region"
                          value={seriesForm.region}
                          onChange={(e) => setSeriesForm({...seriesForm, region: e.target.value})}
                          placeholder="地区"
                        />
                      </div>
                      <div>
                        <Label htmlFor="language">语言</Label>
                        <Input
                          id="language"
                          value={seriesForm.language}
                          onChange={(e) => setSeriesForm({...seriesForm, language: e.target.value})}
                          placeholder="语言"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="actors">主演 (逗号分隔)</Label>
                      <Input
                        id="actors"
                        value={seriesForm.actors.join(', ')}
                        onChange={(e) => setSeriesForm({...seriesForm, actors: e.target.value.split(',').map(s => s.trim())})}
                        placeholder="主演1, 主演2, 主演3"
                      />
                    </div>
                    <div>
                      <Label htmlFor="genre">类型 (逗号分隔)</Label>
                      <Input
                        id="genre"
                        value={seriesForm.genre.join(', ')}
                        onChange={(e) => setSeriesForm({...seriesForm, genre: e.target.value.split(',').map(s => s.trim())})}
                        placeholder="古装, 悬疑, 历史"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tags">标签 (逗号分隔)</Label>
                      <Input
                        id="tags"
                        value={seriesForm.tags.join(', ')}
                        onChange={(e) => setSeriesForm({...seriesForm, tags: e.target.value.split(',').map(s => s.trim())})}
                        placeholder="热播, 高分, 推荐"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setIsSeriesDialogOpen(false)}>
                        取消
                      </Button>
                      <Button onClick={editingSeries ? handleUpdateSeries : handleCreateSeries}>
                        {editingSeries ? '更新' : '创建'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {series.map((s) => (
                <Card key={s.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{s.title}</h3>
                          {s.englishTitle && (
                            <span className="text-sm text-muted-foreground">({s.englishTitle})</span>
                          )}
                          <Badge variant={s.status === '已完结' ? 'default' : s.status === '更新中' ? 'secondary' : 'outline'}>
                            {s.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {s.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {s.releaseYear}
                          </div>
                          <div className="flex items-center gap-1">
                            <Play className="h-4 w-4" />
                            {s.totalEpisodes} 集
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            {s.rating}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {episodes[s.id]?.length || 0} 已添加
                          </div>
                        </div>
                        {s.genre.length > 0 && (
                          <div className="flex gap-1 mt-3">
                            {s.genre.map((g, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {g}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleShareSeries(s.id)}>
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => startEditSeries(s)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteSeries(s.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 剧集管理 */}
          <TabsContent value="episodes" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">剧集管理</h2>
              <div className="flex gap-2">
                <select
                  className="px-3 py-2 border rounded-md"
                  value={selectedSeries}
                  onChange={(e) => setSelectedSeries(e.target.value)}
                >
                  <option value="">选择电视剧</option>
                  {series.map((s) => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
                <Dialog open={isEpisodeDialogOpen} onOpenChange={setIsEpisodeDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      disabled={!selectedSeries}
                      onClick={() => { 
                        resetEpisodeForm(); 
                        setEditingEpisode(null);
                        setEpisodeForm({...episodeForm, series_id: selectedSeries});
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      添加剧集
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingEpisode ? '编辑剧集' : '添加新剧集'}
                      </DialogTitle>
                      <DialogDescription>
                        请填写剧集的详细信息
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="episode">集数 *</Label>
                          <Input
                            id="episode"
                            type="number"
                            value={episodeForm.episode}
                            onChange={(e) => setEpisodeForm({...episodeForm, episode: parseInt(e.target.value)})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="duration">时长</Label>
                          <Input
                            id="duration"
                            value={episodeForm.duration}
                            onChange={(e) => setEpisodeForm({...episodeForm, duration: e.target.value})}
                            placeholder="45:30"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="episodeTitle">剧集标题 *</Label>
                        <Input
                          id="episodeTitle"
                          value={episodeForm.title}
                          onChange={(e) => setEpisodeForm({...episodeForm, title: e.target.value})}
                          placeholder="第1集：神都疑云"
                        />
                      </div>
                      <div>
                        <Label htmlFor="episodeDescription">剧集简介</Label>
                        <Textarea
                          id="episodeDescription"
                          value={episodeForm.description}
                          onChange={(e) => setEpisodeForm({...episodeForm, description: e.target.value})}
                          placeholder="这一集的剧情简介..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="videoUrl">视频地址 *</Label>
                        <Input
                          id="videoUrl"
                          value={episodeForm.videoUrl}
                          onChange={(e) => setEpisodeForm({...episodeForm, videoUrl: e.target.value})}
                          placeholder="https://example.com/video.mp4"
                        />
                      </div>
                      <div>
                        <Label htmlFor="coverImage">封面图片</Label>
                        <Input
                          id="coverImage"
                          value={episodeForm.cover_image}
                          onChange={(e) => setEpisodeForm({...episodeForm, cover_image: e.target.value})}
                          placeholder="https://example.com/cover.jpg"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isVip"
                          checked={episodeForm.isVip}
                          onChange={(e) => setEpisodeForm({...episodeForm, isVip: e.target.checked})}
                        />
                        <Label htmlFor="isVip">VIP专享</Label>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setIsEpisodeDialogOpen(false)}>
                          取消
                        </Button>
                        <Button onClick={editingEpisode ? handleUpdateEpisode : handleCreateEpisode}>
                          {editingEpisode ? '更新' : '创建'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {selectedSeries && episodes[selectedSeries] && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {series.find(s => s.id === selectedSeries)?.title} - 剧集列表
                  </CardTitle>
                  <CardDescription>
                    共 {episodes[selectedSeries].length} 集
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {episodes[selectedSeries].map((ep) => (
                      <div key={ep.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">第 {ep.episode} 集</Badge>
                            <h4 className="font-medium">{ep.title}</h4>
                            {ep.isVip && (
                              <Badge className="bg-yellow-500 text-yellow-50">VIP</Badge>
                            )}
                            {ep.duration && (
                              <span className="text-sm text-muted-foreground">{ep.duration}</span>
                            )}
                          </div>
                          {ep.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                              {ep.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => startEditEpisode(ep)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteEpisode(ep.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}