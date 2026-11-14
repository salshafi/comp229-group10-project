# FindIt User Guide

## 1. About FindIt

FindIt is a campus Lost & Found application. It helps members report belongings, browse lost/found listings, and contact the email address supplied on a listing.

## 2. Open the application

During local development, open the Vite address printed by the client terminal. The default is `http://localhost:5173`.

The backend API runs separately at `http://localhost:5000`.

## 3. Register

1. Select **Create an account**.
2. Enter your full name.
3. Enter a valid email address.
4. Enter a password containing at least eight characters.
5. Submit the form.
6. If registration succeeds, FindIt signs you in.

If the email is already registered, sign in instead.

## 4. Sign in and sign out

Enter the email and password used during registration. Select **Sign in**. To sign out, use the account control at the bottom of the navigation sidebar.

## 5. Browse listings

1. Select **Browse items**.
2. Use the search field to search by item name, description, or location.
3. Filter by Lost or Found.
4. Filter by category.
5. Open a card to view the full listing.

## 6. Report an item

1. Sign in.
2. Select **Report an item**.
3. Complete the title, description, category, item type, location, date, and contact email.
4. Optionally add an image URL.
5. Submit the listing.

Choose `Lost` when the item is missing and `Found` when the item has been discovered. New listings default to the `open` status unless another valid status is supplied.

## 7. Manage your listing

Open a listing you created. The owner can edit or delete it. Another regular user cannot change it. Administrators can manage any listing.

## 8. Administrator notes

The first-release interface does not provide a complete admin dashboard. Administrator-specific user operations are available through the protected API. Admin accounts are created by a trusted team member changing a test user's `role` to `admin` in MongoDB.

## 9. Responsible use

- Use a campus-approved contact email or a designated test email.
- Do not publish sensitive personal information, student numbers, home addresses, or private details.
- Do not post passwords, authentication tokens, or database credentials.
- Do not claim an item unless you can verify ownership.
