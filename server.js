// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const app = express();
function verifyPassword(inputPassword, storedPassword) {
  return inputPassword === storedPassword;
}

function hashPassword(password) {
  return password;
}

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const LEAVES_FILE = path.join(DATA_DIR, "leaves.json");
const DEPARTMENTS_FILE = path.join(DATA_DIR, "departments.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

function loadJSON(filePath, defaultValue) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), "utf8");
      return defaultValue;
    }
    const raw = fs.readFileSync(filePath, "utf8");
    if (!raw.trim()) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), "utf8");
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error loading JSON", filePath, err);
    return defaultValue;
  }
}

function saveJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

let users = loadJSON(USERS_FILE, []);
let leaves = loadJSON(LEAVES_FILE, []);
let departments = loadJSON(DEPARTMENTS_FILE, []);

const NOREPLY_EMAIL = process.env.NOREPLY_EMAIL || "no-reply@example.com";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.example.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "user@example.com",
    pass: process.env.SMTP_PASS || "password"
  }
});

function sendMail({ to, subject, text }) {
  if (!to) return;
  transporter.sendMail(
    {
      from: `"Portal Αδειών" <${NOREPLY_EMAIL}>`,
      to,
      subject,
      text
    },
    (err) => {
      if (err) {
        console.error("Αποτυχία αποστολής email:", err.message);
      }
    }
  );
}

function sendLeaveStatusEmailToUser(user, leave) {
  if (!user || !user.email) return;
  if (leave.kind !== "leave") return;

  let subject;
  let statusText;

  if (leave.status === "approved") {
    subject = "Η άδειά σας εγκρίθηκε";
    statusText = "εγκρίθηκε";
  } else if (leave.status === "rejected") {
    subject = "Η άδειά σας απορρίφθηκε";
    statusText = "απορρίφθηκε";
  } else {
    return;
  }

  const text = [
    `Γεια σου ${user.firstName},`,
    "",
    `Η αίτηση άδειας από ${leave.startDate} έως ${leave.endDate} (${leave.type}) ${statusText}.`,
    "",
    "Παρακαλούμε μην απαντήσεις σε αυτό το μήνυμα (no-reply)."
  ].join("\n");

  sendMail({ to: user.email, subject, text });
}

function notifyAdminsNewLeave(leave) {
  const admins = users.filter((u) => u.role === "admin" && u.email);
  if (admins.length === 0) return;

  const employee = users.find((u) => u.id === leave.userId);
  const to = admins.map((a) => a.email).join(",");

  const isRepo = leave.kind === "repo";
  const subject = isRepo ? "Νέο ρεπό" : "Νέα αίτηση άδειας";

  const empName = employee
    ? `${employee.firstName} ${employee.lastName}`
    : `User #${leave.userId}`;

  const text = [
    `Υπάρχει νέα καταχώρηση από ${empName}.`,
    "",
    `Είδος: ${isRepo ? "Ρεπό" : "Άδεια"}`,
    `Ημερομηνίες: ${leave.startDate} έως ${leave.endDate}`,
    `Τύπος: ${leave.type}`,
    `Κατάσταση: ${leave.status}`,
    "",
    "Το μήνυμα στάλθηκε αυτόματα από το Portal Αδειών (no-reply)."
  ].join("\n");

  sendMail({ to, subject, text });
}


// Default departments αν το αρχείο είναι κενό
if (!departments || departments.length === 0) {
  departments = [
    { id: 1, name: "ΤΑΜΕΙΟ", color: "#f97316" },
    { id: 2, name: "ΑΠΟΘΗΚΗ", color: "#0ea5e9" },
    { id: 3, name: "ΑΛΛΑΝΤΙΚΑ", color: "#a855f7" },
    { id: 4, name: "ΚΡΕΟΠΩΛΕΙΟ", color: "#ef4444" },
    { id: 5, name: "ΡΑΦΙΑ", color: "#22c55e" },
    { id: 6, name: "ΜΑΝΑΒΙΚΗ", color: "#84cc16" }
  ];
  saveJSON(DEPARTMENTS_FILE, departments);
}

const sessions = {}; // token -> { userId }

function generateToken() {
  return crypto.randomBytes(24).toString("hex");
}

