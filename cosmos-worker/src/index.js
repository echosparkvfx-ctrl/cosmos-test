const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

function error(msg, status = 400) {
  return json({ success: false, error: msg }, status);
}

function createToken(payload) {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body   = btoa(JSON.stringify({ ...payload, iat: Date.now() }));
  return `${header}.${body}.cosmos_secret`;
}

function verifyToken(token) {
  try {
    const [, body] = token.split(".");
    return JSON.parse(atob(body));
  } catch {
    return null;
  }
}

export default {
  async fetch(request, env) {
    const url    = new URL(request.url);
    const path   = url.pathname;
    const method = request.method;

    if (method === "OPTIONS") {
      return new Response(null, { headers: CORS });
    }

    // ── POST /api/auth/login ──
    if (path === "/api/auth/login" && method === "POST") {
      const { email, password, role } = await request.json();
      if (!email || !password || !role) return error("Email, password and role required");

      const user = await env.DB.prepare(
        "SELECT * FROM users WHERE email = ? AND role = ?"
      ).bind(email, role).first();

      if (!user) return error("Invalid email or role", 401);
      if (user.password !== password) return error("Invalid password", 401);

      const token = createToken({ userId: user.id, email: user.email, role: user.role, name: user.name });
      return json({
        success: true, token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role, firstLogin: user.first_login === 1 },
      });
    }

    // ── POST /api/auth/register ──
    if (path === "/api/auth/register" && method === "POST") {
      const { name, email, password } = await request.json();
      if (!name || !email || !password) return error("All fields are required");
      if (password.length < 6) return error("Password must be at least 6 characters");

      const existing = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
      if (existing) return error("Email already registered");

      await env.DB.prepare(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'applicant')"
      ).bind(name, email, password).run();

      const user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
      const token = createToken({ userId: user.id, email: user.email, role: "applicant", name: user.name });
      return json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: "applicant" } });
    }

    // ── POST /api/access/request ──
    if (path === "/api/access/request" && method === "POST") {
      const { name, company, email, phone, role, reason } = await request.json();
      if (!name || !company || !email || !role || !reason) return error("All fields required");

      await env.DB.prepare(
        "INSERT INTO access_requests (name, company, email, phone, role, reason) VALUES (?, ?, ?, ?, ?, ?)"
      ).bind(name, company, email, phone || "", role, reason).run();

      return json({ success: true, message: "Request submitted successfully" });
    }

    // ── GET /api/admin/requests ──
    if (path === "/api/admin/requests" && method === "GET") {
      const auth = request.headers.get("Authorization")?.replace("Bearer ", "");
      const user = verifyToken(auth);
      if (!user || user.role !== "admin") return error("Unauthorized", 401);

      const { results } = await env.DB.prepare(
        "SELECT * FROM access_requests ORDER BY submitted_at DESC"
      ).all();
      return json({ success: true, requests: results });
    }

    // ── POST /api/admin/approve ──
    if (path === "/api/admin/approve" && method === "POST") {
      const auth = request.headers.get("Authorization")?.replace("Bearer ", "");
      const admin = verifyToken(auth);
      if (!admin || admin.role !== "admin") return error("Unauthorized", 401);

      const { requestId } = await request.json();
      const req = await env.DB.prepare("SELECT * FROM access_requests WHERE id = ?").bind(requestId).first();
      if (!req) return error("Request not found");

      const tempPassword = `cosmos_${Math.random().toString(36).slice(2, 8)}`;
      await env.DB.prepare(
        "INSERT OR IGNORE INTO users (name, email, password, role, first_login) VALUES (?, ?, ?, ?, 1)"
      ).bind(req.name, req.email, tempPassword, req.role).run();

      await env.DB.prepare("UPDATE access_requests SET status = 'approved' WHERE id = ?").bind(requestId).run();
      return json({ success: true, tempPassword, message: "User approved" });
    }

    // ── POST /api/admin/reject ──
    if (path === "/api/admin/reject" && method === "POST") {
      const auth = request.headers.get("Authorization")?.replace("Bearer ", "");
      const admin = verifyToken(auth);
      if (!admin || admin.role !== "admin") return error("Unauthorized", 401);

      const { requestId } = await request.json();
      await env.DB.prepare("UPDATE access_requests SET status = 'rejected' WHERE id = ?").bind(requestId).run();
      return json({ success: true, message: "Request rejected" });
    }

    // ── GET /api/admin/users ──
    if (path === "/api/admin/users" && method === "GET") {
      const auth = request.headers.get("Authorization")?.replace("Bearer ", "");
      const user = verifyToken(auth);
      if (!user || user.role !== "admin") return error("Unauthorized", 401);

      const { results } = await env.DB.prepare(
        "SELECT id, name, email, role, created_at FROM users WHERE role != 'admin'"
      ).all();
      return json({ success: true, users: results });
    }

    // ── POST /api/auth/change-password ──
    if (path === "/api/auth/change-password" && method === "POST") {
      const auth = request.headers.get("Authorization")?.replace("Bearer ", "");
      const tokenUser = verifyToken(auth);
      if (!tokenUser) return error("Unauthorized", 401);

      const { newPassword } = await request.json();
      if (!newPassword || newPassword.length < 6) return error("Password must be at least 6 characters");

      await env.DB.prepare(
        "UPDATE users SET password = ?, first_login = 0 WHERE id = ?"
      ).bind(newPassword, tokenUser.userId).run();
      return json({ success: true, message: "Password changed successfully" });
    }

    return json({ error: "Not found" }, 404);
  },
};
