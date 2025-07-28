export interface Admin {
  id: number;
  username: string;
  created_at: string;
}

export interface Series {
  id: number;
  title: string;
  description: string;
  cover_image?: string;
  created_at: string;
}

export interface Episode {
  id: number;
  series_id: number;
  episode_number: number;
  title: string;
  video_url: string;
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface CreateSeriesRequest {
  title: string;
  description: string;
  cover_image?: string;
}

export interface CreateEpisodeRequest {
  series_id: number;
  episode_number: number;
  title: string;
  video_url: string;
}