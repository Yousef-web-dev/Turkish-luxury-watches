/**
 * DEMO AUTHENTICATION LAYER
 * -------------------------------------------------------------------
 * Accounts live in this browser's localStorage. Passwords are salted and
 * hashed with PBKDF2 (Web Crypto), so no plain-text password is stored, but
 * anyone with access to the browser can still read or edit this data.
 * That makes it suitable for demos and prototypes, NOT for production.
 *
 * Every function below is the seam to replace when you add a real backend
 * (Auth.js, Supabase, Firebase, your own API). The UI only talks to these
 * functions through context/AuthProvider.jsx.
 */

const USERS_KEY = "bh:users";
const SESSION_KEY = "bh:session";
const ORDERS_KEY = "bh:orders";
const SESSION_DAYS = 30;

export const DEMO_ACCOUNT = {
  name: "Demo Collector",
  email: "demo@bosphorushorology.example",
  password: "Demo1234",
};

/* ---------------------------- storage helpers ---------------------------- */
function read(storage, key, fallback) {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

const getUsers = () => read(localStorage, USERS_KEY, []);
const saveUsers = (users) => write(localStorage, USERS_KEY, users);

/* -------------------------------- hashing -------------------------------- */
const bytesToHex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
const hexToBytes = (hex) => new Uint8Array((hex.match(/.{2}/g) || []).map((h) => parseInt(h, 16)));

function randomHex(n = 16) {
  const a = new Uint8Array(n);
  crypto.getRandomValues(a);
  return bytesToHex(a);
}

const newId = () =>
  `u_${typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : randomHex(12)}`;

/** Non-cryptographic fallback, only used on insecure (plain http) origins where crypto.subtle is unavailable. */
function cyrb53(str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}

const bestAlgo = () => (typeof crypto !== "undefined" && crypto.subtle ? "pbkdf2" : "weak");

async function hashPassword(password, salt, algo) {
  if (algo === "pbkdf2") {
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, [
      "deriveBits",
    ]);
    const bits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", salt: hexToBytes(salt), iterations: 100000, hash: "SHA-256" },
      key,
      256,
    );
    return bytesToHex(new Uint8Array(bits));
  }
  return cyrb53(salt + password);
}

/* ------------------------------- validation ------------------------------ */
export const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email.trim());

/** Rules a password must meet. Returns the list of unmet rules (empty = valid). */
export function passwordIssues(pw) {
  const issues = [];
  if (pw.length < 8) issues.push("at least 8 characters");
  if (!/[A-Za-z]/.test(pw)) issues.push("a letter");
  if (!/\d/.test(pw)) issues.push("a number");
  return issues;
}

export function passwordStrength(pw) {
  if (!pw) return { score: 0, label: "" };
  if (pw.length < 8) return { score: 1, label: "Too short" };
  let score = 2;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw) && /\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  score = Math.min(score, 4);
  return { score, label: ["", "Too short", "Fair", "Good", "Strong"][score] };
}

/* -------------------------------- sessions ------------------------------- */
const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email, phone: u.phone || "", createdAt: u.createdAt });

function startSession(userId, remember) {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
  if (remember) {
    write(localStorage, SESSION_KEY, { userId, expires: Date.now() + SESSION_DAYS * 864e5 });
  } else {
    write(sessionStorage, SESSION_KEY, { userId });
  }
}

export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  const s = read(sessionStorage, SESSION_KEY, null) || read(localStorage, SESSION_KEY, null);
  if (!s || (s.expires && s.expires < Date.now())) return null;
  const u = getUsers().find((x) => x.id === s.userId);
  return u ? publicUser(u) : null;
}

export function logOut() {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
}

/* --------------------------------- accounts ------------------------------ */
export async function signUp({ name, email, password }) {
  const em = email.trim().toLowerCase();
  const users = getUsers();
  if (users.some((u) => u.email === em)) {
    return { ok: false, field: "email", error: "An account with this email already exists." };
  }
  const salt = randomHex();
  const algo = bestAlgo();
  const user = {
    id: newId(),
    name: name.trim(),
    email: em,
    phone: "",
    createdAt: new Date().toISOString(),
    salt,
    algo,
    hash: await hashPassword(password, salt, algo),
  };
  if (!saveUsers([...users, user])) {
    return { ok: false, error: "Your browser blocked local storage, so the account could not be saved." };
  }
  startSession(user.id, true);
  return { ok: true, user: publicUser(user) };
}

export async function logIn({ email, password, remember = true }) {
  const em = email.trim().toLowerCase();
  const user = getUsers().find((u) => u.email === em);
  const generic = { ok: false, error: "Incorrect email or password. Check both and try again." };
  if (!user) return generic;
  const hash = await hashPassword(password, user.salt, user.algo);
  if (hash !== user.hash) return generic;
  startSession(user.id, remember);
  return { ok: true, user: publicUser(user) };
}

export function accountExists(email) {
  const em = email.trim().toLowerCase();
  return getUsers().some((u) => u.email === em);
}

export function updateProfile(userId, { name, phone }) {
  if (name.trim().length < 2) return { ok: false, field: "name", error: "Enter your full name." };
  if (phone && phone.replace(/\D/g, "").length < 7) {
    return { ok: false, field: "phone", error: "Enter a phone number with at least 7 digits." };
  }
  const users = getUsers();
  const i = users.findIndex((u) => u.id === userId);
  if (i < 0) return { ok: false, error: "Account not found. Log in again." };
  users[i] = { ...users[i], name: name.trim(), phone: phone.trim() };
  saveUsers(users);
  return { ok: true, user: publicUser(users[i]) };
}

async function setPassword(users, i, password) {
  const salt = randomHex();
  const algo = bestAlgo();
  users[i] = { ...users[i], salt, algo, hash: await hashPassword(password, salt, algo) };
  saveUsers(users);
}

export async function changePassword(userId, current, next) {
  const users = getUsers();
  const i = users.findIndex((u) => u.id === userId);
  if (i < 0) return { ok: false, error: "Account not found. Log in again." };
  const currentHash = await hashPassword(current, users[i].salt, users[i].algo);
  if (currentHash !== users[i].hash) {
    return { ok: false, field: "current", error: "Your current password is incorrect." };
  }
  const issues = passwordIssues(next);
  if (issues.length) return { ok: false, field: "next", error: `Your new password needs ${issues.join(", ")}.` };
  await setPassword(users, i, next);
  return { ok: true };
}

/** Demo-only reset: a real store would email a one-time link instead. */
export async function resetPassword(email, next) {
  const em = email.trim().toLowerCase();
  const users = getUsers();
  const i = users.findIndex((u) => u.email === em);
  if (i < 0) return { ok: false, error: "We can't find an account with that email." };
  const issues = passwordIssues(next);
  if (issues.length) return { ok: false, field: "next", error: `Your new password needs ${issues.join(", ")}.` };
  await setPassword(users, i, next);
  return { ok: true };
}

/** Creates the demo account if it does not exist yet (does not log in). */
export async function ensureDemoAccount() {
  if (accountExists(DEMO_ACCOUNT.email)) return;
  const res = await signUp(DEMO_ACCOUNT);
  if (res.ok) logOut();
}

/* --------------------------------- orders -------------------------------- */
export function getOrders(userId) {
  const all = read(localStorage, ORDERS_KEY, {});
  return all[userId] || [];
}

export function addOrder(userId, order) {
  const all = read(localStorage, ORDERS_KEY, {});
  all[userId] = [order, ...(all[userId] || [])];
  write(localStorage, ORDERS_KEY, all);
  return order;
}
