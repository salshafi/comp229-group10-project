# FindIt System Architecture

## 1. Architecture summary

FindIt uses a client-server architecture:

```text
Browser
  |
  | React UI / React Router
  | fetch() requests to /api/*
  v
Vite development server (localhost:5173)
  |
  | Development proxy
  v
Express API (localhost:5000)
  |
  +--> Routes
  |      |
  |      +--> Authentication middleware
  |      +--> Administrator middleware
  |      |
  |      v
  |    Controllers
  |      |
  |      v
  |    Mongoose Models
  |      |
  v      v
MongoDB database (users, items)
```

The Vite proxy is used during local development. A production deployment must provide its own frontend-to-API routing configuration.

## 2. Frontend components

- `main.jsx`: mounts the React application and providers.
- `App.jsx`: defines the client routes.
- `context/AuthContext.jsx`: stores current user state and login/register/logout operations.
- `services/api.js`: centralizes JSON requests and attaches the JWT bearer token.
- `components/ProtectedRoute.jsx`: redirects unauthenticated users to login.
- `components/Layout.jsx`: authenticated application shell and navigation.
- `components/ItemCard.jsx`: reusable listing summary.
- `pages/`: dashboard, browse, item detail, item form, login, and registration pages.
- `styles.css`: application styles.

The protected route is a user-experience control. The backend remains responsible for enforcing API authorization.

## 3. Backend MVC structure

### Entry points
- `src/server.js` loads environment variables, checks required settings, connects to MongoDB, and starts Express.
- `src/app.js` configures middleware, health route, API routes, not-found handling, and error handling.

### Configuration
- `src/config/db.js` connects Mongoose using `MONGODB_URI`.

### Models
- `src/models/User.js` defines user fields, roles, unique email, and timestamps.
- `src/models/Item.js` defines listing fields, allowed values, creator reference, timestamps, and a text index.

### Routes
- `authRoutes.js`: registration, login, current user.
- `itemRoutes.js`: item list/detail/create/update/delete.
- `userRoutes.js`: administrator user list, profile view/update, administrator user deletion.

### Controllers
- `authController.js`: validates registration, hashes passwords, compares login credentials, issues JWTs.
- `itemController.js`: listing search/filter and CRUD plus ownership checks.
- `userController.js`: safe user responses and profile/user operations.

### Middleware
- `auth.js`: verifies bearer tokens and loads the authenticated user; includes `adminOnly`.
- `errorHandler.js`: handles unknown routes and common database/server errors.

## 4. Typical request lifecycle

1. The browser calls `apiRequest()` with a relative `/api` path.
2. The API helper reads `findit_token` from local storage.
3. If present, the helper sends `Authorization: Bearer <token>`.
4. Express receives the request and applies Helmet, CORS, JSON parsing, and Morgan logging.
5. Express routes the request to the matching router.
6. Protected routes execute `protect`.
7. `protect` verifies the JWT and loads the corresponding user from MongoDB.
8. Controller logic checks input, ownership, and/or role.
9. Mongoose reads or updates the relevant document.
10. Express returns a JSON response.
11. The frontend updates its state or displays an error.

## 5. Authorization rules

- Public: health, item list, item detail, register, login.
- Authenticated: current user, item creation, own profile view/update.
- Owner/admin: update or delete an item.
- Admin only: list users and delete a user.
- Self/admin: view or update a user profile.

## 6. Configuration and ports

| Component | Local address | Configuration |
|---|---|---|
| Vite frontend | `http://localhost:5173` | Vite default |
| Express backend | `http://localhost:5000` | `PORT` |
| MongoDB | Atlas/local URI | `MONGODB_URI` |
| CORS allowed origin | `http://localhost:5173` | `CLIENT_ORIGIN` |

## 7. Design boundaries

- The frontend does not connect directly to MongoDB.
- Controllers use Mongoose models; routes do not contain database business logic.
- The server assigns `createdBy` from the authenticated account.
- The client does not control a user's role through profile updates.
- JWTs are bearer tokens, not cookies.
- The current API returns all matching items; pagination is not implemented.
