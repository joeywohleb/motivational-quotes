# motivational-quotes
A full-stack motivational quote app built with React, Node, and GraphQL — fully containerized and deployable through automated CI/CD.

## Development Setup

### Prerequisites
- Docker and Docker Compose installed on your machine

### Running with Docker

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

### Development Features
- Hot reload enabled via volume mounting
- File watching configured with `CHOKIDAR_USEPOLLING=true` for cross-platform compatibility
- Node modules are preserved in a separate volume to prevent overwriting during development
