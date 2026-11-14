# FindIt Database Schema

FindIt uses MongoDB through Mongoose. The database name is selected by the path in `MONGODB_URI`. The application defines two models: `User` and `Item`. MongoDB collections are created when the first documents are inserted.

## 1. `users` collection

| Field | Mongoose type | Required | Constraints/default |
|---|---|---:|---|
| `_id` | ObjectId | Auto | MongoDB identifier |
| `name` | String | Yes | Trimmed; max 80 characters |
| `email` | String | Yes | Unique, lowercase, trimmed |
| `password` | String | Yes | bcryptjs hash; `select: false` |
| `role` | String | Yes | Enum `user`, `admin`; default `user` |
| `createdAt` | Date | Auto | Mongoose timestamps |
| `updatedAt` | Date | Auto | Mongoose timestamps |

Passwords are hashed before insertion. The API does not return password hashes.

## 2. `items` collection

| Field | Mongoose type | Required | Constraints/default |
|---|---|---:|---|
| `_id` | ObjectId | Auto | MongoDB identifier |
| `title` | String | Yes | Trimmed; max 100 |
| `description` | String | Yes | Trimmed; max 1,500 |
| `category` | String | Yes | Electronics, Clothing, Bags, Books, Accessories, Keys, Other |
| `type` | String | Yes | `lost` or `found` |
| `location` | String | Yes | Trimmed; max 120 |
| `date` | Date | Yes | Item-related date |
| `status` | String | No | `open`, `claimed`, `returned`; default `open` |
| `contactEmail` | String | Yes | Lowercase and trimmed |
| `imageUrl` | String | No | Trimmed; default empty string |
| `createdBy` | ObjectId | Yes | Reference to `User` |
| `createdAt` | Date | Auto | Mongoose timestamps |
| `updatedAt` | Date | Auto | Mongoose timestamps |

The item schema defines a text index on title, description, and location. The current list controller implements keyword search using case-insensitive regular-expression matching on those same fields.

## 3. Relationship

One user can create many items. Each item stores one `createdBy` reference to its creator.

```text
User (1) -------- (many) Item
             createdBy
```

## 4. Role model

- `user`: default role assigned during public registration.
- `admin`: elevated role assigned manually by a trusted administrator for the class project.

The profile update API does not allow users to change their own role.

## 5. Data lifecycle notes

- Mongoose timestamps maintain `createdAt` and `updatedAt`.
- Deleting an item removes that item document.
- Deleting a user currently does not automatically delete or reassign that user's items.
- There is no seed script included; create test accounts and items through the application/API.
