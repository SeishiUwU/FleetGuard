# Express Video Backend

This project is an Express.js backend application designed to serve video clips from a specified folder. It provides a simple API to retrieve video files and can be integrated with a frontend dashboard.

## Project Structure

```
express-video-backend
├── src
│   ├── app.ts                # Entry point of the application
│   ├── controllers
│   │   └── videoController.ts # Handles video-related requests
│   ├── routes
│   │   └── videoRoutes.ts     # Defines routes for video requests
│   ├── services
│   │   └── videoService.ts     # Interacts with the file system to read video files
│   ├── middleware
│   │   └── index.ts           # Middleware functions for request handling
│   └── types
│       └── index.ts           # Type definitions for the application
├── videos                     # Directory containing video files
├── package.json               # NPM configuration file
├── tsconfig.json              # TypeScript configuration file
└── README.md                  # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd express-video-backend
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the application:**
   ```
   npm start
   ```

4. **Access the API:**
   The API will be available at `http://localhost:3000/videos` to retrieve the list of video clips.

## Usage

- The application reads video files from the `videos` directory.
- You can extend the functionality by adding more routes or services as needed.

## Contributing

Feel free to submit issues or pull requests to enhance the functionality of this project.