import { Router } from 'express';
import { VideoController } from '../controllers/videoController';

const router = Router();
const videoController = new VideoController();

// Get all videos
router.get('/', videoController.getAllVideos.bind(videoController));

// Get video by ID
router.get('/:id', videoController.getVideoById.bind(videoController));

// Stream video by ID
router.get('/:id/stream', videoController.streamVideo.bind(videoController));

export default router;