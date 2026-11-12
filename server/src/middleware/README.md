# Middleware  [Week 6]

- `auth.js`: `requireSignin` checks the JWT (Authorization Bearer header or cookie) and rejects with 401 when missing or invalid.
- Optional: `hasAuthorization` to check that the user owns the record they change.
