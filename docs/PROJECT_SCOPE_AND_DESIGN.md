# FindIt – External Design Document (EDD) v1 draft

> Replace placeholders, add your approved team logo, and insert actual screenshots from your running application before exporting this document to PDF.

## Cover information
- Team name: [TEAM NAME]
- Project: FindIt – Campus Lost & Found Management System
- Course: COMP229 – Web Application Development
- Team members: [FULL NAME – STUDENT ID – ROLE for each member]
- Version: 1.0 draft
- Date: [DATE]

## Table of contents
1. Project overview
2. Intended users and goals
3. Functional requirements
4. External interface and navigation
5. Wireframes
6. Initial screenshots
7. Technology and architecture

## 1. Project overview
FindIt is a campus-focused web application that allows community members to publish lost and found item listings, browse and search listings, view item details, and contact the person who created a listing. The first release focuses on authentication, authorization, item CRUD, and database-backed API functionality.

## 2. Intended users and goals
- Student/member: register, sign in, browse listings, create listings, edit/delete their own listings, and contact a listing owner.
- Administrator: access administrative user listing endpoints and manage any item listing.

## 3. Functional requirements
- FR-01: A visitor can register with name, email, and password.
- FR-02: A registered user can sign in and receive an authentication token.
- FR-03: An authenticated user can create a lost or found listing.
- FR-04: A visitor can browse and search listings by keyword, type, and category.
- FR-05: A visitor can view an individual listing.
- FR-06: A listing owner can update or delete their listing.
- FR-07: An administrator can manage listings and access user-management endpoints.
- FR-08: A listing contains title, description, category, type, location, date, status, contact email, optional image URL, and creator.

## 4. External interface and navigation
Primary navigation: Overview, Browse items, Report an item, account/logout. Public pages: Sign in and Create account. Authenticated pages: Dashboard, listing directory, listing details, create/edit listing.

## 5. Wireframes
### Sign in / registration
Two-column layout: branded project introduction on the left; form fields and account action on the right.
### Dashboard
Sidebar navigation; top bar; welcome message; summary statistics; recent listing cards; primary Report an item action.
### Browse listings
Page heading; keyword search; type and category filters; responsive listing card grid.
### Listing details
Item image/placeholder; type/category/status; title and description; location/date/contact information; contact action; owner edit/delete actions.
### Create/edit listing
Form sections for item information, location/date, and contact/photo information; validation and save/cancel actions.

## 6. Initial screenshots
Insert screenshots captured from the actual running release: (1) sign-in page, (2) dashboard, (3) browse/filter page, (4) create listing form, (5) item detail page, and (6) Postman successful API test. Do not use mock screenshots as evidence of completed functionality.

## 7. Technology and architecture
React and Vite provide the client interface. Express routes map requests to controller functions. Controllers use Mongoose models to read and write MongoDB documents. JWT middleware protects authenticated endpoints; owner/admin checks enforce authorization.

### Data collections
- users: name, email, hashed password, role, timestamps.
- items: title, description, category, type, location, date, status, contactEmail, imageUrl, createdBy, timestamps.
