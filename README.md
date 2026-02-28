# QuickHire Backend API

A RESTful API backend for the **QuickHire** job board application. Built with Node.js, Express, MongoDB, and
follows a modular feature-based architecture.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Validation:** Zod
- **Authentication:** JSON Web Tokens (JWT) & bcrypt
- **Environment:** dotenv

## Project Structure

```
src/
├── app.js                          # Express app setup & middleware
├── server.js                       # Entry point — connects DB & starts server
├── config/
│   └── db.js                       # MongoDB connection
├── middleware/
│   ├── errorHandler.js             # Centralized error handling
│   └── requireAuth.js              # JWT authentication guard
├── seed.js                         # Admin account seeder
└── modules/
    ├── auth/
    │   ├── admin.model.js          # Admin Mongoose schema
    │   ├── auth.controller.js      # Login logic
    │   └── auth.routes.js          # POST /api/auth/login
    ├── jobs/
    │   ├── job.model.js            # Job Mongoose schema
    │   ├── job.validation.js       # Zod schemas & validate middleware
    │   ├── job.controller.js       # CRUD handlers
    │   └── job.routes.js           # GET, POST, DELETE /api/jobs
    └── applications/
        ├── application.model.js    # Application Mongoose schema
        ├── application.validation.js # Zod schemas (email & URL checks)
        ├── application.controller.js # Submit handler
        └── application.routes.js   # POST /api/applications
```

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** (local instance or MongoDB Atlas)

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd QuickHire-backend

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# Then edit .env with your actual values (see below)

# 4. Seed the admin account
npm run seed

# 5. Start the server
npm start

# Or run in development mode (auto-restart on file changes)
npm run dev
```

The server will start at `http://localhost:5000` (or whichever PORT you set).

## Seeding Admin Account

There is no public registration endpoint — admin accounts are created via the seed script:

```bash
npm run seed
```

This creates a default admin with the following credentials:

| Field    | Value                 |
| -------- | --------------------- |
| Email    | `admin@quickhire.com` |
| Password | `Admin@123`           |

> If the admin already exists, the script will skip creation and exit safely.

## Environment Variables

Create a `.env` file in the project root with the following variables:

| Variable     | Description                       | Example                               |
| ------------ | --------------------------------- | ------------------------------------- |
| `PORT`       | Port for the Express server       | `5000`                                |
| `MONGO_URI`  | MongoDB connection string         | `mongodb://localhost:27017/quickhire` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your_super_secret_key`               |

## API Endpoints

### Auth

| Method | Endpoint          | Access | Description       |
| ------ | ----------------- | ------ | ----------------- |
| POST   | `/api/auth/login` | Public | Admin login (JWT) |

**Request body:**

```json
{ "email": "admin@example.com", "password": "yourpassword" }
```

### Jobs

| Method | Endpoint        | Access    | Description      |
| ------ | --------------- | --------- | ---------------- |
| GET    | `/api/jobs`     | Public    | List all jobs    |
| GET    | `/api/jobs/:id` | Public    | Get a single job |
| POST   | `/api/jobs`     | Protected | Create a new job |
| DELETE | `/api/jobs/:id` | Protected | Delete a job     |

**Protected** routes require the header:

```
Authorization: Bearer <token>
```

**Create Job request body:**

```json
{
  "title": "Backend Developer",
  "company": "QuickHire Inc.",
  "location": "Remote",
  "category": "Engineering",
  "description": "Build REST APIs with Node.js."
}
```

### Applications

| Method | Endpoint            | Access | Description              |
| ------ | ------------------- | ------ | ------------------------ |
| POST   | `/api/applications` | Public | Submit a job application |

**Request body:**

```json
{
  "job_id": "664f1e2a3b5c7d001a2b3c4d",
  "name": "John Doe",
  "email": "john@example.com",
  "resume_link": "https://example.com/resume.pdf",
  "cover_note": "I am very interested in this role."
}
```

> The API validates that `email` is properly formatted and `resume_link` is a valid URL. It also checks that
> the `job_id` references an existing job before saving.

## Error Handling

All errors are returned in a consistent JSON format:

```json
{
  "success": false,
  "message": "Description of the error"
}
```

The centralized error handler also covers:

- **Mongoose CastError** (invalid ObjectId) → `400`
- **Duplicate key** (e.g., duplicate email) → `409`
- **Mongoose ValidationError** → `400`

## Author

**Mir Faisal Ahmad**
