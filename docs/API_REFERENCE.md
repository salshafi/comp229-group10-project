# FindIt REST API Reference

**Local base URL:** `http://localhost:5000`

Requests and responses use JSON. Protected endpoints require:

```http
Authorization: Bearer <JWT>
Content-Type: application/json
```

## Health

| Method | Path | Access |
|---|---|---|
| GET | `/api/health` | Public |

Response `200`:

```json
{ "status": "ok", "app": "FindIt API" }
```

## Authentication

| Method | Path | Access | Success |
|---|---|---|---|
| POST | `/api/auth/register` | Public | `201` |
| POST | `/api/auth/login` | Public | `200` |
| GET | `/api/auth/me` | Authenticated | `200` |

### Register

`POST /api/auth/register`

```json
{
  "name": "Alex Student",
  "email": "alex@example.com",
  "password": "ExamplePass123"
}
```

Rules: name 2–80 characters, valid email, password at least 8 characters. Duplicate email returns `409`. Invalid registration data returns `400`.

Response includes `token` and `user` (`id`, `name`, `email`, `role`).

### Login

`POST /api/auth/login`

```json
{
  "email": "alex@example.com",
  "password": "ExamplePass123"
}
```

Missing values return `400`; invalid credentials return `401`. Success includes `token` and safe user information.

### Current user

`GET /api/auth/me`

Requires bearer token. Returns `{ "user": { "id", "name", "email", "role" } }`.

## Items

| Method | Path | Access |
|---|---|---|
| GET | `/api/items` | Public |
| GET | `/api/items/:id` | Public |
| POST | `/api/items` | Authenticated |
| PUT | `/api/items/:id` | Owner/Admin |
| DELETE | `/api/items/:id` | Owner/Admin |

### List/search/filter

`GET /api/items?search=library&type=lost&category=Electronics&status=open`

- `search`: case-insensitive match in title, description, location.
- `type`: `lost` or `found`.
- `category`: exact category.
- `status`: `open`, `claimed`, or `returned`.

Response: `{ "count": number, "items": [...] }`. Results are sorted newest first.

### Create

`POST /api/items`

Required fields: `title`, `description`, `category`, `type`, `location`, `date`, `contactEmail`.

Optional fields: `status`, `imageUrl`.

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

The authenticated user is assigned as `createdBy`. Success returns `201` and the created item.

### Update

`PUT /api/items/:id`

Send any subset of: `title`, `description`, `category`, `type`, `location`, `date`, `status`, `contactEmail`, `imageUrl`.

Only the listing owner or an administrator may update it. A non-owner regular user receives `403`.

### Delete

`DELETE /api/items/:id`

Only the listing owner or an administrator may delete it. Success returns a confirmation message.

## Users

| Method | Path | Access |
|---|---|---|
| GET | `/api/users` | Admin |
| GET | `/api/users/:id` | Self/Admin |
| PUT | `/api/users/:id` | Self/Admin |
| DELETE | `/api/users/:id` | Admin |

User data returned by these endpoints excludes the password hash.

### List users

`GET /api/users` — administrator only. Returns `{ "count": number, "users": [...] }`.

### Get user

`GET /api/users/:id` — account owner or administrator.

### Update user

`PUT /api/users/:id`

```json
{
  "name": "Alex Student",
  "email": "alex.new@example.com"
}
```

Only name and email are updated. The endpoint deliberately does not permit role changes.

### Delete user

`DELETE /api/users/:id` — administrator only. Deleting a user does not currently cascade-delete their items.

## Common status codes

| Code | Meaning |
|---|---|
| `200` | Successful request |
| `201` | Created |
| `400` | Invalid input, missing required data, validation or malformed ID |
| `401` | Missing, invalid, or expired authentication token; invalid login |
| `403` | Authenticated user lacks permission |
| `404` | Route or record not found |
| `409` | Duplicate email conflict |
| `500` | Unexpected server error |

Error response shape:

```json
{ "message": "Description of the error." }
```
