# FindIt — Campus Lost & Found Management System

**COMP229 Group Project · First Release · Version 1.0**

FindIt is a campus-focused web application for reporting lost and found belongings. Members can create accounts, browse listings, search and filter items, view listing details, and create, edit, or delete their own listings. Administrators have additional item and user-management permissions through the API.

> **Project status:** This repository contains the first-release implementation and supporting documentation. A successful backend/MongoDB connection has previously been observed in the development environment, but every frontend workflow and every API authorization/error case must still be tested by the team before being described as fully verified.

---

## Contents

- [1. Project overview](#1-project-overview)
- [2. First-release features](#2-first-release-features)
- [3. Technology stack](#3-technology-stack)
- [4. Repository structure](#4-repository-structure)
- [5. Prerequisites](#5-prerequisites)
- [6. Installation and local setup](#6-installation-and-local-setup)
- [7. Environment configuration](#7-environment-configuration)
- [8. Running the application](#8-running-the-application)
- [9. User guide](#9-user-guide)
- [10. Roles and permissions](#10-roles-and-permissions)
- [11. Data model](#11-data-model)
- [12. REST API reference](#12-rest-api-reference)
- [13. Authentication flow](#13-authentication-flow)
- [14. Validation and error responses](#14-validation-and-error-responses)
- [15. Testing with Postman](#15-testing-with-postman)
- [16. Troubleshooting](#16-troubleshooting)
- [17. Security and privacy notes](#17-security-and-privacy-notes)
- [18. Git collaboration workflow](#18-git-collaboration-workflow)
- [19. Build and production considerations](#19-build-and-production-considerations)
- [20. Known limitations and future improvements](#20-known-limitations-and-future-improvements)
- [21. Team and academic submission notes](#21-team-and-academic-submission-notes)
- [22. Supporting documentation](#22-supporting-documentation)

---

## 1. Project overview

FindIt provides one central place for a campus community to report and search for belongings that have been lost or found. Instead of relying only on informal messages or notices, users can publish structured listings containing an item description, category, type, location, date, and contact email.

### Project objectives

1. Provide account registration and sign-in.
2. Store users and item listings in MongoDB.
3. Allow users to browse, search, and filter item listings.
4. Allow authenticated users to report lost or found items.
5. Restrict listing updates and deletion to the listing owner or an administrator.
6. Provide a documented REST API that can be tested independently from the React interface.

### Intended users

- **Campus member:** registers, signs in, browses listings, reports an item, and manages their own listings.
- **Administrator:** has the additional ability to manage listings and use the administrative user endpoints.

## 2. First-release features

| Area | Included in this release |
|---|---|
| Accounts | Register, login, retrieve current account |
| Authentication | JSON Web Token (JWT) bearer authentication |
| Password handling | Passwords hashed with bcryptjs |
| Listings | Create, read, update, and delete item listings |
| Search | Keyword search against title, description, and location |
| Filters | Lost/found type, category, and status |
| Authorization | Authenticated access and owner/admin listing permissions |
| User API | Admin list/delete users; self/admin view/update a profile |
| Interface | React pages for login, registration, dashboard, browsing, item details, and item forms |

The current first release does **not** include email verification, password reset, direct in-app messaging, image file uploads, notifications, or a full administrator dashboard.

## 3. Technology stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18 | User interface and reusable components |
| Frontend tooling | Vite 6 | Development server and production build |
| Navigation | React Router 6 | Client-side page routing |
| Icons | lucide-react | Interface icons |
| Backend runtime | Node.js | JavaScript server runtime |
| Backend framework | Express 4 | REST API and middleware |
| Database | MongoDB | Persistent document storage |
| ODM | Mongoose 8 | Schemas, models, and database operations |
| Authentication | jsonwebtoken | Signing and verifying JWTs |
| Password hashing | bcryptjs | Secure password hashing |
| Validation | express-validator and Mongoose schema validation | Request and model validation |
| Security middleware | Helmet, CORS | HTTP security headers and cross-origin policy |
| Logging | Morgan | HTTP request logging |
| API testing | Postman | Manual REST API testing |

## 4. Repository structure

```text
findit-project/
├── client/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── styles.css
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── services/
│       │   └── api.js
│       ├── components/
│       │   ├── Layout.jsx
│       │   ├── ItemCard.jsx
│       │   └── ProtectedRoute.jsx
│       └── pages/
│           ├── Dashboard.jsx
│           ├── Items.jsx
│           ├── ItemDetail.jsx
│           ├── ItemForm.jsx
│           ├── Login.jsx
│           └── Register.jsx
├── server/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── server.js
│       ├── app.js
│       ├── config/
│       │   └── db.js
│       ├── models/
│       │   ├── User.js
│       │   └── Item.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── itemRoutes.js
│       │   └── userRoutes.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── itemController.js
│       │   └── userController.js
│       └── middleware/
│           ├── auth.js
│           └── errorHandler.js
├── docs/
├── postman/
│   └── FindIt.postman_collection.json
├── .gitignore
├── package.json
└── README.md
```

### Backend MVC responsibilities

- **Models:** define MongoDB document structure and validation rules.
- **Routes:** map HTTP methods and URL paths to middleware and controller functions.
- **Controllers:** implement request handling and business logic.
- **Middleware:** authenticate users, enforce administrator access, and handle errors.
- **Configuration:** connect Mongoose to the MongoDB URI.
- **Application/server entry points:** register middleware/routes and start the HTTP server.

## 5. Prerequisites

Install the following before running FindIt:

1. **Node.js and npm.** Node.js 20 or later is recommended for this project.
2. **MongoDB Atlas account** or a local MongoDB server.
3. **Git** to clone and collaborate on the repository.
4. **Postman** to test API endpoints.
5. **Visual Studio Code** or another code editor.

Check your installations in PowerShell:

```powershell
node --version
npm --version
git --version
```

## 6. Installation and local setup

### Option A — install dependencies separately

Open PowerShell in the project root:

```powershell
cd "C:\path\to\comp229-group10-project"
```

Install backend dependencies:

```powershell
cd server
npm install
```

Configure the environment file as described in the next section, then install frontend dependencies:

```powershell
cd ..\client
npm install
```

### Option B — install both from the project root

The root package contains an `install:all` script:

```powershell
npm install
npm run install:all
```

The root `npm install` installs the root development dependency (`concurrently`); `install:all` installs the server and client dependencies.

## 7. Environment configuration

The backend reads environment variables from `server/.env`. A safe example file is provided at `server/.env.example`.

From the `server` folder, create the local environment file:

```powershell
Copy-Item .env.example .env
```

Open `server/.env` and set the values:

```dotenv
PORT=5000
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@YOUR-CLUSTER.mongodb.net/findit?retryWrites=true&w=majority
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=1d
CLIENT_ORIGIN=http://localhost:5173
```

| Variable | Required | Description |
|---|---:|---|
| `PORT` | No | Backend port; defaults to `5000` |
| `MONGODB_URI` | Yes | MongoDB connection string, including the intended database name |
| `JWT_SECRET` | Yes | Long, private secret used to sign and verify tokens |
| `JWT_EXPIRES_IN` | No | JWT lifetime; defaults to `1d` |
| `CLIENT_ORIGIN` | No | Allowed frontend origin; defaults to `http://localhost:5173` |

### MongoDB Atlas checklist

1. Create or select a MongoDB Atlas project and cluster.
2. Create a database user with a strong password.
3. Add your current development IP address to Network Access.
4. Open **Connect → Drivers**, select Node.js, and copy the connection string.
5. Replace the username, password, and cluster host in the URI.
6. Ensure the URI path names the intended database, for example `/findit`.
7. If the password contains reserved URL characters, URL-encode those characters.
8. Save the URI only in `server/.env`.

Mongoose creates the `users` and `items` collections when records are first inserted. The database name comes from the URI. Confirm the database name in the backend startup message.

**Never commit `server/.env`.** The `.gitignore` excludes `.env` files while allowing `.env.example` to be committed.

## 8. Running the application

### Start the backend

Open Terminal 1:

```powershell
cd "C:\path\to\comp229-group10-project\server"
npm run dev
```

Expected startup messages should indicate that MongoDB connected and the API is listening, for example:

```text
MongoDB connected: findit
FindIt API running at http://localhost:5000
```

The database name shown depends on the database path in your own connection string.

Check the health endpoint in a browser or Postman:

```text
GET http://localhost:5000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "app": "FindIt API"
}
```

### Start the frontend

Open Terminal 2:

```powershell
cd "C:\path\to\comp229-group10-project\client"
npm run dev
```

Open the Vite URL printed in the terminal. It is normally:

```text
http://localhost:5173
```

The Vite development configuration forwards frontend requests beginning with `/api` to `http://localhost:5000`.

### Start both through the root script (optional)

After installing root, server, and client dependencies:

```powershell
cd "C:\path\to\comp229-group10-project"
npm run dev
```

This uses `concurrently` to start both development processes.

## 9. User guide

### 9.1 Create an account

1. Open the FindIt frontend.
2. Select **Create an account**.
3. Enter your name, email address, and password.
4. The password must contain at least eight characters.
5. Submit the form.
6. On successful registration, the server returns a token and the frontend signs you in.

An email address that is already registered cannot be registered again.

### 9.2 Sign in

1. Select **Sign in**.
2. Enter the registered email address and password.
3. Submit the form.
4. On success, the dashboard opens.

### 9.3 Browse and search listings

1. Open **Browse items**.
2. Enter a keyword to search listing titles, descriptions, and locations.
3. Select **Lost items** or **Found items** to filter by type.
4. Select a category to narrow the results.
5. Clear filters to return to the full listing set.
6. Open a listing to see its details.

### 9.4 Report a lost or found item

1. Sign in.
2. Select **Report an item**.
3. Enter the item title and description.
4. Select a category and choose `lost` or `found`.
5. Enter the location and date.
6. Enter a contact email.
7. Optionally provide an image URL.
8. Submit the form.

The API associates the new listing with the authenticated account. The default status is `open` if no status is supplied.

### 9.5 Edit or delete a listing

A regular user may edit or delete only listings they created. An administrator may edit or delete any listing.

Open a listing and use the available owner controls. The backend independently checks ownership; hiding a button in the frontend is not the security boundary.

### 9.6 Sign out

Use the account control in the sidebar. The frontend removes the saved JWT from local storage and clears the current user state.

## 10. Roles and permissions

| Action | Public visitor | Authenticated user | Administrator |
|---|---:|---:|---:|
| Register / login | Yes | Yes | Yes |
| Browse item listings | Yes (API) | Yes | Yes |
| View item details | Yes (API) | Yes | Yes |
| Create an item | No | Yes | Yes |
| Update own item | No | Yes | Yes |
| Update another user's item | No | No | Yes |
| Delete own item | No | Yes | Yes |
| Delete another user's item | No | No | Yes |
| Get current account | No | Yes | Yes |
| List all users | No | No | Yes |
| View/update own profile | No | Yes | Yes |
| View/update another user's profile | No | No | Yes |
| Delete a user | No | No | Yes |

### Create an administrator for a class demonstration

Public registration intentionally creates a normal `user` account. To promote a designated test account:

1. Register the account normally.
2. Open MongoDB Atlas → Browse Collections → `users`.
3. Find the correct test user by email.
4. Change only that user's `role` field from `user` to `admin`.
5. Save the document.
6. Sign out and sign in again so the frontend receives the updated role.

Do not expose a public admin-registration option. Only a trusted project administrator should change roles in the database.

## 11. Data model

### User document

Collection: `users`

| Field | Type | Rules / purpose |
|---|---|---|
| `_id` | ObjectId | MongoDB document identifier |
| `name` | String | Required, trimmed, maximum 80 characters |
| `email` | String | Required, unique, lowercase, trimmed |
| `password` | String | Required; bcryptjs hash; excluded from normal query results |
| `role` | String | `user` or `admin`; defaults to `user` |
| `createdAt` | Date | Added by Mongoose timestamps |
| `updatedAt` | Date | Added by Mongoose timestamps |

### Item document

Collection: `items`

| Field | Type | Rules / purpose |
|---|---|---|
| `_id` | ObjectId | MongoDB document identifier |
| `title` | String | Required, trimmed, maximum 100 characters |
| `description` | String | Required, trimmed, maximum 1,500 characters |
| `category` | String | Required; one of the categories below |
| `type` | String | Required; `lost` or `found` |
| `location` | String | Required, trimmed, maximum 120 characters |
| `date` | Date | Required; date associated with the item |
| `status` | String | `open`, `claimed`, or `returned`; defaults to `open` |
| `contactEmail` | String | Required, lowercase, trimmed |
| `imageUrl` | String | Optional; defaults to an empty string |
| `createdBy` | ObjectId reference | Required reference to the creating User |
| `createdAt` | Date | Added by Mongoose timestamps |
| `updatedAt` | Date | Added by Mongoose timestamps |

Allowed categories:

- `Electronics`
- `Clothing`
- `Bags`
- `Books`
- `Accessories`
- `Keys`
- `Other`

### Relationships

Each item has one `createdBy` reference to a user. A user may create multiple item listings. Deleting a user does not currently implement an automatic cascade deletion of that user's items.

## 12. REST API reference

**Base URL:** `http://localhost:5000`

All request and response bodies use JSON unless stated otherwise. Protected routes require:

```http
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

### 12.1 Health

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/health` | Public | Check API availability |

Example response:

```json
{ "status": "ok", "app": "FindIt API" }
```

### 12.2 Authentication

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a user |
| POST | `/api/auth/login` | Public | Sign in |
| GET | `/api/auth/me` | Authenticated | Return the current user |

**Register request**

```http
POST /api/auth/register
```

```json
{
  "name": "Alex Student",
  "email": "alex@example.com",
  "password": "ExamplePass123"
}
```

Success: `201 Created`

```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "USER_ID",
    "name": "Alex Student",
    "email": "alex@example.com",
    "role": "user"
  }
}
```

Registration validation: name must be 2–80 characters, email must be valid, and password must be at least 8 characters.

**Login request**

```http
POST /api/auth/login
```

```json
{
  "email": "alex@example.com",
  "password": "ExamplePass123"
}
```

Success: `200 OK`, returning `token` and safe user information. Missing credentials return `400`; incorrect email/password returns `401`.

**Current-user request**

```http
GET /api/auth/me
Authorization: Bearer JWT_TOKEN
```

Success: `200 OK`

```json
{
  "user": {
    "id": "USER_ID",
    "name": "Alex Student",
    "email": "alex@example.com",
    "role": "user"
  }
}
```

### 12.3 Items

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/items` | Public | List/search/filter items |
| GET | `/api/items/:id` | Public | Retrieve one item |
| POST | `/api/items` | Authenticated | Create a listing |
| PUT | `/api/items/:id` | Owner/Admin | Update a listing |
| DELETE | `/api/items/:id` | Owner/Admin | Delete a listing |

**List items**

```http
GET /api/items
```

Optional query parameters:

| Parameter | Example | Behavior |
|---|---|---|
| `search` | `?search=library` | Case-insensitive match against title, description, or location |
| `type` | `?type=lost` | Filter by `lost` or `found` |
| `category` | `?category=Electronics` | Exact category filter |
| `status` | `?status=open` | Filter by `open`, `claimed`, or `returned` |

Parameters can be combined:

```http
GET /api/items?search=library&type=lost&category=Electronics&status=open
```

The response contains a count and an array of items:

```json
{
  "count": 1,
  "items": [
    {
      "_id": "ITEM_ID",
      "title": "Black headphones",
      "description": "Over-ear headphones in a black case.",
      "category": "Electronics",
      "type": "lost",
      "location": "Campus library",
      "date": "2026-11-10T00:00:00.000Z",
      "status": "open",
      "contactEmail": "alex@example.com",
      "imageUrl": "",
      "createdBy": {
        "_id": "USER_ID",
        "name": "Alex Student"
      }
    }
  ]
}
```

**Get one item**

```http
GET /api/items/ITEM_ID
```

Success: `200 OK` with `{ "item": { ... } }`. If no item exists, the API returns `404`.

**Create an item**

```http
POST /api/items
Authorization: Bearer JWT_TOKEN
```

```json
{
  "title": "Black headphones",
  "description": "Over-ear headphones in a black case.",
  "category": "Electronics",
  "type": "lost",
  "location": "Campus library",
  "date": "2026-11-10",
  "status": "open",
  "contactEmail": "alex@example.com",
  "imageUrl": ""
}
```

The required request values are `title`, `description`, `category`, `type`, `location`, `date`, and `contactEmail`. `createdBy` is assigned by the server from the authenticated user; clients must not choose another owner.

Success: `201 Created`.

**Update an item**

```http
PUT /api/items/ITEM_ID
Authorization: Bearer JWT_TOKEN
```

Send only the fields to change, for example:

```json
{
  "status": "claimed",
  "description": "Updated description."
}
```

The owner or an administrator may update these fields: `title`, `description`, `category`, `type`, `location`, `date`, `status`, `contactEmail`, and `imageUrl`.

Success: `200 OK`. A non-owner regular user receives `403`.

**Delete an item**

```http
DELETE /api/items/ITEM_ID
Authorization: Bearer JWT_TOKEN
```

The owner or an administrator may delete the listing. Success: `200 OK` with a confirmation message.

### 12.4 Users

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/users` | Admin | List all users |
| GET | `/api/users/:id` | Self/Admin | View a user profile |
| PUT | `/api/users/:id` | Self/Admin | Update name/email |
| DELETE | `/api/users/:id` | Admin | Delete a user |

User responses deliberately omit the password hash.

**List users**

```http
GET /api/users
Authorization: Bearer ADMIN_JWT_TOKEN
```

Success: `200 OK` with a count and `users` array. A regular user receives `403`.

**View profile**

```http
GET /api/users/USER_ID
Authorization: Bearer JWT_TOKEN
```

A user can view their own profile. An administrator can view any profile.

**Update profile**

```http
PUT /api/users/USER_ID
Authorization: Bearer JWT_TOKEN
```

```json
{
  "name": "Alex Student",
  "email": "alex.new@example.com"
}
```

Only `name` and `email` are updated by this endpoint. Role changes are deliberately excluded.

**Delete user**

```http
DELETE /api/users/USER_ID
Authorization: Bearer ADMIN_JWT_TOKEN
```

Administrator only. This endpoint deletes the user record. The current implementation does not cascade-delete that user's item listings.

## 13. Authentication flow

1. The user submits registration or login credentials to the API.
2. During registration, the server validates the name/email/password and hashes the password with bcryptjs using 12 salt rounds.
3. During login, the server retrieves the stored password hash and compares it with the submitted password.
4. On success, the server signs a JWT containing the user's database ID.
5. The frontend stores the returned token in browser `localStorage` under the key `findit_token`.
6. `client/src/services/api.js` adds the token to protected requests using the `Authorization: Bearer <token>` header.
7. The `protect` middleware verifies the JWT, loads the user, and attaches the user document to `req.user`.
8. Route/controller checks enforce owner or administrator permissions.

The token is sent in an **Authorization header**, not in a cookie.

## 14. Validation and error responses

Common status codes:

| HTTP status | Meaning | Example |
|---|---|---|
| `200` | Request succeeded | Read/update/delete success |
| `201` | Resource created | Registration or item creation |
| `400` | Invalid or incomplete request | Missing required item fields; validation error |
| `401` | Authentication required or invalid | Missing/expired JWT; incorrect login |
| `403` | Authenticated but not permitted | User attempts to edit another user's listing |
| `404` | Resource/route not found | Missing item or unknown route |
| `409` | Conflict | Email already registered |
| `500` | Unexpected server error | Unhandled server-side failure |

Example error body:

```json
{ "message": "Authentication required." }
```

The error handler also maps duplicate-key errors to `409`, Mongoose validation errors to `400`, and invalid MongoDB ObjectId cast errors to `400`.

## 15. Testing with Postman

Import:

```text
postman/FindIt.postman_collection.json
```

Set the base URL to:

```text
http://localhost:5000
```

Recommended manual test sequence:

1. `GET /api/health` — confirm API is running.
2. Register a new test account.
3. Login and copy the returned token.
4. Call `GET /api/auth/me` with the bearer token.
5. Create an item with `POST /api/items`.
6. List items with `GET /api/items`.
7. Test search and each filter.
8. Retrieve the new item by ID.
9. Update the item as its owner.
10. Attempt an update using a different regular user's token; expected `403`.
11. Delete the item as its owner.
12. Call a protected route without a token; expected `401`.
13. Call `GET /api/users` as a regular user; expected `403`.
14. Promote a controlled test account to admin in MongoDB and verify admin-only routes.

Use test accounts and test listings. Do not use real personal information. Record actual results in the team's test document. Do not mark a test as passed until it has been executed.

## 16. Troubleshooting

### `MONGODB_URI or JWT_SECRET` missing

- Confirm the file is named `server/.env`, not `.env.txt`.
- Confirm it is inside the `server` directory.
- Confirm both required variables are present.
- Restart the backend after changing environment variables.

### MongoDB `bad auth : authentication failed`

- Check the Atlas database username and password.
- Confirm the database user exists and has appropriate privileges.
- If the password contains special characters, URL-encode them in the URI.
- Do not confuse the Atlas website login with the database user credentials.
- If a credential was shared or committed, rotate it immediately.

### MongoDB network connection fails

- Add the current IP address in Atlas Network Access.
- Confirm the cluster is running.
- Check that the URI hostname is correct.
- Confirm internet connectivity.

### Backend starts but browser shows a 404 at `/`

The project defines `/api/health`; it does not define a homepage route at `/`. Test:

```text
http://localhost:5000/api/health
```

### Frontend cannot reach the API

- Confirm the backend is running on port `5000`.
- Confirm Vite is running on port `5173`.
- Check `client/vite.config.js` proxy target.
- Restart Vite after changing its configuration.

### Port already in use

Stop the other process using the port or set a different backend `PORT` in `server/.env`. If you change the backend port, update the Vite proxy target too.

### Login appears to fail after promoting a user to admin

Sign out and sign in again. The role is included in the user response, and the frontend needs a fresh login response to display the updated role.

## 17. Security and privacy notes

- Never commit `.env` files, database credentials, JWT secrets, or real user data.
- Use a unique, long random `JWT_SECRET`.
- Passwords are hashed; plaintext passwords are not stored.
- Password hashes are excluded from normal User queries and API responses.
- Protected API routes verify JWTs on the server.
- Listing ownership is checked on the server.
- Administrator-only routes check the database role.
- Helmet adds common HTTP security headers.
- CORS is restricted to the configured frontend origin.
- Do not paste tokens or credentials into screenshots, reports, issue trackers, or chat.
- Use HTTPS in any hosted deployment.
- Browser `localStorage` token storage is convenient for this course prototype but is more exposed to cross-site scripting than an HttpOnly-cookie design. Review the authentication storage strategy before production use.
- This is an academic first release, not a production-ready service. Rate limiting, email verification, password reset, audit logging, stronger input controls, monitoring, backups, and a production deployment review remain future work.

## 18. Git collaboration workflow

Use feature branches and pull requests so team members can work without overwriting one another.

Example:

```powershell
git switch main
git pull origin main
git switch -c feature/short-feature-name

git status
git add client/ server/ docs/ postman/
git diff --cached --stat
git commit -m "Describe the change"
git push -u origin feature/short-feature-name
```

Then open a pull request into `main`.

Before committing:

```powershell
git status
```

Confirm that `.env`, `node_modules`, and build output are not staged. Do not overwrite another member's changes. Pull the latest `main` before starting work, communicate file ownership, and ask another member to review the pull request.

## 19. Build and production considerations

Create a production frontend build:

```powershell
cd client
npm run build
```

Vite writes the generated frontend assets to `client/dist/`.

Preview the build locally:

```powershell
npm run preview
```

The backend production start command is:

```powershell
cd server
npm start
```

A real deployment still requires a hosted MongoDB database, secure environment variables, HTTPS, a production frontend origin, and a deployment platform/configuration. The current Vite proxy is a development-server proxy and is not a production reverse proxy. Configure production API routing separately.

## 20. Known limitations and future improvements

Current known scope/limitations:

- No email verification or password reset.
- No in-app chat or notification delivery.
- Images are represented by an optional URL; there is no file-upload service.
- No pagination is implemented in the item listing endpoint.
- No dedicated admin dashboard page is implemented; administrator capabilities are exposed through protected API endpoints.
- Deleting a user does not automatically delete or reassign their item listings.
- There is no automated unit/integration test suite included; use the Postman collection and record the actual outcomes.
- No production hosting configuration is included.

Possible future improvements:

1. Add pagination and sorting controls.
2. Add image upload with file type/size validation.
3. Add email verification and password reset.
4. Add a secure notification/contact workflow.
5. Add admin UI for user and listing moderation.
6. Add automated tests for authentication, validation, CRUD, and authorization.
7. Add rate limiting, audit logs, and monitoring.
8. Define retention and moderation policies for campus data.

## 21. Team and academic submission notes

Before submission, the team should:

- Confirm the approved team name and final logo.
- Complete and sign the team contract.
- Confirm the instructor has approved the team's membership count if it is outside the handout's stated range.
- Update the External Design Document with actual application screenshots and final team information.
- Maintain a Product Backlog and task board with genuine team tasks and progress.
- Ensure every member makes meaningful commits and can explain their contribution.
- Record actual API test results, including success, validation, `401`, and `403` cases.
- Prepare the required demonstration video and slides.
- Submit the project as a ZIP, not RAR, and exclude `node_modules` and secrets.

Do not claim a feature or test is complete unless it has been demonstrated on the current team repository.

## 22. Supporting documentation

See the `docs/` directory:

| File | Purpose |
|---|---|
| `SYSTEM_ARCHITECTURE.md` | Architecture, request lifecycle, folder responsibilities |
| `API_REFERENCE.md` | Compact endpoint, permission, request, and response reference |
| `DATABASE_SCHEMA.md` | MongoDB collections, fields, enums, and relationships |
| `USER_GUIDE.md` | Step-by-step guide for campus members and administrators |
| `DEVELOPER_SETUP_AND_TESTING.md` | Environment setup, run commands, Postman workflow, verification checklist |
| `SECURITY_AND_DEPLOYMENT.md` | Security controls, limitations, and deployment checklist |
| `PROJECT_SCOPE_AND_DESIGN.md` | Existing first-release scope and design draft |
| `AGILE_BACKLOG.md` | Initial backlog draft; update it with the team's actual board |
| `TEAM_CONTRACT_TEMPLATE.md` | Team contract template; complete and sign it |
| `DEMO_SLIDES_CONTENT.md` | Draft content for the project presentation |

The Postman collection is stored in `postman/FindIt.postman_collection.json`.
