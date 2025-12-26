# AR Brands - Full Stack E-Commerce Application

A complete e-commerce application with React frontend and Node.js/Express/MySQL backend.

## Project Structure

```
ar-brands/
├── backend/           # Express.js API server
│   ├── config/        # Database configuration
│   ├── controllers/   # Route handlers
│   ├── middleware/    # Auth & admin middleware
│   ├── routes/        # API routes
│   ├── server.js      # Entry point
│   └── package.json
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── config/api.ts
│   └── package.json
└── database/
    └── schema.sql     # MySQL database schema
```

## Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm or yarn

## Database Setup

1. Open phpMyAdmin or MySQL CLI
2. Import the schema:
   ```sql
   source database/schema.sql
   ```
   Or copy/paste the contents of `database/schema.sql` into phpMyAdmin SQL tab.

3. This creates:
   - Database: `ar_brands`
   - Tables: `profiles`, `categories`, `products`
   - Default admin: `admin@arbrands.com` / `admin123`
   - Sample categories and products

## Backend Setup

1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (copy from `.env.example`):
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=ar_brands
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=http://localhost:5173
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

   Server runs at `http://localhost:5000`

## Frontend Setup

1. Navigate to frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   App runs at `http://localhost:5173`

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login user | No |
| GET | /api/auth/profile | Get current user | Yes |

### Products
| Method | Endpoint | Description | Auth | Admin |
|--------|----------|-------------|------|-------|
| GET | /api/products | List all products | No | No |
| GET | /api/products/:id | Get product | No | No |
| POST | /api/products | Create product | Yes | Yes |
| PUT | /api/products/:id | Update product | Yes | Yes |
| DELETE | /api/products/:id | Delete product | Yes | Yes |

### Categories
| Method | Endpoint | Description | Auth | Admin |
|--------|----------|-------------|------|-------|
| GET | /api/categories | List all categories | No | No |
| GET | /api/categories/:id | Get category | No | No |
| POST | /api/categories | Create category | Yes | Yes |
| PUT | /api/categories/:id | Update category | Yes | Yes |
| DELETE | /api/categories/:id | Delete category | Yes | Yes |

## Query Parameters (Products)

- `category_id` - Filter by category
- `search` - Search in name/description
- `min_price` - Minimum price
- `max_price` - Maximum price
- `featured=true` - Only featured products
- `available=true` - Only available products

Example: `GET /api/products?category_id=xxx&featured=true&min_price=20`

## Default Admin Credentials

- **Email:** admin@arbrands.com
- **Password:** admin123

⚠️ Change these in production!

## Tech Stack

### Backend
- Node.js + Express.js
- MySQL with mysql2
- JWT for authentication
- bcrypt for password hashing
- CORS enabled

### Frontend
- React 18 + Vite
- TypeScript
- Tailwind CSS
- React Router
- React Query (TanStack Query)
- Axios for HTTP requests

## Production Deployment

1. Set strong `JWT_SECRET`
2. Use HTTPS
3. Configure proper CORS origins
4. Use environment variables
5. Set up MySQL with proper credentials
6. Consider using PM2 for process management
