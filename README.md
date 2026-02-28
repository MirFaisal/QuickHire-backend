# QuickHire Backend API

A RESTful API backend for the **QuickHire** job board application. Built with Node.js, Express, MongoDB, and
follows a modular feature-based architecture.

**Live API:** [https://quickhire-backend-xs81.onrender.com](https://quickhire-backend-xs81.onrender.com)

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js 5
- **Database:** MongoDB with Mongoose ODM
- **Validation:** Zod
- **Authentication:** JSON Web Tokens (JWT) & bcrypt
- **Environment:** dotenv
- **Dev Tooling:** Nodemon

## Features

- RESTful CRUD operations for Jobs, Categories, and Applications
- JWT-based authentication with protected routes
- Zod schema validation on all create endpoints
- **Soft delete** — records are marked as deleted instead of being permanently removed, with restore support
- Centralized error handling with consistent JSON responses
- CORS enabled for cross-origin frontend access
- Admin account seeder script

## Project Structure

```
src/
├── app.js                            # Express app setup, CORS & middleware
├── server.js                         # Entry point — connects DB & starts server
├── seed.js                           # Admin account seeder
├── config/
│   └── db.js                         # MongoDB connection
├── middleware/
│   ├── errorHandler.js               # Centralized error handling
│   ├── requireAuth.js                # JWT authentication guard
│   └── softDelete.js                 # Reusable Mongoose soft-delete plugin
└── modules/
    ├── auth/
    │   ├── admin.model.js            # Admin Mongoose schema
    │   ├── auth.controller.js        # Login logic
    │   └── auth.routes.js            # POST /api/auth/login
    ├── jobs/
    │   ├── job.model.js              # Job Mongoose schema (with soft delete)
    │   ├── job.validation.js         # Zod schemas & validate middleware
    │   ├── job.controller.js         # CRUD + soft delete handlers
    │   └── job.routes.js             # /api/jobs routes
    ├── categories/
    │   ├── category.model.js         # Category Mongoose schema (with soft delete)
    │   ├── category.validation.js    # Zod validation schema
    │   ├── category.controller.js    # CRUD + soft delete handlers
    │   └── category.routes.js        # /api/categories routes
    └── applications/
        ├── application.model.js      # Application Mongoose schema (with soft delete)
        ├── application.validation.js # Zod schemas (email & URL checks)
        ├── application.controller.js # CRUD + soft delete handlers
        └── application.routes.js     # /api/applications routes
```

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** (local instance or MongoDB Atlas)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/MirFaisal/QuickHire-backend.git
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

> **Protected** routes require the header: `Authorization: Bearer <token>`

### Auth

| Method | Endpoint          | Access | Description       |
| ------ | ----------------- | ------ | ----------------- |
| POST   | `/api/auth/login` | Public | Admin login (JWT) |

**Request body:**

```json
{ "email": "admin@example.com", "password": "yourpassword" }
```

### Jobs

| Method | Endpoint                | Access    | Description                |
| ------ | ----------------------- | --------- | -------------------------- |
| GET    | `/api/jobs`             | Public    | List all active jobs       |
| GET    | `/api/jobs/:id`         | Public    | Get a single job           |
| POST   | `/api/jobs`             | Protected | Create a new job           |
| DELETE | `/api/jobs/:id`         | Protected | Soft delete a job          |
| GET    | `/api/jobs/deleted`     | Protected | List all soft-deleted jobs |
| PATCH  | `/api/jobs/restore/:id` | Protected | Restore a soft-deleted job |

**Create Job request body:**

```json
{
  "title": "Backend Developer",
  "company": "QuickHire Inc.",
  "location": "Remote",
  "category": "664f1e2a3b5c7d001a2b3c4d",
  "description": "Build REST APIs with Node.js."
}
```

### Categories

| Method | Endpoint                      | Access    | Description                      |
| ------ | ----------------------------- | --------- | -------------------------------- |
| GET    | `/api/categories`             | Public    | List all active categories       |
| POST   | `/api/categories`             | Protected | Create a new category            |
| DELETE | `/api/categories/:id`         | Protected | Soft delete a category           |
| GET    | `/api/categories/deleted`     | Protected | List all soft-deleted categories |
| PATCH  | `/api/categories/restore/:id` | Protected | Restore a soft-deleted category  |

**Create Category request body:**

```json
{
  "name": "Engineering",
  "icon": "code"
}
```

### Applications

| Method | Endpoint                        | Access    | Description                        |
| ------ | ------------------------------- | --------- | ---------------------------------- |
| GET    | `/api/applications`             | Protected | List all active applications       |
| POST   | `/api/applications`             | Public    | Submit a job application           |
| DELETE | `/api/applications/:id`         | Protected | Soft delete an application         |
| GET    | `/api/applications/deleted`     | Protected | List all soft-deleted applications |
| PATCH  | `/api/applications/restore/:id` | Protected | Restore a soft-deleted application |

**Submit Application request body:**

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

## Soft Delete

All three models (Job, Category, Application) use a **reusable Mongoose soft-delete plugin** that adds:

- `isDeleted` (Boolean) and `deletedAt` (Date) fields to each document
- `find` / `findOne` / `countDocuments` query hooks that automatically exclude soft-deleted records
- `softDeleteById(id)` static method to mark a document as deleted
- `restoreById(id)` static method to restore a soft-deleted document

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
- **Duplicate key** (e.g., duplicate category name) → `409`
- **Mongoose ValidationError** → `400`

## Author

**Mir Faisal Ahmad**
