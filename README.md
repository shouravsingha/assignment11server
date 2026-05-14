# Blood Donation Application - Server

Backend API built with Node.js, Express, and MongoDB.

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Update .env with your configuration
# Then start the development server
npm run dev
```

The server will be available at `http://localhost:5000`

## 📦 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload (requires nodemon)

## 🏗️ Project Structure

```
server/
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   ├── User.js              # User schema
│   ├── DonationRequest.js   # Donation request schema
│   └── Funding.js           # Funding schema
├── controllers/
│   ├── authController.js    # Auth logic
│   ├── userController.js    # User management
│   ├── donationController.js # Donation requests
│   └── fundingController.js  # Funding logic
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── userRoutes.js        # User endpoints
│   ├── donationRoutes.js    # Donation endpoints
│   └── fundingRoutes.js     # Funding endpoints
├── middleware/
│   └── verifyToken.js       # JWT verification
├── server.js                # Entry point
├── package.json
└── .env.example
```

## 🔐 Environment Variables

Create a `.env` file with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blood-donation
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_this_in_production
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Database Connection Options

#### Local MongoDB

```
MONGODB_URI=mongodb://localhost:27017/blood-donation
```

#### MongoDB Atlas

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blood-donation
```

## 📚 API Endpoints

### Base URL

```
http://localhost:5000/api
```

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Users

- `GET /users` - Get all users (admin only)
- `GET /users/profile` - Get logged-in user profile
- `PUT /users/profile` - Update user profile

### Donation Requests

- `GET /donation-requests` - Get all requests
- `POST /donation-requests` - Create request (auth required)
- `GET /donation-requests/:id` - Get request details
- `PUT /donation-requests/:id` - Update request (auth required)
- `DELETE /donation-requests/:id` - Delete request (auth required)

### Funding

- `GET /funding` - Get all fundings
- `POST /funding` - Create funding (auth required)
- `GET /funding/total` - Get total funding

## 🔑 Key Features

### Authentication

- JWT-based authentication
- Bcryptjs password hashing
- Token verification middleware
- Secure password storage

### Models

#### User Model

- Email, name, avatar, blood group
- District and upazila
- Role-based access (donor, volunteer, admin)
- Status tracking (active, blocked)

#### Donation Request Model

- Requester and recipient information
- Blood group and location details
- Hospital and address information
- Donation date and time
- Status tracking (pending, inprogress, done, canceled)
- Donor information (when status is inprogress)

#### Funding Model

- User information
- Fund amount and transaction ID
- Payment method tracking
- Funding date and status

## 🛡️ Security Features

- **Password Hashing:** bcryptjs with 10 salt rounds
- **JWT Authentication:** Secure token-based auth
- **CORS:** Enabled for cross-origin requests
- **Environment Variables:** All sensitive data in .env
- **Input Validation:** Schema-level validation
- **Error Handling:** Comprehensive error middleware

## 🔄 Middleware

### verifyToken

Verifies JWT tokens from Authorization header and attaches user data to request object.

```javascript
// Usage
app.use('/api/protected-route', verifyToken, controllerFunction)
```

## 💾 Database Models

### User

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String (URL),
  bloodGroup: String (enum),
  district: String,
  upazila: String,
  role: String (donor|volunteer|admin),
  status: String (active|blocked),
  createdAt: Date,
  updatedAt: Date
}
```

### DonationRequest

```javascript
{
  _id: ObjectId,
  requesterEmail: String,
  requesterName: String,
  recipientName: String,
  recipientDistrict: String,
  recipientUpazila: String,
  hospitalName: String,
  fullAddress: String,
  bloodGroup: String,
  donationDate: Date,
  donationTime: String,
  requestMessage: String,
  donationStatus: String (pending|inprogress|done|canceled),
  donorName: String,
  donorEmail: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Funding

```javascript
{
  _id: ObjectId,
  userEmail: String,
  userName: String,
  fundAmount: Number,
  paymentMethodId: String,
  transactionId: String (unique),
  status: String (pending|completed|failed),
  fundingDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

### Railway.app

1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### Render.com

1. Connect GitHub repository
2. Configure build and start commands
3. Set environment variables
4. Deploy

## 📝 Contributing

1. Create a feature branch
2. Make your changes
3. Test your changes
4. Commit with meaningful messages
5. Push to the branch
6. Open a pull request

## 🐛 Troubleshooting

### MongoDB Connection Error

- Verify MONGODB_URI in .env
- Check MongoDB service is running
- Verify network access (for Atlas)

### Port Already in Use

```bash
# Find and kill process on port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### CORS Error

- Verify frontend URL in CORS configuration
- Check request headers

## 📞 Support

For issues or questions, please create an issue in the repository.

---

Built with ❤️ for the Blood Donation Application
