// FindIt API automated test runner (Node 18+).
// Usage (from the server folder, with the API already running):
//   node tests/api-tests.mjs            -> runs tests, writes ../docs/api-test-results.md
//   node tests/api-tests.mjs --cleanup  -> also deletes the test users/items it created
// It reads MONGODB_URI from .env ONLY to promote one test user to admin (the API has no
// admin-creation route by design). No credentials are printed or written to the report.
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Item from '../src/models/Item.js';

const BASE = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}/api`;
const CLEANUP = process.argv.includes('--cleanup');
const run = Date.now().toString(36);
const PW = 'Test-Pass-12345';
const mkEmail = tag => `apitest.${tag}.${run}@example.com`;

const results = [];
let section = '';
const sec = name => { section = name; console.log(`\n== ${name} ==`); };

async function call(method, url, { token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(BASE + url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }
  return { status: res.status, data };
}

function check(name, method, url, expected, r, extra = () => true) {
  const ok = r.status === expected && extra(r.data);
  results.push({ section, name, method, url, expected, actual: r.status, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${String(r.status).padEnd(4)} (expect ${expected})  ${name}`);
  return r;
}

const itemBody = (over = {}) => ({
  title: `Black backpack ${run}`, description: 'Left in the library, has a laptop sleeve.',
  category: 'Bags', type: 'lost', location: 'Library, 2nd floor',
  date: '2026-11-10', contactEmail: 'owner@example.com', ...over
});