function countDaysInclusive(startDate, endDate) {
  const start = new Date(startDate + "T00:00:00");
  const end = new Date(endDate + "T00:00:00");
  const diff = end.getTime() - start.getTime();
  if (diff < 0) return 0;
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

function rangesOverlap(start1, end1, start2, end2) {
  const s1 = new Date(start1 + "T00:00:00");
  const e1 = new Date(end1 + "T00:00:00");
  const s2 = new Date(start2 + "T00:00:00");
  const e2 = new Date(end2 + "T00:00:00");
  return s1 <= e2 && s2 <= e1;
}

function hasLeaveRepoConflict(userId, newKind, startDate, endDate, excludeId) {
  return leaves.some((l) => {
    if (l.userId !== userId) return false;
    if (excludeId && l.id === excludeId) return false;
    if (l.status === "rejected") return false;

    const isConflictPair =
      (newKind === "repo" && l.kind === "leave") ||
      (newKind === "leave" && l.kind === "repo");
    if (!isConflictPair) return false;

    return rangesOverlap(startDate, endDate, l.startDate, l.endDate);
  });
}

function authRequired(req, res, next) {
  const authHeader = req.headers["authorization"] || "";
  const parts = authHeader.split(" ");
  const token = parts.length === 2 ? parts[1] : null;

  if (!token || !sessions[token]) {
    return res.status(401).json({ error: "Μη εξουσιοδοτημένη πρόσβαση" });
  }

  const session = sessions[token];
  const user = users.find((u) => u.id === session.userId);

  if (!user) {
    delete sessions[token];
    return res.status(401).json({ error: "Μη εξουσιοδοτημένη πρόσβαση" });
  }

  req.user = user;
  req.token = token;
  next();
}

function adminRequired(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Μη εξουσιοδοτημένη πρόσβαση" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Απαγορεύεται η πρόσβαση" });
  }
  next();
}

// Default admin user αν δεν υπάρχουν χρήστες
if (users.length === 0) {
  users = [
    {
      id: 1,
      firstName: "Admin",
      lastName: "User",
      phone: "+306900000000",
      email: "admin@example.com",
      password: "1082",
      role: "admin",
      annualLeaveDays: 25,
      mustChangePassword: true,
      departmentName: "ΔΙΟΙΚΗΣΗ",
      departmentColor: "#6366f1"
    }
  ];
  saveJSON(USERS_FILE, users);
}

// ---------------- AUTH ----------------

app.post("/api/login", (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ error: "Απαιτείται τηλέφωνο και κωδικός" });
  }

  const user = users.find(
    (u) => u.phone === phone && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Λάθος τηλέφωνο ή κωδικός" });
  }

  const token = generateToken();
  sessions[token] = { userId: user.id };

  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    email: user.email || null,
    role: user.role,
    annualLeaveDays: user.annualLeaveDays,
    mustChangePassword: !!user.mustChangePassword,
    departmentName: user.departmentName || null,
    departmentColor: user.departmentColor || null
  };

  res.json({ token, user: safeUser });
});

app.post("/api/logout", authRequired, (req, res) => {
  if (req.token && sessions[req.token]) {
    delete sessions[req.token];
  }
  res.status(204).end();
});

app.get("/api/session", authRequired, (req, res) => {
  const u = req.user;
  res.json({
    user: {
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      phone: u.phone,
      email: u.email || null,
      role: u.role,
      annualLeaveDays: u.annualLeaveDays,
      mustChangePassword: !!u.mustChangePassword,
      departmentName: u.departmentName || null,
      departmentColor: u.departmentColor || null
    }
  });
});

app.post("/api/change-password", authRequired, (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!newPassword) {
    return res.status(400).json({ error: "Απαιτείται νέος κωδικός" });
  }

  const user = users.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: "Ο χρήστης δεν βρέθηκε" });
  }

  if (!verifyPassword(oldPassword, user.password)) {
    return res
      .status(400)
      .json({ error: "Ο τρέχων κωδικός δεν είναι σωστός" });
  }

  user.password = hashPassword(newPassword);
  user.mustChangePassword = false;
  saveJSON(USERS_FILE, users);

  res.json({
    message: "Ο κωδικός άλλαξε με επιτυχία",
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email || null,
      role: user.role,
      annualLeaveDays: user.annualLeaveDays,
      mustChangePassword: false,
      departmentName: user.departmentName || null,
      departmentColor: user.departmentColor || null
    }
  });
});



// ---------------- CURRENT USER PROFILE ----------------

