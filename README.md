# Real-Time Poll Rooms

A full-stack real-time polling application built with React and Node.js, featuring clean architecture and real-time updates via Socket.IO.

## 🏗️ Architecture

### Frontend Structure

The frontend follows a clean, organized structure with clear separation of concerns:

```
poll-app/src/
├── components/              # Reusable UI components
│   ├── CreatePoll.jsx
│   ├── CreatePoll.css
│   ├── PollView.jsx
│   └── PollView.css
│
├── pages/                   # Page-level components
│   ├── HomePage.jsx
│   └── PollPage.jsx
│
├── hooks/                   # Custom React hooks
│   ├── useCreatePoll.js    # Poll creation logic
│   ├── usePoll.js          # Poll data & real-time updates
│   └── useVote.js          # Voting logic
│
├── services/                # Business logic & external services
│   ├── api.js              # REST API calls
│   ├── socket.js           # Socket.IO client
│   └── voter.js            # Voter ID & tracking
│
├── App.jsx                  # Main app with routing
├── App.css                  # Global styles
├── main.jsx                 # Entry point
└── index.css                # Base styles
```

### Architecture Benefits

1. **Separation of Concerns**: Components, logic, and services are clearly separated
2. **Reusability**: Hooks and services can be reused across components
3. **Maintainability**: Easy to locate and modify specific functionality
4. **Testability**: Hooks and services can be tested independently
5. **Scalability**: Simple to add new features following the same pattern

## ✨ Features

### Required Features (All Implemented)

1. ✅ **Poll Creation**: Create polls with questions and multiple options
2. ✅ **Shareable Links**: Generate unique URLs for each poll
3. ✅ **Real-Time Updates**: Live vote updates using Socket.IO
4. ✅ **Anti-Abuse Mechanisms**: Two-layer protection (see below)
5. ✅ **Persistence**: In-memory storage (polls survive page refreshes)
6. ✅ **Deployment Ready**: Production build configuration

### Anti-Abuse Mechanisms

#### 1. Browser Fingerprinting (voterId)
- **What it prevents**: Multiple votes from the same browser
- **How it works**: Generates a unique ID stored in localStorage
- **Limitations**: Can be bypassed by clearing browser data or using incognito mode

#### 2. IP-Based Rate Limiting
- **What it prevents**: Rapid-fire voting attempts from the same IP
- **How it works**: 5-second cooldown between votes from the same IP address
- **Limitations**: Can be bypassed using VPN or proxy services

### Edge Cases Handled

1. **Empty Options**: Filters out empty option fields before submission
2. **Minimum Options**: Enforces at least 2 valid options
3. **Invalid Poll ID**: Shows error message for non-existent polls
4. **Network Errors**: Graceful error handling with user feedback
5. **Duplicate Votes**: Prevents voting twice on the same poll
6. **Real-Time Sync**: Handles late joiners and disconnections
7. **Vote Cooldown**: Prevents spam voting with rate limiting

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- Modern web browser

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Poll_app
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../poll-app
npm install
```

### Development

Run both frontend and backend concurrently:

```bash
# From root directory
npm install
npm run dev
```

Or run separately:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd poll-app
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### Production Build

```bash
# Build frontend
cd poll-app
npm run build

# Start backend (serves built frontend)
cd ../backend
npm start
```

## 🛠️ Technology Stack

### Frontend
- **React 19**: UI framework
- **React Router**: Client-side routing
- **Socket.IO Client**: Real-time communication
- **Vite**: Build tool and dev server

### Backend
- **Node.js**: Runtime environment
- **Express**: Web framework
- **Socket.IO**: WebSocket server
- **nanoid**: Unique ID generation

## 📁 Project Structure

```
Poll_app/
├── backend/              # Node.js backend
│   ├── server.js        # Express + Socket.IO server
│   └── package.json
│
├── poll-app/            # React frontend
│   ├── src/
│   │   ├── domain/      # Business logic
│   │   ├── application/ # Use cases
│   │   ├── infrastructure/ # External services
│   │   ├── presentation/   # UI components
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── package.json         # Root workspace config
└── README.md
```

## 🔒 Security Considerations

### Current Implementation
- CORS enabled for development
- Input validation on both client and server
- Rate limiting per IP address
- Browser fingerprinting for vote tracking

### Production Recommendations
1. Configure CORS for specific domains
2. Add HTTPS/TLS encryption
3. Implement database persistence
4. Add authentication for poll creators
5. Use Redis for distributed rate limiting
6. Add CAPTCHA for additional bot protection
7. Implement IP reputation checking

## 🎯 Known Limitations

1. **In-Memory Storage**: Data is lost on server restart (use database for production)
2. **Single Server**: No horizontal scaling (use Redis for multi-server setup)
3. **Basic Anti-Abuse**: Can be bypassed by determined users (add CAPTCHA/auth)
4. **No Poll Expiration**: Polls exist indefinitely
5. **No Edit/Delete**: Cannot modify polls after creation
6. **No Analytics**: No detailed voting analytics or history

## 🚀 Future Improvements

1. **Database Integration**: PostgreSQL or MongoDB for persistence
2. **User Authentication**: Allow users to manage their polls
3. **Poll Management**: Edit, delete, and close polls
4. **Advanced Analytics**: Voting patterns, demographics, time-series data
5. **Poll Templates**: Pre-built poll types
6. **Export Results**: CSV, PDF export functionality
7. **Multiple Choice**: Support for multi-select polls
8. **Time Limits**: Auto-close polls after duration
9. **Private Polls**: Password-protected polls
10. **Themes**: Customizable poll appearance

## 📝 API Documentation

### REST Endpoints

#### Create Poll
```
POST /api/polls
Body: { question: string, options: string[] }
Response: { id: string, shareUrl: string }
```

#### Get Poll
```
GET /api/polls/:id
Response: { id, question, options, results, createdAt }
```

### Socket.IO Events

#### Client → Server
- `join-poll`: Join a poll room
- `vote`: Submit a vote

#### Server → Client
- `poll-data`: Initial poll data
- `results-update`: Real-time vote updates
- `vote-success`: Vote accepted
- `vote-error`: Vote rejected

## 📄 License

MIT

## 👤 Author

Built as a full-stack assignment demonstrating clean architecture and real-time features.
