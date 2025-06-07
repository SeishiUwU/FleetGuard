import fs from 'fs';
import path from 'path';
import { VideoFile } from '../types';

export class VideoService {
  private videosPath: string;
  private supportedFormats = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'];

  constructor(videosPath: string = './videos') {
    this.videosPath = path.resolve(videosPath);
    this.ensureVideoDirectory();
  }

  private ensureVideoDirectory(): void {
    if (!fs.existsSync(this.videosPath)) {
      fs.mkdirSync(this.videosPath, { recursive: true });
    }
  }

  private isVideoFile(filename: string): boolean {
    const ext = path.extname(filename).toLowerCase();
    return this.supportedFormats.includes(ext);
  }

  async getAllVideos(): Promise<VideoFile[]> {
    try {
      const files = await fs.promises.readdir(this.videosPath);
      const videoFiles: VideoFile[] = [];

      for (const filename of files) {
        if (this.isVideoFile(filename)) {
          const filePath = path.join(this.videosPath, filename);
          const stats = await fs.promises.stat(filePath);
          
          const videoFile: VideoFile = {
            id: this.generateId(filename),
            filename,
            originalName: filename,
            path: filePath,
            size: stats.size,
            createdAt: stats.birthtime,
            mimeType: this.getMimeType(filename)
          };

          videoFiles.push(videoFile);
        }
      }

      return videoFiles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      throw new Error(`Failed to read video directory: ${error}`);
    }
  }

  async getVideoById(id: string): Promise<VideoFile | null> {
    const videos = await this.getAllVideos();
    return videos.find(video => video.id === id) || null;
  }

  async getVideoStream(id: string): Promise<{ filePath: string; stats: fs.Stats } | null> {
    const video = await this.getVideoById(id);
    if (!video) return null;

    const stats = await fs.promises.stat(video.path);
    return { filePath: video.path, stats };
  }

  private generateId(filename: string): string {
    return Buffer.from(filename).toString('base64').replace(/[^a-zA-Z0-9]/g, '');
  }

  private getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      '.mp4': 'video/mp4',
      '.avi': 'video/x-msvideo',
      '.mov': 'video/quicktime',
      '.wmv': 'video/x-ms-wmv',
      '.flv': 'video/x-flv',
      '.webm': 'video/webm',
      '.mkv': 'video/x-matroska'
    };
    return mimeTypes[ext] || 'video/mp4';
  }
}