app.get("/api/me", authRequired, (req, res) => {
  const u = req.user;
  if (!u) {
    return res.status(401).json({ error: "Μη εξουσιοδοτημένη πρόσβαση" });
  }

  res.json({
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    phone: u.phone,
    email: u.email || null,
    role: u.role,
    annualLeaveDays: u.annualLeaveDays,
    departmentName: u.departmentName || null,
    departmentColor: u.departmentColor || null
  });
});

app.put("/api/me", authRequired, (req, res) => {
  const u = req.user;
  if (!u) {
    return res.status(401).json({ error: "Μη εξουσιοδοτημένη πρόσβαση" });
  }

  const { firstName, lastName, phone, email } = req.body;

  if (phone && phone !== u.phone) {
    const exists = users.some(
      (other) => other.id !== u.id && other.phone === phone
    );
    if (exists) {
      return res
        .status(400)
        .json({ error: "Το τηλέφωνο χρησιμοποιείται ήδη" });
    }
  }

  if (firstName !== undefined) u.firstName = firstName;
  if (lastName !== undefined) u.lastName = lastName;
  if (phone !== undefined) u.phone = phone;
  if (email !== undefined) u.email = email || null;

  saveJSON(USERS_FILE, users);

  res.json({
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    phone: u.phone,
    email: u.email || null,
    role: u.role,
    annualLeaveDays: u.annualLeaveDays,
    departmentName: u.departmentName || null,
    departmentColor: u.departmentColor || null
  });
});

// ---------------- DEPARTMENTS ----------------

app.get("/api/departments", authRequired, adminRequired, (req, res) => {
  res.json(departments);
});

app.post("/api/departments", authRequired, adminRequired, (req, res) => {
  const { name, color } = req.body;
  if (!name || !color) {
    return res
      .status(400)
      .json({ error: "Απαιτείται όνομα τμήματος και χρώμα" });
  }

  if (departments.some((d) => d.name === name)) {
    return res.status(400).json({ error: "Υπάρχει ήδη τμήμα με αυτό το όνομα" });
  }

  const newId =
    departments.length > 0
      ? Math.max(...departments.map((d) => d.id)) + 1
      : 1;

  const dept = { id: newId, name, color };
  departments.push(dept);
  saveJSON(DEPARTMENTS_FILE, departments);

  res.status(201).json(dept);
});

app.delete("/api/departments/:id", authRequired, adminRequired, (req, res) => {
  const deptId = parseInt(req.params.id, 10);
  const index = departments.findIndex((d) => d.id === deptId);
  if (index === -1) {
    return res.status(404).json({ error: "Το τμήμα δεν βρέθηκε" });
  }
  departments.splice(index, 1);
  saveJSON(DEPARTMENTS_FILE, departments);
  res.status(204).end();
});

// ---------------- USERS ----------------

app.get("/api/users/basic", authRequired, (req, res) => {
  const result = users.map((u) => ({
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    departmentName: u.departmentName || null,
    departmentColor: u.departmentColor || null
  }));
  res.json(result);
});

app.get("/api/users", authRequired, adminRequired, (req, res) => {
  const result = users.map((u) => ({
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    phone: u.phone,
    email: u.email || null,
    role: u.role,
    annualLeaveDays: u.annualLeaveDays,
    mustChangePassword: !!u.mustChangePassword,
    departmentName: u.departmentName || null,
    departmentColor: u.departmentColor || null
  }));
  res.json(result);
});

app.post("/api/users", authRequired, adminRequired, (req, res) => {
  const {
    firstName,
    lastName,
    phone,
    email,
    password,
    role,
    annualLeaveDays,
    departmentName,
    departmentColor
  } = req.body;

  if (!firstName || !lastName || !phone || !password || !role) {
    return res.status(400).json({ error: "Λείπουν υποχρεωτικά πεδία" });
  }

  if (users.some((u) => u.phone === phone)) {
    return res.status(400).json({ error: "Το τηλέφωνο χρησιμοποιείται ήδη" });
  }

  const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

  const newUser = {
    id: newId,
    firstName,
    lastName,
    phone,
    email: email || null,
    password,
    role,
    annualLeaveDays:
      typeof annualLeaveDays === "number" ? annualLeaveDays : 20,
    mustChangePassword: true,
    departmentName: departmentName || null,
    departmentColor: departmentColor || null
  };

  users.push(newUser);
  saveJSON(USERS_FILE, users);

  res.status(201).json(newUser);
});

