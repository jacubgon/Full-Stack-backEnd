module.exports =   function isCandidate(req, res, next) {
    const candidate = req.user;
    if (candidate && candidate.role === "candidate") {
      next();
    } else {
      res.status(403).json({ message: "Acceso prohibido" });
    }
  }