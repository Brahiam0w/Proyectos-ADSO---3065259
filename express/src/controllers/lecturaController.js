import * as Lectura from '../models/lecturaModel.js';
import * as Usuario from '../models/usuarioModel.js';
import {
  generarLecturaDiaria,
  generarLecturaPrincipal
} from '../utils/ia.js';


export const crearPrincipal = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    const usuario = await Usuario.getUsuarioById(usuario_id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (!usuario.fecha_nacimiento) {
      return res.status(400).json({
        error: 'El usuario no tiene fecha de nacimiento registrada'
      });
    }

    const existe = await Lectura.existsPrincipal(usuario_id);
    if (existe) {
      return res.status(400).json({
        error: 'La lectura principal ya fue generada para este usuario'
      });
    }

    const contenido = await generarLecturaPrincipal(
      usuario.fecha_nacimiento,
      usuario.nombre
    );

    const id = await Lectura.createLectura({
      usuario_id,
      tipo: 'principal',
      contenido
    });

    const lectura = await Lectura.getLecturaById(id);

    return res.status(201).json(lectura);

  } catch (err) {
    console.error('[LECTURA PRINCIPAL]', err.message);
    return res.status(500).json({ error: 'Error del servidor' });
  }
};

export const crearDiaria = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    const usuario = await Usuario.getUsuarioById(usuario_id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (usuario.estado !== 'activo') {
      return res.status(403).json({
        error: 'Usuario no activo. Membresía requerida.'
      });
    }

    const contenido = await generarLecturaDiaria(usuario.nombre);

    const id = await Lectura.createLectura({
      usuario_id,
      tipo: 'diaria',
      contenido
    });

    const lectura = await Lectura.getLecturaById(id);

    return res.status(201).json(lectura);

  } catch (err) {
    console.error('[LECTURA DIARIA]', err.message);
    return res.status(500).json({ error: 'Error del servidor' });
  }
};


export const listarPorUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const lecturas = await Lectura.getLecturasByUsuario(usuario_id);
    return res.json(lecturas);
  } catch (err) {
    return res.status(500).json({ error: 'Error del servidor' });
  }
};


export const obtenerLectura = async (req, res) => {
  try {
    const { id } = req.params;

    const lectura = await Lectura.getLecturaById(id);
    if (!lectura) {
      return res.status(404).json({ error: 'Lectura no encontrada' });
    }

    return res.json(lectura);

  } catch (err) {
    return res.status(500).json({ error: 'Error del servidor' });
  }
};


export const testIA = async (req, res) => {
  try {
    const testFecha = '1990-05-15';
    const testNombre = 'Usuario Prueba';

    const lecturaPrincipal = await generarLecturaPrincipal(
      testFecha,
      testNombre
    );

    const lecturaDiaria = await generarLecturaDiaria(testNombre);

    return res.json({
      status: 'success',
      ia: 'OpenRouter',
      lectura_principal: lecturaPrincipal,
      lectura_diaria: lecturaDiaria,
      longitud_principal: lecturaPrincipal.length,
      longitud_diaria: lecturaDiaria.length,
      usa_ia: lecturaPrincipal.length > 200
    });

  } catch (error) {
    console.error('[TEST IA]', error.message);

    return res.status(200).json({
      status: 'fallback',
      mensaje: 'La IA no respondió, usando texto local',
      error: error.message
    });
  }
};
