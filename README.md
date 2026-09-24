# ChatAppVin

ChatAppVin is a real-time one-to-one chat application. Users can create an account, sign in with email and password or Google, update their profile, browse other users, and exchange messages in real time.

This README documents the active application in `backend/` and `front/`. The `frontend/` directory is an experimental implementation and is intentionally excluded.

## Features

- Email/password sign-up, login, and logout
- Google OAuth authentication
- JWT authentication using secure cookies with an authorization-header fallback
- One-to-one messaging
- Real-time message delivery and online-user presence with Socket.IO
- User directory for starting conversations
- Profile name, password, and profile-picture updates
- Cloudinary-backed profile-picture uploads
- MongoDB persistence for users and messages
- Welcome email after account creation or Google sign-in

## Project Structure

```text
chat-app/
├── backend/       Express API, MongoDB models, authentication, and Socket.IO server
├── front/         Active React/Vite client
└── frontend/      Experimental client, not part of the documented application
```

## Technology Stack

### Backend

- Node.js with Express 5
- MongoDB with Mongoose
- JWT and bcryptjs authentication
- Passport Google OAuth 2.0
- Socket.IO
- Cloudinary and Multer for image uploads
- Nodemailer for welcome emails

### Frontend

- React 18
- Vite
- React Router
- Zustand
- Axios
- Socket.IO Client
- Tailwind CSS

## Prerequisites

- Node.js 18 or newer
- npm
- A MongoDB database
- Google OAuth credentials if Google sign-in is enabled
- A Cloudinary account for profile-picture uploads

## Local Setup

### 1. Install dependencies

From the repository root:

```bash
cd backend
npm install

cd ../front
npm install
```

### 2. Configure the backend

Create `backend/.env` using the following names. Replace each placeholder with a value for your environment:

```env
NODE_ENV=development
PORT=3000

MONGO_URI=<mongodb-connection-string>
JWT_PASSWORD=<long-random-jwt-secret>

LOCAL_FRONTEND_URI=http://localhost:5173
PUBLIC_FRONTEND_URI=<production-frontend-url>

GOOGLE_CLIENT_ID=<google-client-id>
GOOGLE_CLIENT_SECRET=<google-client-secret>
LOCAL_GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
PUBLIC_GOOGLE_REDIRECT_URI=<production-api-url>/api/auth/google/callback

CLOUDINARY_CLOUD_NAME=<cloudinary-cloud-name>
CLOUDINARY_API_KEY=<cloudinary-api-key>
CLOUDINARY_API_SECRET=<cloudinary-api-secret>

SESSION_SECRET=<session-secret>
```

The Google OAuth client must allow this local callback URL:

```text
http://localhost:3000/api/auth/google/callback
```

Keep `.env` files private and never commit real credentials. The current welcome-email transport is configured in `backend/src/util/sendLogInMail.js`; review or move those SMTP credentials to environment variables before deploying.

### 3. Configure the frontend

Create `front/.env`:

```env
VITE_SETUP=DEVELOPMENT
VITE_API_URL_LOCAL=http://localhost:3000/api
VITE_API_URL_PUBLIC=<production-api-url>/api
VITE_BASE_URL_LOCAL=http://localhost:3000
VITE_BASE_URL_PUBLIC=<production-api-url>
```

Use `VITE_SETUP=DEVELOPMENT` for local development. Any other value makes the client use the public API and Socket.IO URLs.

### 4. Start the application

Run the backend and frontend in separate terminals:

```bash
cd backend
npm run dev
```

```bash
cd front
npm run dev
```

Open the Vite URL shown in the frontend terminal, normally `http://localhost:5173`.

## API Overview

All protected endpoints require the JWT cookie or an `Authorization: Bearer <token>` header.

### Authentication and users

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/` | API health check |
| `POST` | `/api/auth/signup` | Create an account |
| `POST` | `/api/auth/login` | Log in with email and password |
| `POST` | `/api/auth/logout` | Clear the authentication cookie |
| `GET` | `/api/auth/me` | Get the current user |
| `GET` | `/api/auth/getAllUsers` | List users for authenticated users |
| `GET` | `/api/auth/google` | Start Google OAuth |
| `GET` | `/api/auth/google/callback` | Handle Google OAuth callback |
| `PUT` | `/api/auth/updateUser/fullName` | Update the user's name |
| `PUT` | `/api/auth/updateUser/password` | Update the user's password |
| `PUT` | `/api/auth/updateUser/profilePicture` | Upload a new profile picture |

### Messages

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/message/getMessages?otherUserId=<id>` | Get the conversation with another user |
| `POST` | `/api/message/sendMessage` | Send a message |

A message request uses this shape:

```json
{
  "receiverId": "user-id",
  "text": "Hello!",
  "image": ""
}
```

Socket.IO broadcasts online-user updates through `getOnlineUsers` and delivers new messages through `newMessage`.

## Frontend Commands

Run these from `front/`:

```bash
npm run dev       # Start the Vite development server
npm run build     # Create a production build
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

## Backend Commands

Run these from `backend/`:

```bash
npm run dev       # Start the API with Nodemon
```

## Production Notes

- Set `NODE_ENV` and all public URLs to production values.
- Configure the production Google OAuth callback URL in Google Cloud Console.
- Ensure the production frontend origin is included in the backend CORS configuration through `PUBLIC_FRONTEND_URI`.
- Use strong, unique secrets for JWT and session signing.
- Keep database, Cloudinary, OAuth, and SMTP credentials out of source control.
