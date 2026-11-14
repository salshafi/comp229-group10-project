# Developer Setup and Testing Guide

## 1. Requirements

- Node.js 20 or later and npm
- MongoDB Atlas or local MongoDB
- Git
- Postman (recommended)
- A code editor such as VS Code

## 2. Clone and install

```powershell
git clone https://github.com/salshafi/comp229-group10-project.git
cd comp229-group10-project
```

Install all dependencies:

```powershell
npm install
npm run install:all
```

Or install individually with `npm install` in `server` and `client`.

## 3. Configure server environment

```powershell
cd server
Copy-Item .env.example .env
```

Set `MONGODB_URI` and `JWT_SECRET` in `.env`. Keep this file local and private.

## 4. Run the application

Terminal 1:

```powershell
cd server
npm run dev
```

Terminal 2:

```powershell
cd client
npm run dev
```

Open the Vite URL, normally `http://localhost:5173`.

Alternatively, after installing root dependencies and both workspaces:

```powershell
npm run dev
```

## 5. API smoke test

Call:

```http
GET http://localhost:5000/api/health
```

Expected:

```json
{ "status": "ok", "app": "FindIt API" }
```

Import `postman/FindIt.postman_collection.json` into Postman for the supplied API collection. Register/login first and use the returned JWT as a Bearer token for protected endpoints.

## 6. Recommended test matrix

| Test | Request/action | Expected result |
|---|---|---|
| API health | GET `/api/health` | `200` |
| Register | POST `/api/auth/register` with valid data | `201` |
| Duplicate email | Register same email again | `409` |
| Invalid registration | Password shorter than 8 characters | `400` |
| Login | POST `/api/auth/login` with correct credentials | `200` |
| Invalid login | Wrong password | `401` |
| Current user | GET `/api/auth/me` with token | `200` |
| Missing token | GET `/api/auth/me` without token | `401` |
| Create item | POST `/api/items` with valid token/body | `201` |
| List items | GET `/api/items` | `200` |
| Search | GET `/api/items?search=library` | Matching items |
| Filter type | GET `/api/items?type=lost` | Lost items |
| Filter category | GET `/api/items?category=Electronics` | Matching category |
| Get item | GET `/api/items/:id` | `200` |
| Update own item | PUT own item with owner token | `200` |
| Update another user's item | PUT item with other regular user's token | `403` |
| Delete own item | DELETE own item with owner token | `200` |
| List users as regular user | GET `/api/users` | `403` |
| List users as admin | GET `/api/users` with admin token | `200` |
| Delete user as regular user | DELETE `/api/users/:id` | `403` |
| Delete user as admin | DELETE `/api/users/:id` with admin token | `200` |

Execute these tests in the current codebase and record actual response codes and evidence. This table is a plan, not a claim that every test has passed.

## 7. Team verification checklist

- [ ] Fresh dependency installation works.
- [ ] MongoDB connection uses the intended database.
- [ ] Health endpoint responds.
- [ ] Registration validation works.
- [ ] Duplicate email is rejected.
- [ ] Login success and failure cases work.
- [ ] Missing/invalid/expired token cases work.
- [ ] User role restrictions work.
- [ ] Item create/read/update/delete works.
- [ ] Owner/admin authorization works.
- [ ] Search and filters work.
- [ ] Frontend register/login/logout works.
- [ ] Frontend browse/search/filter works.
- [ ] Frontend create/detail/edit/delete works.
- [ ] Responsive layout checked at desktop and mobile widths.
- [ ] `.env` and secrets are not tracked by Git.
- [ ] Another team member reviewed the changes.

## 8. Git safety before commit

```powershell
git status
git diff --cached --stat
```

Never stage `.env`, `node_modules`, or generated build folders. Review staged changes before committing.
