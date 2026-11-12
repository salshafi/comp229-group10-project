# Working agreement

## Git workflow
1. `main` always runs. Nobody pushes directly to it.
2. Create a branch for every task: `feature/<name>-<short-task>` (example: `feature/fadi-item-form`).
3. Commit small and often with clear messages: `add create-item form`, `fix 401 on delete`.
4. Open a pull request into `main` using the template; a teammate reviews and merges.
5. Pull `main` before starting new work: `git pull origin main`.

## Definition of Done (for any task)
- [ ] Works locally from a fresh `npm install`
- [ ] Tested (API requests in `server/api-tests.http`, or manual steps written in the PR)
- [ ] No secrets, `.env` files or `node_modules` committed
- [ ] Reviewed by a teammate
- [ ] Task card moved to Done on the Agile board

## Communication
- Teams chat for daily messages; reply within 24 hours.
- Raise blockers early, in the chat, with what you tried.
- Checkpoint: Friday evening, each member shows their part.

## Honesty about contributions
Each member works on their own area and commits it. If someone cannot finish, say so in the chat and agree who covers it; record it truthfully in the weekly report.

## Security
- Never commit `.env`. Use `server/.env.example` as the template.
- If a secret is exposed, rotate it immediately and tell the team.
