# Blood Donation Application - Server

Backend API built with Node.js, Express, and MongoDB. This server handles authentication, user management, donation requests, and payment processing.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env
```

### Configuration

Update your `.env` file with your specific configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blood-donation
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Running the Server

```bash
# Start development server with nodemon
npm run dev

# Start production server
npm start
```

The server will be available at `http://localhost:5000`.

## 📦 Available Scripts

- `npm start` - Start production server using `node server.js`
- `npm run dev` - Start development server with `nodemon` for auto-reload

## 🏗️ Project Structure

```
server/
├── config/              # Configuration files
│   ├── database.js      # MongoDB connection using Mongoose
│   └── firebase-admin.js # Firebase Admin SDK initialization
├── models/              # Mongoose schemas & models
│   ├── User.js          # User profile and role management
│   ├── DonationRequest.js # Blood donation request data
│   └── Funding.js       # Payment and transaction records
├── controllers/         # Business logic (Request handlers)
│   ├── authController.js # Login, registration, and JWT issuance
│   ├── userController.js # User search, profile updates, and admin tasks
│   ├── donationController.js # CRUD for donation requests
│   └── fundingController.js # Stripe integration and funding tracking
├── routes/              # API endpoint definitions
│   ├── authRoutes.js    # /api/auth/*
│   ├── userRoutes.js    # /api/users/*
│   ├── donationRoutes.js # /api/donation-requests/*
│   └── fundingRoutes.js  # /api/funding/*
├── middleware/          # Custom Express middleware
│   ├── verifyToken.js   # Validates JWT in Authorization header
│   ├── verifyAdmin.js   # Restricts access to Admin role
│   └── verifyVolunteer.js # Restricts access to Volunteers and Admins
├── server.js            # Main entry point and Express app setup
├── package.json         # Dependencies and scripts
└── .env.example         # Template for environment variables
```

## 📚 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register a new user (Donor by default)
- `POST /login` - Authenticate user and return JWT

### Users (`/api/users`)
- `GET /search-donors` - Search for donors by location and blood group (Public)
- `GET /profile` - Get logged-in user's profile (Authenticated)
- `PUT /profile` - Update own profile (Authenticated)
- `GET /` - Get all users with filtering (Admin Only)
- `GET /admin-stats` - Get system-wide statistics (Admin Only)
- `PATCH/:id/status` - Update user status (active/blocked) (Admin Only)
- `PATCH/:id/role` - Update user role (donor/volunteer/admin) (Admin Only)

### Donation Requests (`/api/donation-requests`)
- `GET /` - Get all donation requests with filtering (Public)
- `POST /` - Create a new blood donation request (Authenticated)
- `GET /get-stats` - Get donation-related stats (Volunteer/Admin)
- `GET/:id` - Get details of a specific request
- `POST/:id/donate` - Mark a request as "inprogress" by a donor (Authenticated)
- `PATCH/:id/status` - Update request status (pending/inprogress/done/canceled) (Authenticated)
- `PUT/:id` - Update request details (Authenticated)
- `DELETE/:id` - Remove a donation request (Authenticated)

### Funding (`/api/funding`)
- `POST /create-payment-intent` - Initialize Stripe payment (Authenticated)
- `POST /save-funding` - Record successful transaction in DB (Authenticated)
- `GET /` - Get all funding history (Authenticated)
- `GET /total` - Get total funds raised (Public)

## 🛠️ Tech Stack

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Auth:** [JSON Web Token (JWT)](https://jwt.io/) & [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- **Payments:** [Stripe API](https://stripe.com/docs/api)
- **Admin Tools:** [Firebase Admin SDK](https://firebase.google.com/docs/admin)

## 🛡️ Security & Middleware

- **JWT Verification:** All protected routes require a valid Bearer token in the `Authorization` header.
- **Role-Based Access Control (RBAC):** Middleware checks for `admin` or `volunteer` roles before granting access to sensitive endpoints.
- **Password Hashing:** Uses `bcryptjs` with a salt factor of 10 to ensure user credentials remain secure.
- **CORS:** Configured to allow requests from specific frontend origins.
- **Validation:** Schema-level validation via Mongoose.

## 🚀 Deployment

The server is configured for deployment on **Vercel** (see `vercel.json`).

1.  Connect your repository to Vercel.
2.  Add all environment variables from your `.env` to the Vercel project settings.
3.  Ensure your MongoDB Atlas cluster allows connections from the Vercel deployment IP (or allow all IPs `0.0.0.0/0`).

## 🐛 Troubleshooting

- **Database Connection:** If the server fails to start, verify your `MONGODB_URI` and ensure your database is reachable.
- **Token Expiry:** If requests return 401/403, check if the JWT has expired or if the `JWT_SECRET` matches on both ends.
- **Stripe Errors:** Ensure you are using the correct secret key and that your Stripe account is in test mode if using test keys.

---

Built with ❤️ for the Blood Donation Application
