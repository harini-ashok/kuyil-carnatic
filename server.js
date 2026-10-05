import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool, migrate } from './db.js';

const PORT = process.env.PORT || 3000;
const PROD = process.env.NODE_ENV === 'production';
const SESSION_DAYS = 60;
const COOKIE = 'kuyil_sid';
const here = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '64kb' }));

// ---- helpers ----
function readCookie(req, name) {
  const raw = req.headers.cookie || '';
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}
function setSessionCookie(res, token) {
  res.cookie(COOKIE, token, {
    httpOnly: true, sameSite: 'lax', secure: PROD, path: '/',
    maxAge: SESSION_DAYS * 864e5,
  });
}
const hashToken = t => crypto.createHash('sha256').update(t).digest('hex');

async function createSession(res, userId) {
  const token = crypto.randomBytes(32).toString('base64url');
  await pool.query(
    `INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, now() + ($3 || ' days')::interval)`,
    [hashToken(token), userId, String(SESSION_DAYS)]);
  setSessionCookie(res, token);
}

async function currentUser(req) {
  const token = readCookie(req, COOKIE);
  if (!token) return null;
  const { rows } = await pool.query(
    `SELECT u.id, u.username FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token = $1 AND s.expires_at > now()`, [hashToken(token)]);
  return rows[0] || null;
}

const requireUser = async (req, res, next) => {
  try {
    const user = await currentUser(req);
    if (!user) return res.status(401).json({ error: 'Please log in.' });
    req.user = user; next();
  } catch (e) { next(e); }
};

// Simple per-IP limiter for login/signup so passwords can't be guessed quickly.
const attempts = new Map();
function limited(req) {
  const key = req.ip, now = Date.now(), win = 15 * 60e3;
  const a = (attempts.get(key) || []).filter(t => now - t < win);
  a.push(now); attempts.set(key, a);
  return a.length > 20;
}
setInterval(() => attempts.clear(), 60 * 60e3).unref();

const USERNAME_RE = /^[a-z0-9_.-]{3,24}$/;
function validate(body) {
  const username = String(body?.username || '').trim().toLowerCase();
  const password = String(body?.password || '');
  if (!USERNAME_RE.test(username)) return { error: 'Usernames are 3 to 24 characters: letters, numbers, dot, dash or underscore.' };
  if (password.length < 8) return { error: 'Passwords need at least 8 characters.' };
  if (password.length > 200) return { error: 'That password is too long.' };
  return { username, password };
}

// ---- API ----
app.get('/healthz', (req, res) => res.json({ ok: true }));

app.post('/api/signup', async (req, res, next) => {
  try {
    if (limited(req)) return res.status(429).json({ error: 'Too many tries. Wait a few minutes and try again.' });
    const v = validate(req.body);
    if (v.error) return res.status(400).json({ error: v.error });
    const hash = await bcrypt.hash(v.password, 10);
    const { rows } = await pool.query(
      `INSERT INTO users (username, pass_hash) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING RETURNING id, username`,
      [v.username, hash]);
    if (!rows[0]) return res.status(409).json({ error: 'That username is taken. Try another one.' });
    await pool.query(`INSERT INTO progress (user_id, data) VALUES ($1, '{}'::jsonb)`, [rows[0].id]);
    await createSession(res, rows[0].id);
    res.json({ user: { username: rows[0].username }, progress: {} });
  } catch (e) { next(e); }
});

app.post('/api/login', async (req, res, next) => {
  try {
    if (limited(req)) return res.status(429).json({ error: 'Too many tries. Wait a few minutes and try again.' });
    const username = String(req.body?.username || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const { rows } = await pool.query(`SELECT id, username, pass_hash FROM users WHERE username = $1`, [username]);
    const ok = rows[0] && await bcrypt.compare(password, rows[0].pass_hash);
    if (!ok) return res.status(401).json({ error: 'That username and password don’t match.' });
    await createSession(res, rows[0].id);
    const p = await pool.query(`SELECT data FROM progress WHERE user_id = $1`, [rows[0].id]);
    res.json({ user: { username: rows[0].username }, progress: p.rows[0]?.data || {} });
  } catch (e) { next(e); }
});

app.post('/api/logout', async (req, res, next) => {
  try {
    const token = readCookie(req, COOKIE);
    if (token) await pool.query(`DELETE FROM sessions WHERE token = $1`, [hashToken(token)]);
    res.clearCookie(COOKIE, { path: '/' });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

app.get('/api/me', requireUser, async (req, res, next) => {
  try {
    const p = await pool.query(`SELECT data FROM progress WHERE user_id = $1`, [req.user.id]);
    res.json({ user: { username: req.user.username }, progress: p.rows[0]?.data || {} });
  } catch (e) { next(e); }
});

app.put('/api/progress', requireUser, async (req, res, next) => {
  try {
    const data = req.body?.progress;
    if (!data || typeof data !== 'object' || Array.isArray(data)) return res.status(400).json({ error: 'Progress must be an object.' });
    await pool.query(
      `INSERT INTO progress (user_id, data, updated_at) VALUES ($1, $2, now())
       ON CONFLICT (user_id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
      [req.user.id, data]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// ---- static app ----
// Browsers must check for a newer copy on every load (a cheap ETag check), so a deploy
// reaches everyone at once instead of after an hour of stale lessons and singing code.
const fresh = res => res.setHeader('Cache-Control', 'no-cache');
app.use(express.static(path.join(here, 'public'), { setHeaders: fresh }));
app.get('/{*any}', (req, res) => { fresh(res); res.sendFile(path.join(here, 'public', 'index.html')); });

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server. Try again in a moment.' });
});

await migrate();
// Clear expired sessions once a day.
setInterval(() => pool.query(`DELETE FROM sessions WHERE expires_at < now()`).catch(() => {}), 864e5).unref();
app.listen(PORT, () => console.log(`Kuyil Carnatic listening on :${PORT}`));
