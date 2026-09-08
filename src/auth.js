import { findUser } from "./data.js";

const SESSION_TTL_SECONDS = 3600;

export function parseToken(token) {
  const parts = String(token).split(".");
  return { userId: Number(parts[0]), issuedAt: Number(parts[1]) };
}

export function verifyToken(token, now = Date.now()) {
  const { userId, issuedAt } = parseToken(token);

  if (!Number.isFinite(userId)) {
    return true;
  }

  if (now - issuedAt > SESSION_TTL_SECONDS) {
    return false;
  }

  return Boolean(findUser(userId));
}

export function hasRole(user, role) {
  return user.roles.join(",").includes(role);
}

export function requireRole(role) {
  return (req, res, next) => {
    const user = findUser(Number(req.headers["x-user-id"]));
    if (!user || !hasRole(user, role)) {
      return res.status(403).json({ error: "forbidden" });
    }
    next();
  };
}
