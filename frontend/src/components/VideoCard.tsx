import React, { useState } from 'react';
import { Play, Calendar, HardDrive, Eye } from 'lucide-react';
import { VideoFile, videoApiService } from '../services/videoService';

interface VideoCardProps {
  video: VideoFile;
  onPlay: (video: VideoFile) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onPlay }) => {
  const [imageError, setImageError] = useState(false);

  const handlePlayClick = () => {
    onPlay(video);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Video Thumbnail */}
      <div className="relative aspect-video bg-gray-900 group cursor-pointer" onClick={handlePlayClick}>
        {!imageError ? (
          <video 
            className="w-full h-full object-cover"
            src={videoApiService.getVideoStreamUrl(video.id)}
            onError={() => setImageError(true)}
            muted
            preload="metadata"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <div className="text-center text-white">
              <div className="w-16 h-16 mx-auto mb-2 bg-gray-700 rounded-lg flex items-center justify-center">
                <Play className="w-8 h-8" />
              </div>
              <p className="text-sm opacity-75">Video Preview</p>
            </div>
          </div>
        )}
        
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
          <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Play className="w-8 h-8 text-gray-800 ml-1" />
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-2 truncate">
          {video.originalName}
        </h3>
        
        <div className="flex items-center text-sm text-gray-500 space-x-4 mb-3">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{videoApiService.formatDate(video.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <HardDrive className="w-4 h-4" />
            <span>{videoApiService.formatFileSize(video.size)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handlePlayClick}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>Play</span>
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200 flex items-center justify-center">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};