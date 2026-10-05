# Kuyil Carnatic

A Duolingo-style course in Carnatic music. Lessons follow *Sadhakam: Carnatic Music Sadhaka Sahayi & Lessons* by Suresh Narayanan, from the first Sa through Sarali and Janta varisai, alankarams and the first five geethams (notation from [karnatik.com](https://www.karnatik.com/geetams.shtml)).

- Listening quizzes, tile puzzles, "echo" rounds on swara pads, thala tapping and sing-alongs with live notation
- **Singing check**: the browser listens through the microphone, detects your pitch against your sruthi and fills a ring when you hold each swara in tune (any octave counts)
- Practice room with swara pads, a swara tuner, tanpura drone and every exercise ready to sing along with
- Accounts (username + password) with XP, stars and streak saved per user

## How it's built

- `server.js`: Express server. Serves `public/` and a small JSON API (`/api/signup`, `/api/login`, `/api/logout`, `/api/me`, `/api/progress`). Passwords are hashed with bcrypt; sessions are random tokens stored hashed in Postgres and sent as an HttpOnly cookie.
- `db.js`: Postgres connection and table setup (runs automatically on start).
- `public/`: the app itself, plain HTML/CSS/JS. Audio is synthesised with the Web Audio API; pitch detection uses the YIN algorithm on the microphone signal.

## Run it locally

```bash
npm install
DATABASE_URL=postgresql://user:pass@localhost:5432/kuyil npm start
# open http://localhost:3000
```

## Deploy on Render (no extra cost)

Render charges compute **per service**: a second $7 Starter service costs another $7/month. To stay at $0 extra, this deploys as a **Free** web service with a free **Neon** Postgres database.

1. **Database.** Sign up at [neon.tech](https://neon.tech) (free plan), create a project, and copy its connection string (`postgresql://…?sslmode=require`).
   Render's own free Postgres is deleted after 30 days, so Neon is the safer free choice.
2. **Web service.** In Render: **New → Blueprint**, pick this repo. Render reads `render.yaml` and asks for `DATABASE_URL`: paste the Neon string. Click **Apply**.
3. Open the `.onrender.com` URL, create an account and start learning.

Free services sleep after 15 minutes without visitors and take about a minute to wake up. To keep it always on, change `plan: free` to `plan: starter` in `render.yaml` (that service then costs $7/month).

The microphone only works over HTTPS, which Render provides automatically.
