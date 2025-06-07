import { Request, Response } from 'express';
import fs from 'fs';
import { VideoService } from '../services/videoService';
import { VideoResponse } from '../types';

export class VideoController {
  private videoService: VideoService;

  constructor() {
    this.videoService = new VideoService();
  }

  async getAllVideos(req: Request, res: Response): Promise<void> {
    try {
      const videos = await this.videoService.getAllVideos();
      const response: VideoResponse = {
        success: true,
        data: videos,
        message: `Found ${videos.length} videos`
      };
      res.json(response);
    } catch (error) {
      const response: VideoResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }

  async getVideoById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const video = await this.videoService.getVideoById(id);
      
      if (!video) {
        const response: VideoResponse = {
          success: false,
          error: 'Video not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: VideoResponse = {
        success: true,
        data: video
      };
      res.json(response);
    } catch (error) {
      const response: VideoResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }

  async streamVideo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const videoData = await this.videoService.getVideoStream(id);
      
      if (!videoData) {
        res.status(404).json({ success: false, error: 'Video not found' });
        return;
      }

      const { filePath, stats } = videoData;
      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
        const chunkSize = (end - start) + 1;

        const file = fs.createReadStream(filePath, { start, end });
        const head = {
          'Content-Range': `bytes ${start}-${end}/${stats.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': 'video/mp4',
        };

        res.writeHead(206, head);
        file.pipe(res);
      } else {
        const head = {
          'Content-Length': stats.size,
          'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}