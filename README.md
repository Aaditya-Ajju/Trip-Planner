# WanderWise - Smart Travel Companion

A full-stack travel planning application built with React, Node.js, and MongoDB. Plan your trips, search for destinations, get weather information, and manage your travel itineraries.

## Features

- **Firebase Authentication** - Secure user authentication with email verification
- **Trip Planning** - Create and manage travel plans with dates and notes
- **City Search** - Search for destinations using GeoDB Cities API
- **Weather Integration** - Get current weather information for destinations
- **Profile Management** - Manage user profiles and travel statistics
- **Responsive Design** - Beautiful glassmorphism UI with Tailwind CSS
- **Protected Routes** - Secure routes using Context API

## Tech Stack

### Frontend
- **React** - UI library
- **Tailwind CSS** - Styling and responsive design
- **React Router** - Client-side routing
- **Firebase Auth** - Authentication
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Firebase Admin** - Authentication verification
- **Mongoose** - MongoDB ODM

### APIs
- **GeoDB Cities API** - City search functionality
- **OpenWeatherMap API** - Weather information

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Firebase project
- API keys for GeoDB and OpenWeatherMap

### 1. Clone the Repository
```bash
git clone <repository-url>
cd wanderwise
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 3. Environment Variables

#### Client (.env)
```bash
cd client
cp .env.example .env
```

Fill in your Firebase configuration:
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### Server (.env)
```bash
cd server
cp .env.example .env
```

Fill in your configuration:
```
MONGODB_URI=mongodb://localhost:27017/wanderwise
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_private_key_here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your_project.iam.gserviceaccount.com
RAPIDAPI_KEY=your_rapidapi_key
OPENWEATHER_API_KEY=your_openweather_api_key
PORT=5000
```

### 4. Firebase Setup

1. Create a new Firebase project at https://console.firebase.google.com/
2. Enable Authentication and Email/Password provider
3. Generate a service account key:
   - Go to Project Settings → Service Accounts
   - Click "Generate new private key"
   - Download the JSON file
   - Extract the values for your server .env file

### 5. API Keys Setup

#### GeoDB Cities API (RapidAPI)
1. Sign up at https://rapidapi.com/
2. Subscribe to GeoDB Cities API
3. Get your API key

#### OpenWeatherMap API
1. Sign up at https://openweathermap.org/
2. Get your free API key

### 6. Database Setup

#### Local MongoDB
```bash
# Install MongoDB locally or use MongoDB Atlas
# Make sure MongoDB is running on port 27017
```

#### MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Get connection string and update MONGODB_URI

### 7. Running the Application

#### Development Mode
```bash
# Terminal 1 - Start the server
cd server
npm run dev

# Terminal 2 - Start the client
cd client
npm run dev
```

#### Production Mode
```bash
# Build the client
cd client
npm run build

# Start the server
cd server
npm start
```

## Project Structure

```
wanderwise/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── firebase/       # Firebase configuration
│   │   ├── pages/          # Page components
│   │   └── ...
│   ├── public/
│   └── package.json
├── server/                 # Node.js backend
│   ├── middleware/         # Express middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── server.js          # Main server file
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
All protected routes require Firebase ID token in Authorization header:
```
Authorization: Bearer <firebase_id_token>
```

### Users
- `GET /api/users/profile` - Get user profile
- `POST /api/users/profile` - Create user profile
- `PUT /api/users/profile` - Update user profile

### Trips
- `GET /api/trips` - Get all user trips
- `POST /api/trips` - Create new trip
- `GET /api/trips/:id` - Get specific trip
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

### Cities
- `GET /api/cities/search?q=<query>` - Search cities

### Weather
- `GET /api/weather/city?city=<city_name>` - Get weather by city
- `GET /api/weather/current` - Get current weather

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Backend (Render)
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect repository
4. Add environment variables
5. Deploy

## Features Breakdown

### Authentication Flow
1. User signs up with email/password
2. Email verification sent via Firebase
3. User profile created in MongoDB
4. JWT token used for API authentication

### Trip Planning
1. Search cities using GeoDB API
2. Get weather information for destination
3. Create trip with dates and notes
4. Save to MongoDB with user association

### Data Flow
```
Frontend → Firebase Auth → Backend API → MongoDB
                   ↓
              External APIs (GeoDB, OpenWeather)
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@wanderwise.com or create an issue in the repository.