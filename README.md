# motivational-quotes
A motivational quote application built with React and TypeScript, featuring a simple UI and fully containerized development environment.

## Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tamagui** - Cross-platform UI component library
  - `@tamagui/core` - Core styling and theming
  - `@tamagui/stacks` - Layout components (YStack, XStack)
  - `@tamagui/button` - Button components
  - `@tamagui/separator` - Separator components
- **React Testing Library** - Component testing utilities
- **Jest** - Test runner

## Development Setup

### Prerequisites
- **Node.js 18+** (if running locally without Docker)
- **Docker and Docker Compose** (for containerized development)

### Running with Docker (Recommended)

1. Build and start the development container:
   ```bash
   docker-compose up
   ```
   
   For a fresh build (recommended on first run or after dependency changes):
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up
   ```

2. The application will be available at `http://localhost:3000`

3. The Docker entrypoint script automatically ensures all dependencies are installed, including:
   - Tamagui UI components
   - PapaParse for CSV parsing
   - All React dependencies

4. To run in detached mode (background):
   ```bash
   docker-compose up -d
   ```

5. To stop the containers:
   ```bash
   docker-compose down
   ```

#### Docker Development Features
- **Automatic dependency installation**: The entrypoint script ensures node_modules are properly installed
- **Hot reload**: Enabled via volume mounting
- **File watching**: Configured with `CHOKIDAR_USEPOLLING=true` and `WATCHPACK_POLLING=true` for cross-platform compatibility
- **Node modules preservation**: Anonymous volume prevents host node_modules from overwriting container dependencies

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
- `npm test` - Launches the test runner (runs in watch mode by default)
- `npm test -- --watchAll=false` - Run tests once without watch mode
- `npm run eject` - Ejects from Create React App (irreversible)

### Testing

The project includes comprehensive unit tests for the components.

Run tests with:
```bash
npm test
```

All tests use React Testing Library and are configured with a custom test utility (`src/test-utils.tsx`) that provides TamaguiProvider setup for consistent component rendering.

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
├── public/                    # Static assets
│   ├── quotes.csv            # CSV file containing quotes
│   └── ...
├── src/                       # React application source
│   ├── components/           # React components
│   ├── App.tsx               # Main App component
│   ├── App.test.tsx          # App component tests
│   ├── index.tsx             # Application entry point
│   ├── tamagui.config.ts     # Tamagui configuration
│   ├── test-utils.tsx        # Test utilities with TamaguiProvider
│   └── ...
├── Dockerfile.dev            # Development Docker image
├── docker-entrypoint.sh      # Docker entrypoint script
├── docker-compose.yml        # Docker Compose configuration
├── .dockerignore             # Files to exclude from Docker builds
└── package.json              # Dependencies and scripts
```

