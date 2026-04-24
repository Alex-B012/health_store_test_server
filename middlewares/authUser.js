function requireRole(allowedRoles) {
  console.log("requireRole - start");

  return (req, res, next) => {
    if (!req.permission_role)
      return res.status(403).json({ error: "No role found" });

    if (!allowedRoles.includes(req.permission_role))
      return res.status(403).json({ error: "Access denied" });

    next();
  };
}

export { requireRole };
