import * as Lectura from '../models/lecturaModel.js';
import * as Usuario from '../models/usuarioModel.js';
import * as Pago from '../models/pagoModel.js';
import { generarLecturaDiaria, generarLecturaPrincipal } from '../utils/ia.js';
import { OpenAIService } from '../utils/openai.js';

export const crearPrincipal = async (req, res) => {
  try {
    const usuario = await Usuario.getUsuarioById(req.params.usuario_id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    const existe = await Lectura.existsPrincipal(req.params.usuario_id);
    if (existe) return res.status(400).json({ error: 'La lectura principal ya fue generada para este usuario' });
    const contenido = await generarLecturaPrincipal(usuario.fecha_nacimiento, usuario.nombre);
    const id = await Lectura.createLectura({ usuario_id: req.params.usuario_id, tipo: 'principal', contenido });
    const lectura = await Lectura.getLecturaById(id);
    res.status(201).json(lectura);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const crearDiaria = async (req, res) => {
  try {
    const usuario = await Usuario.getUsuarioById(req.params.usuario_id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    const estado = usuario.estado;
    if (estado !== 'activo') return res.status(403).json({ error: 'Usuario no activo. Membresía requerida.' });
    const contenido = await generarLecturaDiaria(usuario.nombre);
    const id = await Lectura.createLectura({ usuario_id: req.params.usuario_id, tipo: 'diaria', contenido });
    const lectura = await Lectura.getLecturaById(id);
    res.status(201).json(lectura);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const listarPorUsuario = async (req, res) => {
  try {
    const lecturas = await Lectura.getLecturasByUsuario(req.params.usuario_id);
    res.json(lecturas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const obtenerLectura = async (req, res) => {
  try {
    const lectura = await Lectura.getLecturaById(req.params.id);
    if (!lectura) return res.status(404).json({ error: 'Lectura no encontrada' });
    res.json(lectura);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const testOpenAI = async (req, res) => {
  try {
    const testFecha = '1990-05-15';
    const testNombre = 'Usuario Prueba';
    
    console.log('🧪 [TEST] Probando OpenAI...');
    
    // Probar lectura principal
    const lecturaPrincipal = await generarLecturaPrincipal(testFecha, testNombre);
    
    // Probar lectura diaria
    const lecturaDiaria = await generarLecturaDiaria(testNombre);
    
    res.json({
      status: 'success',
      openai_configured: true,
      lectura_principal: lecturaPrincipal,
      lectura_diaria: lecturaDiaria,
      longitud_principal: lecturaPrincipal.length,
      longitud_diaria: lecturaDiaria.length,
      usa_ia: lecturaPrincipal.length > 200
    });
    
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      openai_configured: !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'tu_api_key_de_openai_aqui'
    });
  }
};

export const diagnosticoOpenAI = async (req, res) => {
  try {
    res.json({
      openai_configured: !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'tu_api_key_de_openai_aqui',
      api_key: process.env.OPENAI_API_KEY ? 'Configurada' : 'No configurada',
      mensaje: 'Sistema usando OpenAI para generación de lecturas'
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      openai_configured: false
    });
  }
};

export const verificarConexionOpenAI = async (req, res) => {
  try {
    console.log('🔍 Verificando conexión con OpenAI...');
    const conexion = await OpenAIService.verificarConexion();
    
    res.json({
      status: conexion ? 'success' : 'error',
      openai_configured: true,
      conexion_exitosa: conexion,
      mensaje: conexion ? 'Conexión con OpenAI exitosa' : 'Error en conexión con OpenAI'
    });
    
  } catch (error) {
    res.status(500).json({
      status: 'error',
      openai_configured: true,
      conexion_exitosa: false,
      error: error.message
    });
  }
};