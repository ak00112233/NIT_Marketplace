# NIT_MARKETPLACE

Campus marketplace platform for buying and selling used items among NIT KKR students.

**Team Members:**

- Akshit Goyal
- Sahil Rizvi
- Kaushal Raj
- Nitin Punetha
- Omprakash

---

## Environment Variables Setup

### Backend (.env)

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Server Configuration
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nit_marketplace?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your_jwt_secret_key_here

# Email Service (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Cloudinary Image Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Backend Variable Descriptions:**

| Variable                | Description                                | Example                                          |
| ----------------------- | ------------------------------------------ | ------------------------------------------------ |
| `PORT`                  | Express server port                        | `5000`                                           |
| `MONGODB_URI`           | MongoDB connection string with credentials | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET`            | Secret key for signing JWT tokens          | `your-secret-key-min-32-chars`                   |
| `EMAIL_USER`            | Gmail address for sending OTP emails       | `marketplace@gmail.com`                          |
| `EMAIL_PASS`            | Gmail App Password (requires 2FA)          | Generated from Google Account Settings           |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud identifier                | `xxxxxx`                                         |
| `CLOUDINARY_API_KEY`    | Cloudinary public API key                  | `xxxxxx`                                         |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                      | `xxxxxx`                                         |

### Frontend (.env.local)

Create a `.env.local` file in the `frontend/` directory with:

```env
# API Configuration
VITE_API_URL=http://localhost:5000
```

**Frontend Variable Descriptions:**

| Variable       | Description            | Example                                         |
| -------------- | ---------------------- | ----------------------------------------------- |
| `VITE_API_URL` | Backend API server URL | `http://localhost:5000` (dev) or production URL |

---

## Quick Start

### Backend Setup

```bash
cd backend
# Create .env file with all required variables
npm install
npm run dev    # Development
npm start      # Production
```

### Frontend Setup

```bash
cd frontend
# Create .env.local with API URL
npm install
npm run dev
```

---

## Important Notes

- **Never commit `.env` files** - Add to `.gitignore`
- **Gmail Setup**: Enable 2-Step Verification, then create App Password in Google Account settings
- **JWT_SECRET**: Use 32+ character cryptographically secure random string
- **Cloudinary Free Tier**: 25GB storage per month
- **Development**: Use `http://localhost:5000` for `VITE_API_URL`
- **Production**: Update `VITE_API_URL` to production backend URL
