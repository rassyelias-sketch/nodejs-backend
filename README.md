# Node.js Backend with User Management UI

A simple Node.js backend boilerplate using Express.js with a clean project structure, essential middleware, and a modern web UI for user management.

## Features

- ✅ Express.js server with CORS enabled
- ✅ User authentication (signup/login)
- ✅ User management (create, list, search, delete)
- ✅ Modern responsive web UI
- ✅ Environment configuration with dotenv
- ✅ Error handling middleware
- ✅ Health check endpoint
- ✅ MongoDB integration with Mongoose

## Project Structure

```
├── src/
│   ├── index.js                  # Main application entry point
│   ├── db/
│   │   └── connection.js         # Database connection
│   ├── models/
│   │   └── User.js              # User model
│   ├── dao/
│   │   └── UserDAO.js           # Data access object
│   ├── services/
│   │   └── UserService.js       # Business logic
│   └── routes/
│       └── index.js             # API routes
├── public/
│   └── index.html               # Frontend UI
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── package.json                 # Project dependencies
└── README.md                    # This file
```

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from template:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/user_db
```

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

## Accessing the UI

Once the server is running, open your browser and navigate to:
```
http://localhost:3000
```

The UI provides:
- **Sign Up**: Create a new user account
- **Log In**: Authenticate with email and password
- **View Users**: See all users in the system
- **Search Users**: Find users by name
- **Delete Users**: Remove users from the database

## API Endpoints

### Health & Status
- `GET /health` - Health check endpoint

### Welcome
- `GET /api/` - Welcome message
- `GET /api/hello` - Hello endpoint

### Users
- `GET /api/users` - Get all users
- `GET /api/users/search?name=<name>` - Search users by name
- `GET /api/users/:id` - Get a specific user by ID
- `DELETE /api/users/:id` - Delete a user

### Authentication
- `POST /api/signup` - Register a new user
  - Body: `{ name, email, password }`
- `POST /api/login` - Authenticate user
  - Body: `{ email, password }`

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Security**: bcryptjs for password hashing

## License

ISC
