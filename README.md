# PawConnect

COMP229 – Web Application Development. A MERN prototype for browsing rescued dogs and cats and managing adoption listings. The seeded people, rescue names and pet profiles are fictional.

## Run locally

Use Node 20.19+ or 22.12+ and a MongoDB instance. From the project root:

```sh
npm ci
cp .env.example .env
```

On Windows PowerShell, use `Copy-Item .env.example .env`. Set `MONGODB_URI` to a local MongoDB database or an Atlas database your team can access. Set `JWT_SECRET` to a random string of at least 32 characters and choose a `DEMO_PASSWORD`. Keep port 3001 for development because the Vite proxy uses it. Keep your real `.env` private.

```sh
npm run seed
npm run dev
```

Open http://localhost:5173. Use either `maple@example.test` or `cedar@example.test` with your configured demo password. Seed only a demo database. To change an already seeded account’s password, use a new demo database or update the seeded account’s password hash explicitly. Public registration creates visitor accounts.

For a production-style local run, use `npm run build` followed by `npm start`. Open http://localhost:3001.

## MVC and API

The React views live in `src/`. Express wires models, controllers and routes under `server/`. MongoDB stores `users` and `pets`. The pet controller restricts updates and deletes to the staff account that owns the listing. Accounts currently represent a single rescue staff owner. Staff within one rescue would need shared organization membership in a later release.

| Endpoint | Access |
|---|---|
| POST /api/users/register | Public. Creates a visitor account. |
| POST /api/users/login | Public. Returns a time-limited JWT. |
| GET /api/users/me | Signed-in users. |
| GET /api/pets and GET /api/pets/:id | Public. |
| GET /api/pets/mine | Signed-in staff. |
| POST /api/pets | Signed-in staff. |
| PATCH /api/pets/:id and DELETE /api/pets/:id | Staff member who owns the listing. |

Import `docs/PawConnect.postman_collection.json` and set the local **demoPassword** collection variable to the seeded password. With the API running, use the collection runner in order. It creates and deletes a temporary listing and verifies that it is gone. It also creates a visitor test account with a unique email. Use a demo database.

## Submission checklist

1. **Team contract and team logo.** Form a team of 4–6. Choose a team name and logo. Agree on expectations, consequences, and corrective actions, then get everyone’s signature. Export the contract and logo as separate PDFs. The paw branding in the app is project branding your team can adapt.
2. **GitHub.** Push the source to your team’s repository. Assign each developer a real implementation task and have them commit it under their own GitHub account. Review how the user endpoints compare to your Assignment 2 before recording.
3. **External Design Document v1.** Export a PDF with team name and logo, table of contents, wireframes for the browse page, pet profile, staff login and dashboard, and current screenshots of those features.
4. **Agile board.** Put your feature backlog and tasks in Jira or Trello. Keep both the Product Backlog and Task Board current. Export the current Product Backlog as a PDF.
5. **Two-slide deck and video.** Slide 1 contains the team name and logo, all full names and student IDs, COMP229 – Web Application Development, and the project type. Slide 2 uses current photos with each member’s full name and role. Record the demo within the handout’s 5–10 minute guidance. Share the video link so the instructor can open it. Restrict access where the streaming provider allows it because the slides contain student IDs and photos.
6. **Submission.** By the end of Week 9, submit the project ZIP through Luminate, the signed contract PDF, logo PDF, EDD PDF, backlog PDF, GitHub link, and video link. Exclude your .env and node_modules from the project ZIP.

### Suggested demo order

Show both slides, sign in as Maple Rescue, and create a new listing. Browse to its profile, then edit it to Adoption Pending. Run the Postman checks for authentication, visitor permissions, and cross-account ownership. Show the Express route, middleware, controller and MongoDB model that enforce ownership. Return to the dashboard, delete the listing and confirm it has disappeared.

## Demo photo sources

- [Hero](https://images.unsplash.com/photo-1599692392256-2d084495fe15)
- [Maple](https://images.unsplash.com/photo-1552053831-71594a27632d)
- [Mochi](https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba)
- [Finn](https://images.unsplash.com/photo-1558788353-f76d92427f16)
