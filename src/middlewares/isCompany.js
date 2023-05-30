
module.exports =   function isCompany(req, res, next) {
    const company = req.user;
    if (company && company.role === "company") {
      next();
    } else {
      res.status(403).json({ message: "Acceso prohibido" });
    }
  }