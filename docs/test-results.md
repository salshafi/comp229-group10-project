# API test results

| # | Request | Expected | Actual | Pass |
|---|---|---|---|---|
| 1 | GET /api/health | 200 {"ok":true} | | |
| 2 | POST /api/auth/register (valid) | 201 | | |
| 3 | POST /api/auth/register (duplicate email) | 400 | | |
| 4 | POST /api/auth/login (valid) | 200 + token | | |
| 5 | POST /api/auth/login (wrong password) | 401 | | |
| 6 | POST /api/items (with token) | 201 | | |
| 7 | POST /api/items (no token) | 401 | | |
| 8 | GET /api/items | 200 list | | |
| 9 | PUT /api/items/:id (with token) | 200 | | |
| 10 | DELETE /api/items/:id (with token) | 200 | | |