async function main() {
  // reachability
  const health = await call('GET', '/health').catch(() => null);
  if (!health || health.status !== 200) {
    console.error(`\nCannot reach the API at ${BASE}. Start it first (npm run dev) in another window.`);
    process.exit(1);
  }

  const A = { email: mkEmail('a'), name: 'Test User A' };
  const B = { email: mkEmail('b'), name: 'Test User B' };
  const ADM = { email: mkEmail('admin'), name: 'Test Admin' };

  sec('Authentication');
  check('Health check', 'GET', '/health', 200, health);
  let r = check('Register user A', 'POST', '/auth/register', 201, await call('POST', '/auth/register', { body: { ...A, password: PW } }),
    d => d.token && d.user?.role === 'user' && !('password' in d.user));
  A.token = r.data?.token; A.id = r.data?.user?.id;
  r = check('Register user B', 'POST', '/auth/register', 201, await call('POST', '/auth/register', { body: { ...B, password: PW } }));
  B.token = r.data?.token; B.id = r.data?.user?.id;
  check('Register duplicate email', 'POST', '/auth/register', 409, await call('POST', '/auth/register', { body: { ...A, password: PW } }));
  check('Register invalid email', 'POST', '/auth/register', 400, await call('POST', '/auth/register', { body: { name: 'Bad', email: 'not-an-email', password: PW } }));
  check('Register short password', 'POST', '/auth/register', 400, await call('POST', '/auth/register', { body: { name: 'Bad', email: mkEmail('x'), password: 'short' } }));
  check('Register short name', 'POST', '/auth/register', 400, await call('POST', '/auth/register', { body: { name: 'B', email: mkEmail('y'), password: PW } }));
  check('Register cannot self-assign admin role', 'POST', '/auth/register', 201,
    await call('POST', '/auth/register', { body: { name: 'Sneaky', email: mkEmail('sneaky'), password: PW, role: 'admin' } }),
    d => d.user?.role === 'user');
  r = check('Login valid', 'POST', '/auth/login', 200, await call('POST', '/auth/login', { body: { email: A.email, password: PW } }), d => !!d.token);
  A.token = r.data?.token || A.token;
  check('Login wrong password', 'POST', '/auth/login', 401, await call('POST', '/auth/login', { body: { email: A.email, password: 'Wrong-Pass-999' } }));
  check('Login unknown email', 'POST', '/auth/login', 401, await call('POST', '/auth/login', { body: { email: mkEmail('nobody'), password: PW } }));
  check('Login missing fields', 'POST', '/auth/login', 400, await call('POST', '/auth/login', { body: {} }));
  check('GET /auth/me with token', 'GET', '/auth/me', 200, await call('GET', '/auth/me', { token: A.token }), d => d.user?.email === A.email);
  check('GET /auth/me without token', 'GET', '/auth/me', 401, await call('GET', '/auth/me'));
  check('GET /auth/me with invalid token', 'GET', '/auth/me', 401, await call('GET', '/auth/me', { token: 'not.a.jwt' }));

  sec('Items – Create / Read');
  check('List items (public, no token)', 'GET', '/items', 200, await call('GET', '/items'), d => Array.isArray(d.items));
  check('Create item without token', 'POST', '/items', 401, await call('POST', '/items', { body: itemBody() }));
  r = check('Create item (user A)', 'POST', '/items', 201, await call('POST', '/items', { token: A.token, body: itemBody() }),
    d => d.item?.status === 'open' && d.item?.createdBy === A.id);
  const itemId = r.data?.item?._id;
  check('Create item missing required field', 'POST', '/items', 400, await call('POST', '/items', { token: A.token, body: itemBody({ title: '' }) }));
  check('Create item invalid category', 'POST', '/items', 400, await call('POST', '/items', { token: A.token, body: itemBody({ category: 'Spaceships' }) }));
  check('Create item invalid type', 'POST', '/items', 400, await call('POST', '/items', { token: A.token, body: itemBody({ type: 'stolen' }) }));
  r = check('Create item ignores spoofed createdBy', 'POST', '/items', 201,
    await call('POST', '/items', { token: A.token, body: itemBody({ title: `Spoof test ${run}`, createdBy: B.id }) }),
    d => d.item?.createdBy === A.id);
  const spoofId = r.data?.item?._id;
  check('Get item by id', 'GET', `/items/:id`, 200, await call('GET', `/items/${itemId}`), d => d.item?._id === itemId);
  check('Get item – unknown id', 'GET', '/items/:id', 404, await call('GET', '/items/64b64b64b64b64b64b64b64b'));
  check('Get item – malformed id', 'GET', '/items/:id', 400, await call('GET', '/items/not-an-id'));
  check('Filter by type=lost', 'GET', '/items?type=lost', 200, await call('GET', '/items?type=lost'), d => d.items.every(i => i.type === 'lost'));
  check('Filter by category=Bags', 'GET', '/items?category=Bags', 200, await call('GET', '/items?category=Bags'), d => d.items.every(i => i.category === 'Bags'));
  check('Search by keyword', 'GET', '/items?search=backpack', 200, await call('GET', `/items?search=${encodeURIComponent('Black backpack ' + run)}`), d => d.count >= 1);

  sec('Items – Update / Delete and authorization');
  check('Update item without token', 'PUT', '/items/:id', 401, await call('PUT', `/items/${itemId}`, { body: { status: 'claimed' } }));
  check("Update another user's item (B → A's)", 'PUT', '/items/:id', 403, await call('PUT', `/items/${itemId}`, { token: B.token, body: { status: 'claimed' } }));
  check("Delete another user's item (B → A's)", 'DELETE', '/items/:id', 403, await call('DELETE', `/items/${itemId}`, { token: B.token }));
  check('Update own item (owner A)', 'PUT', '/items/:id', 200, await call('PUT', `/items/${itemId}`, { token: A.token, body: { status: 'claimed', title: `Updated ${run}` } }),
    d => d.item?.status === 'claimed' && d.item?.title === `Updated ${run}`);
  check('Update unknown item', 'PUT', '/items/:id', 404, await call('PUT', '/items/64b64b64b64b64b64b64b64b', { token: A.token, body: { status: 'open' } }));
  check('Delete own item (owner A)', 'DELETE', '/items/:id', 200, await call('DELETE', `/items/${spoofId}`, { token: A.token }));
  check('Deleted item now 404', 'GET', '/items/:id', 404, await call('GET', `/items/${spoofId}`));

  sec('Users – access control');
  check('List users as normal user', 'GET', '/users', 403, await call('GET', '/users', { token: A.token }));
  check('List users without token', 'GET', '/users', 401, await call('GET', '/users'));
  check('Get own profile', 'GET', '/users/:id', 200, await call('GET', `/users/${A.id}`, { token: A.token }), d => d.user?.email === A.email && !('password' in d.user));
  check("Get another user's profile", 'GET', '/users/:id', 403, await call('GET', `/users/${B.id}`, { token: A.token }));
  check('Update own name', 'PUT', '/users/:id', 200, await call('PUT', `/users/${A.id}`, { token: A.token, body: { name: 'Renamed User A' } }), d => d.user?.name === 'Renamed User A');
  check('Role change attempt is ignored', 'PUT', '/users/:id', 200, await call('PUT', `/users/${A.id}`, { token: A.token, body: { role: 'admin' } }), d => d.user?.role === 'user');
  check("Update another user's profile", 'PUT', '/users/:id', 403, await call('PUT', `/users/${B.id}`, { token: A.token, body: { name: 'Hacked' } }));
  check('Delete user as normal user', 'DELETE', '/users/:id', 403, await call('DELETE', `/users/${B.id}`, { token: A.token }));

  sec('Admin role');
  r = await call('POST', '/auth/register', { body: { ...ADM, password: PW } });
  ADM.id = r.data?.user?.id;
  await mongoose.connect(process.env.MONGODB_URI);
  await User.updateOne({ email: ADM.email }, { role: 'admin' }); // manual promotion, as designed
  r = check('Admin login returns role admin', 'POST', '/auth/login', 200, await call('POST', '/auth/login', { body: { email: ADM.email, password: PW } }), d => d.user?.role === 'admin');
  ADM.token = r.data?.token;
  check('Admin lists all users', 'GET', '/users', 200, await call('GET', '/users', { token: ADM.token }), d => d.count >= 3);
  check("Admin views another user's profile", 'GET', '/users/:id', 200, await call('GET', `/users/${B.id}`, { token: ADM.token }));
  check("Admin edits another user's item", 'PUT', '/items/:id', 200, await call('PUT', `/items/${itemId}`, { token: ADM.token, body: { status: 'returned' } }), d => d.item?.status === 'returned');
  check("Admin deletes another user's item", 'DELETE', '/items/:id', 200, await call('DELETE', `/items/${itemId}`, { token: ADM.token }));
  check('Admin deletes user B', 'DELETE', '/users/:id', 200, await call('DELETE', `/users/${B.id}`, { token: ADM.token }));
  check('Deleted user token is rejected', 'GET', '/auth/me', 401, await call('GET', '/auth/me', { token: B.token }));
  check('Admin delete unknown user', 'DELETE', '/users/:id', 404, await call('DELETE', '/users/64b64b64b64b64b64b64b64b', { token: ADM.token }));

  if (CLEANUP) {
    const del = await User.deleteMany({ email: { $regex: `\\.${run}@example\\.com$` } });
    const delItems = await Item.deleteMany({ title: { $regex: run } });
    console.log(`\nCleanup: removed ${del.deletedCount} test users and ${delItems.deletedCount} test items.`);
  }
  await mongoose.disconnect();
  report();
}

