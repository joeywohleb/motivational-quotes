# motivational-quotes
A full-stack motivational quote app built with React, Node, and GraphQL — fully containerized and deployable through automated CI/CD.

## Tech Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Testing Library** - Component testing utilities

## Development Setup

### Prerequisites
- **Node.js 18+** (if running locally without Docker)
- **Docker and Docker Compose** (for containerized development)

### Running with Docker (Recommended)

1. Build and start the development container:
   ```bash
   docker-compose up
   ```

2. The application will be available at `http://localhost:3000`

3. To run in detached mode (background):
   ```bash
   docker-compose up -d
   ```

4. To stop the containers:
   ```bash
   docker-compose down
   ```

### Running Locally (Without Docker)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. The application will be available at `http://localhost:3000`

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (irreversible)

### Development Features
- **Hot reload** enabled via volume mounting in Docker
- **File watching** configured with `CHOKIDAR_USEPOLLING=true` for cross-platform compatibility
- **Node modules** are preserved in a separate volume to prevent overwriting during development

## Production Build

### Docker Production Build

The production Dockerfile uses a multi-stage build:
1. Builds the React app using Node.js
2. Serves the static files using Nginx

To build and run the production image:
```bash
docker build -t motivational-quotes:prod .
docker run -p 80:80 motivational-quotes:prod
```

The production build will be available at `http://localhost`

## Project Structure

```
motivational-quotes/
├── public/                 # Static assets
├── src/                    # React application source
│   ├── App.tsx            # Main App component
│   ├── index.tsx          # Application entry point
│   └── ...
├── Dockerfile.dev         # Development Docker image
├── docker-compose.yml     # Docker Compose configuration
└── package.json           # Dependencies and scripts
```

