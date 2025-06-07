import express from 'express';
import cors from 'cors';
import path from 'path';
import videoRoutes from './routes/videoRoutes';
import { errorHandler, notFound } from './middleware';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from videos directory
app.use('/static/videos', express.static(path.join(__dirname, '../videos')));

// Routes
app.use('/api/videos', videoRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Videos directory: ${path.resolve('./videos')}`);
});

export default app;