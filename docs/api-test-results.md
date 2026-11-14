# FindIt API – Automated Test Results

Run: 2026-11-14T20:39:55.325Z  
Target: http://localhost:5000/api  
Runner: `server/tests/api-tests.mjs` (Node v24.15.0)  
**Result: 51/51 passed, 0 failed**


## Authentication

| # | Test | Request | Expected | Actual | Result |
|---|------|---------|----------|--------|--------|
| 1 | Health check | `GET /health` | 200 | 200 | PASS |
| 2 | Register user A | `POST /auth/register` | 201 | 201 | PASS |
| 3 | Register user B | `POST /auth/register` | 201 | 201 | PASS |
| 4 | Register duplicate email | `POST /auth/register` | 409 | 409 | PASS |
| 5 | Register invalid email | `POST /auth/register` | 400 | 400 | PASS |
| 6 | Register short password | `POST /auth/register` | 400 | 400 | PASS |
| 7 | Register short name | `POST /auth/register` | 400 | 400 | PASS |
| 8 | Register cannot self-assign admin role | `POST /auth/register` | 201 | 201 | PASS |
| 9 | Login valid | `POST /auth/login` | 200 | 200 | PASS |
| 10 | Login wrong password | `POST /auth/login` | 401 | 401 | PASS |
| 11 | Login unknown email | `POST /auth/login` | 401 | 401 | PASS |
| 12 | Login missing fields | `POST /auth/login` | 400 | 400 | PASS |
| 13 | GET /auth/me with token | `GET /auth/me` | 200 | 200 | PASS |
| 14 | GET /auth/me without token | `GET /auth/me` | 401 | 401 | PASS |
| 15 | GET /auth/me with invalid token | `GET /auth/me` | 401 | 401 | PASS |

## Items – Create / Read

| # | Test | Request | Expected | Actual | Result |
|---|------|---------|----------|--------|--------|
| 16 | List items (public, no token) | `GET /items` | 200 | 200 | PASS |
| 17 | Create item without token | `POST /items` | 401 | 401 | PASS |
| 18 | Create item (user A) | `POST /items` | 201 | 201 | PASS |
| 19 | Create item missing required field | `POST /items` | 400 | 400 | PASS |
| 20 | Create item invalid category | `POST /items` | 400 | 400 | PASS |
| 21 | Create item invalid type | `POST /items` | 400 | 400 | PASS |
| 22 | Create item ignores spoofed createdBy | `POST /items` | 201 | 201 | PASS |
| 23 | Get item by id | `GET /items/:id` | 200 | 200 | PASS |
| 24 | Get item – unknown id | `GET /items/:id` | 404 | 404 | PASS |
| 25 | Get item – malformed id | `GET /items/:id` | 400 | 400 | PASS |
| 26 | Filter by type=lost | `GET /items?type=lost` | 200 | 200 | PASS |
| 27 | Filter by category=Bags | `GET /items?category=Bags` | 200 | 200 | PASS |
| 28 | Search by keyword | `GET /items?search=backpack` | 200 | 200 | PASS |

## Items – Update / Delete and authorization

| # | Test | Request | Expected | Actual | Result |
|---|------|---------|----------|--------|--------|
| 29 | Update item without token | `PUT /items/:id` | 401 | 401 | PASS |
| 30 | Update another user's item (B → A's) | `PUT /items/:id` | 403 | 403 | PASS |
| 31 | Delete another user's item (B → A's) | `DELETE /items/:id` | 403 | 403 | PASS |
| 32 | Update own item (owner A) | `PUT /items/:id` | 200 | 200 | PASS |
| 33 | Update unknown item | `PUT /items/:id` | 404 | 404 | PASS |
| 34 | Delete own item (owner A) | `DELETE /items/:id` | 200 | 200 | PASS |
| 35 | Deleted item now 404 | `GET /items/:id` | 404 | 404 | PASS |

## Users – access control

| # | Test | Request | Expected | Actual | Result |
|---|------|---------|----------|--------|--------|
| 36 | List users as normal user | `GET /users` | 403 | 403 | PASS |
| 37 | List users without token | `GET /users` | 401 | 401 | PASS |
| 38 | Get own profile | `GET /users/:id` | 200 | 200 | PASS |
| 39 | Get another user's profile | `GET /users/:id` | 403 | 403 | PASS |
| 40 | Update own name | `PUT /users/:id` | 200 | 200 | PASS |
| 41 | Role change attempt is ignored | `PUT /users/:id` | 200 | 200 | PASS |
| 42 | Update another user's profile | `PUT /users/:id` | 403 | 403 | PASS |
| 43 | Delete user as normal user | `DELETE /users/:id` | 403 | 403 | PASS |

## Admin role

| # | Test | Request | Expected | Actual | Result |
|---|------|---------|----------|--------|--------|
| 44 | Admin login returns role admin | `POST /auth/login` | 200 | 200 | PASS |
| 45 | Admin lists all users | `GET /users` | 200 | 200 | PASS |
| 46 | Admin views another user's profile | `GET /users/:id` | 200 | 200 | PASS |
| 47 | Admin edits another user's item | `PUT /items/:id` | 200 | 200 | PASS |
| 48 | Admin deletes another user's item | `DELETE /items/:id` | 200 | 200 | PASS |
| 49 | Admin deletes user B | `DELETE /users/:id` | 200 | 200 | PASS |
| 50 | Deleted user token is rejected | `GET /auth/me` | 401 | 401 | PASS |
| 51 | Admin delete unknown user | `DELETE /users/:id` | 404 | 404 | PASS |
