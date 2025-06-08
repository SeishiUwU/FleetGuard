# FleetGuard : Fleet Safety Dashboard

A comprehensive fleet safety monitoring system that uses AI-powered video analysis to detect dangerous driving behaviors in real-time. The system provides fleet managers with dashboards, alerts, and detailed analytics to improve driver safety and reduce accidents.

## 🚗 Project Overview

The Fleet Safety Dashboard is designed to monitor fleet vehicles and detect various safety incidents including:
- Phone usage while driving
- Texting while driving
- Talking to passengers
- Reaching behind while driving
- Hair and makeup activities
- Smoking detection
- Radio operation distractions

## 🏗️ Project Structure

```
d:\PFE\
├── front/
│   ├── express-video-backend/     # Backend API server
│   │   ├── src/
│   │   │   ├── app.ts            # Main Express application
│   │   │   ├── controllers/      # API controllers
│   │   │   ├── middleware/       # Express middleware
│   │   │   ├── routes/           # API routes
│   │   │   ├── services/         # Business logic services
│   │   │   └── types/            # TypeScript type definitions
│   │   ├── videos/               # Video storage directory
│   │   └── package.json
│   └── frontend/                 # React frontend application
│       ├── public/               # Static assets
│       ├── src/
│       │   ├── components/       # React components
│       │   ├── pages/            # Application pages
│       │   ├── hooks/            # Custom React hooks
│       │   ├── contexts/         # React contexts
│       │   └── services/         # API services
│       └── package.json
└── README.md                     # This file
```

## 🛠️ Technologies Used

### Backend
- **Bun** - JavaScript runtime and package manager
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **date-fns** - Date manipulation

## 🚀 Getting Started

### Prerequisites

