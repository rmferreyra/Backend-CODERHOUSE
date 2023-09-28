module.exports = {
  authorizeAdmin: (req, res, next) => {
    console.log(req.user[0].role)
    if (req.user[0].role == 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'No tenes permiso para acceder a esta ruta como administrador' });
    }
  },
  authorizeUser: (req, res, next) => {
    console.log(req.user[0].role)
    if (req.user[0].role == 'user') {
      next();
    } else {
      res.status(403).json({ message: 'No tenes permiso para acceder a esta ruta como usuario' });
    }
  }
};