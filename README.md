<div align="center">

# 🐾 PawConnect

### Find your new best friend.

A pet adoption demo for people looking for a companion<br>
and rescue staff keeping listings up to date.

<img src="public/images/hero.jpg" alt="Golden retriever puppy" width="340">

**React · Vite · Express · MongoDB**

[🚀 Quick start](#quick-start) · [🐶 Demo pets](#meet-the-demo-pets) · [🧩 Architecture](#architecture) · [🧪 API tests](#api-tests)

</div>

---

## Quick start

### 🐾 Browse the demo without a database

From the folder containing `package.json`, run the commands below with **Node.js 22.12 or later**. Open the **Local** URL Vite prints, usually `http://127.0.0.1:5173`. This mode uses bundled sample pets and supports browsing, filtering, and opening profiles.

```sh
npm ci
npm run web -- --mode preview
```

On Windows PowerShell, use `npm.cmd` in place of `npm` if script execution blocks the npm wrapper. Press **Ctrl+C** to stop the preview before starting the full app.

### 🔑 Run the full app with staff sign-in

1. Install dependencies with `npm ci` if you haven’t already.

2. Copy [`.env.example`](.env.example) to `.env` using `cp .env.example .env` on macOS/Linux or `Copy-Item .env.example .env` in PowerShell.

3. Set the following values in your local `.env`.

   | Variable        | Value                                                                                                                                         |
   | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
   | `MONGODB_URI`   | A MongoDB Atlas URI for a demo database or `mongodb://127.0.0.1:27017/pawconnect` with a local MongoDB server running.                        |
   | `JWT_SECRET`    | A random string of at least 32 characters. Generate one with `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. |
   | `PORT`          | `3001`, the port used by the Vite API proxy.                                                                                                  |
   | `DEMO_PASSWORD` | A password you choose for the demo staff accounts. Use at least 8 characters and at most 72 bytes.                                            |

4. Seed the demo database, then start the frontend and API.

   ```sh
   npm run seed
   npm run dev
   ```

5. Open the **Local** URL and select **Staff sign in**. Use `maple@example.test` or `cedar@example.test` with the password you set when you first seeded the database. Seeding again preserves the passwords on existing accounts.

For a production-style local run, use `npm run build` followed by `npm start`, then open `http://127.0.0.1:3001`. Keep your actual `.env` and any private course submission material out of the public repository.

## Meet the demo pets

| 🐶 Maple | 🐱 Mochi | 🐶 Finn |
| :---: | :---: | :---: |
| <img src="public/images/maple.jpg" alt="Maple the dog" width="130"> | <img src="public/images/mochi.jpg" alt="Mochi the cat" width="130"> | <img src="public/images/finn.jpg" alt="Finn the dog" width="130"> |
| Toronto | Scarborough | Vaughan |

## What you can do

| 🔎 Browse as an adopter | 🏡 Manage listings as rescue staff |
| --- | --- |
| Filter the catalog by dogs or cats. | Sign in to see the listings you posted. |
| Open a pet’s profile to see their photo, age, location, and story. | Create, edit, or delete your own listings. |
| See which pets are **Available**, **Adoption Pending**, or **Adopted**. | Update a pet’s status as their adoption progresses. |

PawConnect uses fictional pet profiles and rescue staff accounts. It was built for **COMP229 · Web Application Development** at Centennial College.

## Architecture

The React interface runs on Vite in development. Vite forwards `/api` requests to Express. Express routes send requests through authentication middleware where required, and controllers use Mongoose models to read and write the MongoDB `users` and `pets` collections.

```mermaid
flowchart LR
    UI["React + Vite"] -->|"/api"| API["Express"]
    API --> ODM["Mongoose"]
    ODM --> DB[("MongoDB")]
```

| Project area                       | What it contains                                                                |
| ---------------------------------- | ------------------------------------------------------------------------------- |
| [`src/`](src/)                     | React catalog, profile dialogs, staff sign-in, dashboard, and styles.           |
| [`server/`](server/)               | Express application, routes, controllers, Mongoose models, and auth middleware. |
| [`server/seed.js`](server/seed.js) | Two demo staff accounts and three sample pet profiles.                          |
| [`docs/`](docs/)                   | Importable Postman collection for user and listing APIs.                        |

Passwords are hashed with bcrypt. Staff sign-in issues a time-limited JWT. The API checks the staff role before allowing listing changes and checks listing ownership for edits and deletes. Each staff account manages its own listings.

## API

| Method        | Route                        | Access                                          |
| ------------- | ---------------------------- | ----------------------------------------------- |
| POST          | `/api/users/register`        | Public. Creates a visitor account.              |
| POST          | `/api/users/login`           | Public. Returns a JWT after successful sign-in. |
| GET           | `/api/users/me`              | Signed-in user.                                 |
| GET           | `/api/pets`, `/api/pets/:id` | Public catalog and pet details.                 |
| GET           | `/api/pets/mine`             | Signed-in staff member’s listings.              |
| POST          | `/api/pets`                  | Signed-in staff.                                |
| PATCH, DELETE | `/api/pets/:id`              | Staff account that owns the listing.            |

## API tests

Import [the PawConnect Postman collection](docs/PawConnect.postman_collection.json). Set its local `demoPassword` variable to the seeded password and run the collection in order against `http://localhost:3001`. Use a demo database. The collection creates a visitor test account and creates, updates, and deletes a temporary pet listing.

| Check                                                             | Expected result                                            |
| ----------------------------------------------------------------- | ---------------------------------------------------------- |
| Staff signs in and creates, reads, updates, and deletes a listing | The changes persist and the deleted listing returns `404`. |
| Signed-out user tries to create a listing                         | `401 Unauthorized`                                         |
| Visitor tries to create a listing                                 | `403 Forbidden`                                            |
| Another staff account tries to edit or delete the listing         | `403 Forbidden` and the listing retains its saved status.  |

<details>
<summary>🎬 Try the staff workflow in under two minutes</summary>

1. Sign in as Maple Rescue and add a test pet.
2. Open its public profile under **Browse pets**.
3. In the dashboard, change the status to **Adoption Pending**.
4. Delete your test listing and confirm it disappears from the catalog.

</details>

## Roadmap

- **Adoption inquiries** with a form for prospective adopters and a review queue for rescue staff.
- **Rescue organization accounts** so multiple staff members can manage listings for the same organization.

<details>
<summary>🎓 COMP229 submission checklist</summary>

1. **Team contract and team logo.** Form a team of 4–6. Choose a team name and logo. Agree on expectations, consequences, and corrective actions, then get everyone’s signature. Export the contract and logo as separate PDFs. The paw branding in the app is project branding your team can adapt.
2. **GitHub.** Push the source to your team’s repository. Assign each developer a real implementation task and have them commit it under their own GitHub account. Review how the user endpoints compare to your Assignment 2 before recording.
3. **External Design Document v1.** Export a PDF with team name and logo, table of contents, wireframes for the browse page, pet profile, staff login and dashboard, and current screenshots of those features.
4. **Agile board.** Put your feature backlog and tasks in Jira or Trello. Keep both the Product Backlog and Task Board current. Export the current Product Backlog as a PDF.
5. **Two-slide deck and video.** Slide 1 contains the team name and logo, all full names and student IDs, COMP229 – Web Application Development, and the project type. Slide 2 uses current photos with each member’s full name and role. Record the demo within the handout’s 5–10 minute guidance. Share the video link so the instructor can open it. Restrict access where the streaming provider allows it because the slides contain student IDs and photos.
6. **Submission.** By the end of Week 9, submit the project ZIP through Luminate, the signed contract PDF, logo PDF, EDD PDF, backlog PDF, GitHub link, and video link. Exclude your .env and node_modules from the project ZIP.

</details>

## Photo credits

- [Hero](https://images.unsplash.com/photo-1599692392256-2d084495fe15)
- [Maple](https://images.unsplash.com/photo-1552053831-71594a27632d)
- [Mochi](https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba)
- [Finn](https://images.unsplash.com/photo-1558788353-f76d92427f16)