app.put("/api/users/:id", authRequired, adminRequired, (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "Ο χρήστης δεν βρέθηκε" });
  }

  const {
    firstName,
    lastName,
    phone,
    email,
    password,
    role,
    annualLeaveDays,
    mustChangePassword,
    departmentName,
    departmentColor
  } = req.body;

  if (phone && phone !== user.phone) {
    if (users.some((u) => u.phone === phone)) {
      return res
        .status(400)
        .json({ error: "Το τηλέφωνο χρησιμοποιείται ήδη" });
    }
  }

  if (firstName !== undefined) user.firstName = firstName;
  if (lastName !== undefined) user.lastName = lastName;
  if (phone !== undefined) user.phone = phone;
  if (email !== undefined) user.email = email || null;
  if (password !== undefined && password !== "") user.password = password;
  if (role !== undefined) user.role = role;
  if (annualLeaveDays !== undefined) {
    user.annualLeaveDays = Number(annualLeaveDays);
  }
  if (typeof mustChangePassword === "boolean") {
    user.mustChangePassword = mustChangePassword;
  }
  if (departmentName !== undefined) {
    user.departmentName = departmentName || null;
  }
  if (departmentColor !== undefined) {
    user.departmentColor = departmentColor || null;
  }

  saveJSON(USERS_FILE, users);

  res.json(user);
});

// ---------------- LEAVES ----------------

app.get("/api/leaves", authRequired, (req, res) => {
  const mine = req.query.mine === "true";
  const statusFilter = req.query.status;
  const kindFilter = req.query.kind;

  let filtered = leaves;

  if (mine) {
    filtered = filtered.filter((l) => l.userId === req.user.id);
  }
  if (statusFilter) {
    filtered = filtered.filter((l) => l.status === statusFilter);
  }
  if (kindFilter) {
    filtered = filtered.filter((l) => l.kind === kindFilter);
  }

  const result = filtered.map((l) => {
    const user = users.find((u) => u.id === l.userId);
    return {
      ...l,
      user: user
        ? {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            departmentName: user.departmentName || null,
            departmentColor: user.departmentColor || null
          }
        : null
    };
  });

  res.json(result);
});

app.post("/api/leaves", authRequired, (req, res) => {
  const { userId, startDate, endDate, type, kind } = req.body;

  if (!startDate) {
    return res.status(400).json({ error: "Απαιτείται ημερομηνία" });
  }

  const isRepo = kind === "repo";

  let targetUserId;
  if (req.user.role === "admin" && userId) {
    const parsedId = parseInt(userId, 10);
    const targetUser = users.find((u) => u.id === parsedId);
    if (!targetUser) {
      return res.status(400).json({ error: "Ο χρήστης δεν βρέθηκε" });
    }
    targetUserId = targetUser.id;
  } else {
    targetUserId = req.user.id;
  }

  const finalStart = startDate;
  const finalEnd = isRepo ? startDate : endDate || startDate;
  const newKind = isRepo ? "repo" : "leave";

  if (!finalEnd) {
    return res.status(400).json({ error: "Απαιτούνται ημερομηνίες" });
  }

  if (hasLeaveRepoConflict(targetUserId, newKind, finalStart, finalEnd, null)) {
    return res.status(400).json({
      error:
        "Δεν επιτρέπεται να καταχωρηθεί ρεπό πάνω σε ημέρες άδειας ή άδεια πάνω σε ημέρες ρεπό για τον ίδιο εργαζόμενο."
    });
  }

  const newId =
    leaves.length > 0 ? Math.max(...leaves.map((l) => l.id)) + 1 : 1;
  const nowIso = new Date().toISOString();

  const newLeave = {
    id: newId,
    userId: targetUserId,
    startDate: finalStart,
    endDate: finalEnd,
    kind: newKind,
    type: isRepo ? "repo" : type || "annual",
    status: "pending",
    createdAt: nowIso,
    updatedAt: nowIso
  };

  leaves.push(newLeave);
  saveJSON(LEAVES_FILE, leaves);

  notifyAdminsNewLeave(newLeave);

  res.status(201).json(newLeave);
});

