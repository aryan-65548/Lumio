# Lumio Backend API

Production-ready backend API for Lumio HackerHouse Goa Card Generator.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Auth**: JWT & bcryptjs
- **File Upload**: Multer + Cloudinary
- **Security**: Helmet, CORS, Rate Limiter, Express Validator

## API Endpoints

### Auth (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user & receive token
- `POST /api/auth/logout` - Logout & clear token cookie
- `GET  /api/auth/me` - Get current authenticated user details

### User (`/api/user`)
- `GET /api/user/profile` - Get authenticated user profile
- `PUT /api/user/profile` - Update profile details

### Upload (`/api/upload`)
- `POST /api/upload` - Authenticated / public photo upload returning image URL

### Card (`/api/card`)
- `POST /api/card` - Save generated card details & URL
- `GET  /api/card/:id` - Fetch card by ID

## Setup & Running

```bash
cd backend
npm install
npm run dev
```
