export interface VideoFile {
  id: string;
  filename: string;
  originalName: string;
  path: string;
  size: number;
  duration?: number;
  thumbnail?: string;
  createdAt: Date;
  mimeType: string;
}

export interface VideoResponse {
  success: boolean;
  data?: VideoFile | VideoFile[];
  message?: string;
  error?: string;
}