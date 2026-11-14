# FindIt – Product Backlog snapshot

Use this as a starting point in Trello/Jira. Add actual owners, estimates, priorities, and statuses agreed by the team. Export a screenshot/PDF from the live board for submission.

| ID | User story / task | Priority | Suggested status | Acceptance criteria |
|---|---|---|---|---|
| F-01 | As a visitor, I can register an account | High | Done when tested | Valid account created; duplicate email rejected; password hashed |
| F-02 | As a user, I can sign in | High | Done when tested | Valid credentials return token; invalid credentials rejected |
| F-03 | As a user, I can view the dashboard | High | In progress | Dashboard loads database-backed item totals and recent items |
| F-04 | As a user, I can browse/search/filter listings | High | In progress | Search, type and category filters work |
| F-05 | As a user, I can create a listing | High | In progress | Required fields validated; record saved with creator |
| F-06 | As a user, I can view a listing | High | In progress | Detail page displays item information |
| F-07 | As an owner, I can edit my listing | High | In progress | Owner can update; other user receives 403 |
| F-08 | As an owner, I can delete my listing | High | In progress | Owner can delete; other user receives 403 |
| F-09 | As a user, I can update my profile | Medium | To do | Owner can update name/email |
| F-10 | As an admin, I can manage users | Medium | To do | Admin-only list/delete endpoints work |
| F-11 | As a team, we can demonstrate API tests | High | To do | Postman evidence covers success and failure cases |
| F-12 | As a team, we can submit EDD and demo | High | To do | PDF includes TOC, wireframes, actual screenshots; demo 5–10 min |

## Task board columns
Backlog → To Do → In Progress → Code Review → Testing → Done.