function report() {
  const passed = results.filter(t => t.ok).length;
  const failed = results.length - passed;
  console.log(`\nSUMMARY: ${passed}/${results.length} passed, ${failed} failed`);
  const here = path.dirname(fileURLToPath(import.meta.url));
  const out = path.resolve(here, '../../docs/api-test-results.md');
  const lines = [
    '# FindIt API – Automated Test Results', '',
    `Run: ${new Date().toISOString()}  `, `Target: ${BASE}  `, `Runner: \`server/tests/api-tests.mjs\` (Node ${process.version})  `,
    `**Result: ${passed}/${results.length} passed, ${failed} failed**`, ''
  ];
  let cur = '';
  for (const t of results) {
    if (t.section !== cur) { cur = t.section; lines.push('', `## ${cur}`, '', '| # | Test | Request | Expected | Actual | Result |', '|---|------|---------|----------|--------|--------|'); }
    lines.push(`| ${results.indexOf(t) + 1} | ${t.name} | \`${t.method} ${t.url}\` | ${t.expected} | ${t.actual} | ${t.ok ? 'PASS' : '**FAIL**'} |`);
  }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, lines.join('\n') + '\n');
  console.log(`Report written to ${out}`);
  process.exit(failed ? 1 : 0);
}

main().catch(e => { console.error('Runner error:', e.message); process.exit(1); });
