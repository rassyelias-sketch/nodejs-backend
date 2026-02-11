# Node.js Backend Boilerplate

A simple Node.js backend boilerplate using Express.js with a clean project structure and essential middleware.

## Features

- Express.js server
- CORS enabled
- Environment configuration with dotenv
- Basic routing structure
- Error handling middleware
- Health check endpoint

## Project Structure

```
├── src/
│   ├── index.js          # Main application entry point
│   └── routes/
│       └── index.js      # API routes
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
├── package.json          # Project dependencies
└── README.md             # This file
```

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from template:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env` as needed.

### Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000` by default.

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /api/` - Welcome message
- `GET /api/hello` - Hello endpoint

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## License

ISC