app.put("/api/leaves/:id", authRequired, (req, res) => {
  const leaveId = parseInt(req.params.id, 10);
  const leave = leaves.find((l) => l.id === leaveId);

  if (!leave) {
    return res.status(404).json({ error: "Η αίτηση δεν βρέθηκε" });
  }

  const isAdmin = req.user.role === "admin";
  const isOwner = leave.userId === req.user.id;

  const { startDate, endDate, status, type, kind } = req.body;

  const previousStatus = leave.status;

  let newKind = kind !== undefined ? (kind === "repo" ? "repo" : "leave") : leave.kind;
  let newStart = startDate !== undefined ? startDate : leave.startDate;
  let newEnd = endDate !== undefined ? endDate : leave.endDate;

  if (newKind === "repo") {
    newEnd = newStart;
  }

  if (hasLeaveRepoConflict(leave.userId, newKind, newStart, newEnd, leave.id)) {
    return res.status(400).json({
      error:
        "Δεν επιτρέπεται να υπάρχει ρεπό πάνω σε ημέρες άδειας ή άδεια πάνω σε ημέρες ρεπό για τον ίδιο εργαζόμενο."
    });
  }

  if (isAdmin) {
    if (startDate !== undefined) leave.startDate = startDate;
    if (endDate !== undefined) leave.endDate = endDate;
    if (status !== undefined) leave.status = status;
    if (type !== undefined) leave.type = type;
    if (kind !== undefined) leave.kind = newKind;
  } else {
    if (!isOwner) {
      return res
        .status(403)
        .json({ error: "Δεν επιτρέπεται να τροποποιήσετε αυτή την αίτηση" });
    }
    if (leave.status !== "pending") {
      return res.status(400).json({
        error: "Η αίτηση δεν μπορεί να τροποποιηθεί (δεν είναι σε αναμονή)"
      });
    }
    if (startDate !== undefined) leave.startDate = startDate;
    if (endDate !== undefined) leave.endDate = endDate;
    if (type !== undefined) leave.type = type;
    if (kind !== undefined) leave.kind = newKind;
  }

  if (leave.kind === "repo") {
    leave.startDate = newStart;
    leave.endDate = newStart;
    leave.type = "repo";
  }

  leave.updatedAt = new Date().toISOString();
  saveJSON(LEAVES_FILE, leaves);

  if (
    leave.kind === "leave" &&
    previousStatus !== leave.status &&
    (leave.status === "approved" || leave.status === "rejected")
  ) {
    const targetUser = users.find((u) => u.id === leave.userId);
    sendLeaveStatusEmailToUser(targetUser, leave);
  }

  const user = users.find((u) => u.id === leave.userId);
  res.json({
    ...leave,
    user: user
      ? {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          departmentName: user.departmentName || null,
          departmentColor: user.departmentColor || null
        }
      : null
  });
});

app.delete("/api/leaves/:id", authRequired, (req, res) => {
  const leaveId = parseInt(req.params.id, 10);
  const index = leaves.findIndex((l) => l.id === leaveId);

  if (index === -1) {
    return res.status(404).json({ error: "Η αίτηση δεν βρέθηκε" });
  }

  const leave = leaves[index];
  const isAdmin = req.user.role === "admin";
  const isOwner = leave.userId === req.user.id;

  if (!isAdmin) {
    if (!isOwner) {
      return res
        .status(403)
        .json({ error: "Δεν επιτρέπεται να διαγράψετε αυτή την αίτηση" });
    }
    if (leave.status !== "pending") {
      return res.status(400).json({
        error: "Η αίτηση δεν μπορεί να διαγραφεί (δεν είναι σε αναμονή)"
      });
    }
  }

  leaves.splice(index, 1);
  saveJSON(LEAVES_FILE, leaves);
  res.status(204).end();
});

app.get("/api/users/:id/summary", authRequired, (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const isAdmin = req.user.role === "admin";

  if (!isAdmin && req.user.id !== userId) {
    return res.status(403).json({ error: "Απαγορεύεται η πρόσβαση" });
  }

  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "Ο χρήστης δεν βρέθηκε" });
  }

  const currentYear = new Date().getFullYear();

  const approvedLeaves = leaves.filter((l) => {
    return (
      l.userId === userId &&
      l.status === "approved" &&
      l.kind === "leave" &&
      new Date(l.startDate).getFullYear() === currentYear
    );
  });

  let usedDays = 0;
  for (const l of approvedLeaves) {
    usedDays += countDaysInclusive(l.startDate, l.endDate);
  }

  res.json({
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName
    },
    year: currentYear,
    annualLeaveDays: user.annualLeaveDays,
    usedDays,
    remainingDays: user.annualLeaveDays - usedDays
  });
});

app.listen(PORT, () => {
  console.log(`Leave Portal server listening on port ${PORT}`);
});