- **Bun** (v1.0 or higher) - [Install Bun](https://bun.sh/docs/installation)
- **Git** for version control

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd PFE
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd FleetGuard/front/express-video-backend
   bun install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   bun install
   ```

### Running the Application

1. **Start the Backend Server:**
   ```bash
   cd FleetGuard/front/express-video-backend
   bun start
   # or for development with hot reload
   bun run dev
   ```
   The API will be available at `http://localhost:3000`

2. **Start the Frontend Development Server:**
   ```bash
   cd FleetGuard/front/frontend
   bun run dev
   ```
   The application will be available at `http://localhost:5173`

## 📱 Application Features

### Dashboard
- **Real-time Statistics**: Track total companies, vehicles, safety alerts, and safety scores
- **Latest Incident Video Player**: View the most recent safety incident
- **Activity Summary**: Overview of clips, incidents, and safe driving events
- **Recent Safety Alerts**: List of 10 most recent incidents with severity indicators
- **Recent Activity Grid**: Visual grid of latest video captures

### Video Management
- **Video Upload**: Upload safety incident videos
- **Video Streaming**: Stream videos directly in the browser
- **Video Metadata**: Extract company, vehicle, and incident type from filenames
- **Filtering**: Filter videos by company, vehicle, or incident type

### Safety Monitoring
- **Incident Detection**: Automatically categorize safety incidents
- **Severity Classification**: Classify incidents as critical, medium, or low severity
- **Real-time Alerts**: Immediate notifications for safety incidents
- **Trend Analysis**: Track safety metrics over time

### User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark/Light Theme**: Customizable interface themes
- **Interactive Charts**: Visual representations of safety data
- **Sidebar Navigation**: Easy navigation between different sections

## 🎯 API Endpoints

### Video APIs
- `GET /api/videos` - Retrieve all videos
- `GET /api/videos/:id` - Get specific video details
- `GET /api/videos/:id/stream` - Stream video content
- `POST /api/videos/upload` - Upload new video files
- `DELETE /api/videos/:id` - Delete specific video

### Statistics APIs
- `GET /api/stats/dashboard` - Get dashboard statistics
- `GET /api/stats/companies` - Get company-wise statistics
- `GET /api/stats/incidents` - Get incident statistics

## 📊 Video Filename Convention

Videos follow a specific naming convention for automatic parsing:
```
{company}_{vehicle}_{incident_type}_{timestamp}.{extension}

Examples:
- sntv_A_safe_driving_00-01-05.mov
- ttt_B_talking_phone_left_00-02-46.mov
- sntv_C_texting_right_00-03-15.mp4
```

**Components:**
- `company`: Company identifier (SNTV, TTT, etc.)
- `vehicle`: Vehicle identifier (A, B, C, etc.)
- `incident_type`: Type of safety incident detected
- `timestamp`: Time marker in format HH-MM-SS
- `extension`: Video file format (.mov, .mp4, etc.)

## 🔧 Configuration

### Environment Variables

Create `.env` files in both frontend and backend directories:

**Backend (.env):**
```env
PORT=3000
NODE_ENV=development
VIDEO_STORAGE_PATH=./videos
```

**Frontend (.env):**
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_TITLE=Fleet Safety Dashboard
```

### Build for Production

**Backend:**
```bash
cd FleetGuard/front/express-video-backend
bun run build
bun start
```

**Frontend:**
```bash
cd FleetGuard/front/frontend
bun run build
```

## ⚡ Why Bun?

This project uses **Bun** as the package manager and runtime for both frontend and backend:

- **⚡ Faster**: Up to 3x faster than npm/yarn for installation and execution
- **🔧 All-in-one**: Runtime, bundler, package manager, and test runner
- **🎯 Drop-in replacement**: Works with existing npm scripts and packages
- **📦 Better caching**: Improved dependency resolution and disk usage
- **🚀 Native TypeScript**: Built-in TypeScript support without compilation
- **🌟 Modern**: Built from the ground up for modern JavaScript development

### Bun Commands Used:
- **Installation**: `bun install`
- **Development**: `bun run dev`
- **Build**: `bun run build`
- **Start**: `bun start`
- **Testing**: `bun test`

## 🧪 Development

### Code Style
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

### Testing
```bash
# Run frontend tests
cd FleetGuard/front/frontend
bun test

# Run backend tests
cd FleetGuard/front/express-video-backend
bun test
```

### Development Commands
```bash
# Start both frontend and backend in development mode
# Terminal 1 - Backend
cd FleetGuard/front/express-video-backend
bun run dev

# Terminal 2 - Frontend
cd FleetGuard/front/frontend
bun run dev
```

## 📦 Deployment

### Using Docker (Recommended)

**Dockerfile for Backend:**
```dockerfile
FROM oven/bun:1 as base
WORKDIR /usr/src/app

# Install dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN bun run build

# Expose port
EXPOSE 3000

# Start application
CMD ["bun", "start"]
```

**Dockerfile for Frontend:**
```dockerfile
FROM oven/bun:1 as build
WORKDIR /usr/src/app

# Install dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy source code and build
COPY . .
RUN bun run build

# Production stage
FROM nginx:alpine
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Manual Deployment

1. **Build applications:**
   ```bash
   # Build frontend
   cd FleetGuard/front/frontend
   bun run build
   
   # Build backend
   cd FleetGuard/front/express-video-backend
   bun run build
   ```

2. **Deploy to your hosting platform** (Vercel, Netlify, DigitalOcean, etc.)

### Production Deployment with Bun

```bash
# Backend production
cd FleetGuard/front/express-video-backend
bun run build
bun start

# Frontend production build and preview
cd FleetGuard/front/frontend
bun run build
bun run preview  # For testing the production build
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Install dependencies:**
   ```bash
   # For backend
   cd FleetGuard/front/express-video-backend
   bun install
   
   # For frontend
   cd FleetGuard/front/frontend
   bun install
   ```
4. **Commit your changes:**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. **Push to the branch:**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

## 🚀 Performance Benefits

### Bun vs npm/yarn Performance:
- **Package Installation**: ~3x faster
- **Script Execution**: ~2x faster
- **Bundle Size**: Smaller due to better tree-shaking
- **Development Server**: Faster hot reload
- **TypeScript Compilation**: Native support, no additional tools needed

### Benchmarks:
```bash
# Installation time comparison (typical project):
npm install:  ~45 seconds
yarn install: ~35 seconds
bun install:  ~15 seconds

# Development server startup:
npm run dev:  ~8 seconds
bun run dev:  ~3 seconds
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the [Bun documentation](https://bun.sh/docs)

## 🔄 Version History

- **v1.0.0** - Initial release with basic dashboard and video management
- **v1.1.0** - Added real-time alerts and improved UI
- **v1.2.0** - Enhanced video streaming and analytics
- **v2.0.0** - Migrated to Bun for improved performance

## 🏆 Acknowledgments

- Built with modern React and TypeScript
- UI components from shadcn/ui
- Icons from Lucide React
- Video processing capabilities
- Real-time dashboard analytics
- Powered by Bun for lightning-fast development ⚡

---

**Made with ❤️ for Fleet Safety using Bun ⚡**

*Experience the speed of modern JavaScript development with Bun!*