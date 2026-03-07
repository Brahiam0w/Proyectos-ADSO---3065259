const Lectura = require('../models/Lectura');
const Usuario = require('../models/Usuario');
const { generarLecturaPrincipalIA, generarLecturaDiariaIA } = require('../utils/numerologia');

/**
 * POST /api/lecturas/principal/:usuario_id
 * Genera la lectura principal basada en la fecha de nacimiento
 * Se genera UNA SOLA VEZ por usuario
 * Acceso: Cualquier usuario autenticado puede generarla para sí mismo; Admin para cualquiera
 */
const generarLecturaPrincipal = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    // Un usuario solo puede generar su propia lectura principal
    if (req.usuario.rol === 'usuario' && req.usuario._id.toString() !== usuario_id) {
      return res.status(403).json({
        success: false,
        mensaje: 'No puedes generar lecturas para otro usuario.',
      });
    }

    const usuario = await Usuario.findById(usuario_id);
    if (!usuario) {
      return res.status(404).json({ success: false, mensaje: 'Usuario no encontrado.' });
    }

    // Verificar si ya tiene una lectura principal
    const lecturaExistente = await Lectura.findOne({
      usuario_id,
      tipo: 'principal',
    });

    if (lecturaExistente) {
      return res.status(200).json({
        success: true,
        mensaje: 'Ya tienes una lectura principal generada.',
        lectura: lecturaExistente,
      });
    }

    // Generar la lectura con IA (o simulada)
    const { numero, contenido } = await generarLecturaPrincipalIA(usuario);

    const nuevaLectura = await Lectura.create({
      usuario_id,
      tipo: 'principal',
      contenido,
      numero_camino_vida: numero,
    });

    res.status(201).json({
      success: true,
      mensaje: 'Lectura principal generada exitosamente.',
      lectura: nuevaLectura,
    });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: error.message });
  }
};

/**
 * POST /api/lecturas/diaria/:usuario_id
 * Genera la lectura diaria
 * El usuario DEBE estar en estado "activo" (membresía vigente)
 */
const generarLecturaDiaria = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    // Un usuario solo puede generar su propia lectura diaria
    if (req.usuario.rol === 'usuario' && req.usuario._id.toString() !== usuario_id) {
      return res.status(403).json({
        success: false,
        mensaje: 'No puedes generar lecturas para otro usuario.',
      });
    }

    const usuario = await Usuario.findById(usuario_id);
    if (!usuario) {
      return res.status(404).json({ success: false, mensaje: 'Usuario no encontrado.' });
    }

    // Validar que el usuario esté activo
    if (usuario.estado !== 'activo') {
      return res.status(403).json({
        success: false,
        mensaje:
          'Tu membresía no está activa. Activa tu membresía para recibir lecturas diarias.',
        estado: usuario.estado,
      });
    }

    // --- RESTRICCIÓN: Una sola lectura diaria al día ---
    const inicioDia = new Date();
    inicioDia.setHours(0, 0, 0, 0);

    const finDia = new Date();
    finDia.setHours(23, 59, 59, 999);

    const lecturaHoy = await Lectura.findOne({
      usuario_id,
      tipo: 'diaria',
      fecha_lectura: { $gte: inicioDia, $lte: finDia },
    });

    if (lecturaHoy) {
      return res.status(200).json({
        success: true,
        mensaje: 'Tu guía mística de hoy ya ha sido revelada. Vuelve mañana para una nueva conexión.',
        lectura: lecturaHoy,
      });
    }
    // --------------------------------------------------

    // Generar la lectura diaria
    const { numero, contenido } = await generarLecturaDiariaIA(usuario);

    const nuevaLectura = await Lectura.create({
      usuario_id,
      tipo: 'diaria',
      contenido,
      numero_camino_vida: numero,
    });

    res.status(201).json({
      success: true,
      mensaje: 'Lectura diaria generada.',
      lectura: nuevaLectura,
    });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: error.message });
  }
};

/**
 * GET /api/lecturas/usuario/:usuario_id
 * Consulta todas las lecturas de un usuario
 */
const lecturasPorUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    if (req.usuario.rol === 'usuario' && req.usuario._id.toString() !== usuario_id) {
      return res.status(403).json({
        success: false,
        mensaje: 'No tienes permiso para ver las lecturas de otro usuario.',
      });
    }

    const usuario = await Usuario.findById(usuario_id);
    if (!usuario) {
      return res.status(404).json({ success: false, mensaje: 'Usuario no encontrado.' });
    }

    const lecturas = await Lectura.find({ usuario_id })
      .sort({ fecha_lectura: -1 });

    res.status(200).json({
      success: true,
      total: lecturas.length,
      lecturas,
    });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: error.message });
  }
};

/**
 * GET /api/lecturas/:id
 * Consulta una lectura específica por su ID
 */
const obtenerLectura = async (req, res) => {
  try {
    const lectura = await Lectura.findById(req.params.id).populate(
      'usuario_id',
      'nombre email'
    );

    if (!lectura) {
      return res.status(404).json({ success: false, mensaje: 'Lectura no encontrada.' });
    }

    // Un usuario solo puede ver sus propias lecturas
    if (
      req.usuario.rol === 'usuario' &&
      lectura.usuario_id._id.toString() !== req.usuario._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        mensaje: 'No tienes permiso para ver esta lectura.',
      });
    }

    res.status(200).json({ success: true, lectura });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: error.message });
  }
};

module.exports = {
  generarLecturaPrincipal,
  generarLecturaDiaria,
  lecturasPorUsuario,
  obtenerLectura,
};
