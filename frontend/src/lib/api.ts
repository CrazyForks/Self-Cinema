import axios, { AxiosInstance } from 'axios';
import { LoginRequest, LoginResponse, Series, Episode, CreateSeriesRequest, CreateEpisodeRequest } from '@/types';

class ApiClient {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async getSeries(): Promise<Series[]> {
    const response = await this.api.get('/series');
    return response.data;
  }

  async createSeries(data: CreateSeriesRequest): Promise<Series> {
    const response = await this.api.post('/series', data);
    return response.data;
  }

  async updateSeries(id: number, data: Partial<CreateSeriesRequest>): Promise<Series> {
    const response = await this.api.put(`/series/${id}`, data);
    return response.data;
  }

  async deleteSeries(id: number): Promise<void> {
    await this.api.delete(`/series/${id}`);
  }

  async getEpisodes(seriesId: number): Promise<Episode[]> {
    const response = await this.api.get(`/series/${seriesId}/episodes`);
    return response.data;
  }

  async createEpisode(data: CreateEpisodeRequest): Promise<Episode> {
    const response = await this.api.post('/episodes', data);
    return response.data;
  }

  async updateEpisode(id: number, data: Partial<CreateEpisodeRequest>): Promise<Episode> {
    const response = await this.api.put(`/episodes/${id}`, data);
    return response.data;
  }

  async deleteEpisode(id: number): Promise<void> {
    await this.api.delete(`/episodes/${id}`);
  }

  async getShareLink(seriesId: number): Promise<{ share_url: string }> {
    const response = await this.api.get(`/series/${seriesId}/share`);
    return response.data;
  }
}

export const apiClient = new ApiClient();