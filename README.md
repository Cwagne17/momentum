# Momentum Net Worth Tracker

A desktop application for tracking personal net worth over time, built with Electron, React, and TypeScript.

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

```bash
npm install
```

### Development

```bash
# Start both main and renderer processes in development mode
npm run dev

# Start main process only
npm run dev:main

# Start renderer process only
npm run dev:renderer
```

### Building

```bash
# Build both main and renderer
npm run build

# Build main process only
npm run build:main

# Build renderer process only
npm run build:renderer
```

### Packaging

```bash
# Package for current platform
npm run package
```

### Testing

```bash
npm test
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## Project Structure

```
src/
├── main/           # Electron main process
│   ├── main.ts     # Main entry point
│   └── preload.ts  # Preload script for IPC
├── renderer/       # React renderer process
│   ├── index.html  # HTML template
│   ├── main.tsx    # React entry point
│   └── App.tsx     # Main React component
└── shared/         # Shared types and utilities
    └── types/      # TypeScript type definitions
        ├── index.ts      # Main types export
        └── electron.ts   # Electron API types
```

## Architecture

- **Main Process**: Handles file system operations, portfolio management, and system integration
- **Renderer Process**: React-based UI for data entry, visualization, and user interaction
- **IPC Communication**: Secure communication between main and renderer processes
- **Data Storage**: JSON-based portfolio files with automatic backups
