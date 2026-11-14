# FindIt Security and Deployment Notes

## 1. Implemented controls

- Passwords are hashed with bcryptjs using 12 salt rounds.
- The User model excludes the password field from normal queries.
- JWT authentication is enforced by `protect` middleware.
- The server loads the user from the database for protected requests.
- Listing update/delete operations check creator ownership or administrator role.
- Administrator-only user operations use `adminOnly`.
- User profile responses omit password data.
- Profile update does not allow role changes.
- Helmet adds HTTP security headers.
- CORS uses `CLIENT_ORIGIN`.
- JSON request body parsing is limited to 1 MB.

## 2. Important limitations

This is a student first-release project, not a production security assessment.

- JWT is stored in browser `localStorage`; an XSS vulnerability could expose it.
- There is no rate limiting or account lockout.
- There is no email verification or password reset.
- No audit trail records administrator actions.
- There is no automated security test suite.
- Contact email is shown as listing data; the app does not provide private messaging.
- Production HTTPS and deployment routing must be configured by the hosting environment.

## 3. Before deployment

- Create a dedicated production MongoDB database and restricted database user.
- Set production `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`, and `CLIENT_ORIGIN` in the hosting provider's secret/environment settings.
- Use a strong, unique JWT secret and rotate any exposed credential.
- Configure HTTPS.
- Configure production frontend-to-backend routing; the Vite proxy only serves local development.
- Restrict CORS to the exact production frontend origin.
- Do not expose MongoDB publicly beyond the required application hosts.
- Add rate limiting, logging/monitoring, backups, and operational alerts.
- Review data retention, moderation, privacy, and account deletion policies.
- Test authorization using separate regular-user and administrator accounts.

## 4. Secret handling

- Keep `server/.env` local.
- Commit `.env.example` with placeholder values only.
- If a secret is accidentally committed, removing it in a later commit is not sufficient. Rotate the secret/credential and remove it from repository history as appropriate.
- Never include real credentials, JWTs, or private student information in screenshots or documentation.
