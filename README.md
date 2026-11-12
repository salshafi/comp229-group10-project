# COMP229 Group 10 Project

Team: Salman Shafi, Fadi Rizk, Shangkun Liu. Course: COMP229 Web Application Development, Section 404.
Project type: _to be chosen by the team (record it here)_.

Stack: React (Vite) client, Node and Express API in MVC structure, MongoDB (Mongoose), JWT authentication.

```
Browser (React, 5173) --/api--> Express (4000) --> MongoDB Atlas
```

## Run locally

```powershell
# API
cd server
copy .env.example .env     # fill in your own values; never commit .env
npm install
npm run dev

# Client (second terminal)
cd client
npm install
npm run dev                # http://localhost:5173
```

Each member can use their own free Atlas cluster, or the team can share one database user; never post credentials in chat or commit them.

## Project layout

```
server/src/models       Mongoose schemas (to build)
server/src/routes       Express routes (to build)
server/src/middleware   requireSignin (to build)
server/api-tests.http   API tests (VS Code REST Client)
client/src/pages        React pages
client/src/components   Reusable components
client/src/api.js       All calls to the API
docs/                   Contract, design document, test results
```

This repository is a starter: each owner builds their own area from the course material. Every folder has a README or TODO comment listing the steps and the related course week. `Item` stands for your main object; name it for the domain once the team chooses the project type.

## Who owns what (Part 1)

| Area | Owner |
|---|---|
| Backend, database, auth, API tests, repo setup | Salman |
| React pages (list, create, edit, delete, login) | Fadi |
| Team contract, design document, Agile board, backlog PDF | Shangkun |
| Demo video | All three, each presenting their own part |

Everyone commits code to this repository. See `CONTRIBUTING.md`.
