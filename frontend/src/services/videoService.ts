export interface VideoFile {
  id: string;
  filename: string;
  originalName: string;
  path: string;
  size: number;
  duration?: number;
  thumbnail?: string;
  createdAt: string;
  mimeType: string;
}

export interface VideoResponse {
  success: boolean;
  data?: VideoFile | VideoFile[];
  message?: string;
  error?: string;
}

class VideoApiService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3001') {
    this.baseUrl = baseUrl;
  }

  async getAllVideos(): Promise<VideoFile[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/videos`);
      const data: VideoResponse = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
      
      throw new Error(data.error || 'Failed to fetch videos');
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }
  }

  async getVideoById(id: string): Promise<VideoFile | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/videos/${id}`);
      const data: VideoResponse = await response.json();
      
      if (data.success && data.data && !Array.isArray(data.data)) {
        return data.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching video:', error);
      return null;
    }
  }

  getVideoStreamUrl(id: string): string {
    return `${this.baseUrl}/api/videos/${id}/stream`;
  }

  formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

export const videoApiService = new VideoApiService();