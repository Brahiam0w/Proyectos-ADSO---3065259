/**
 * Middleware: Verifica que el usuario tenga uno de los roles permitidos
 * Uso: soloRoles('admin') o soloRoles('admin', 'usuario')
 */
const soloRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({
        success: false,
        mensaje: `El rol '${req.usuario.rol}' no tiene permiso para realizar esta acción.`,
      });
    }
    next();
  };
};

module.exports = { soloRoles };
