const Plan = require('../models/Plan');

/**
 * GET /api/planes
 * Lista todos los planes activos (Público)
 */
const listarPlanes = async (req, res) => {
  try {
    const planes = await Plan.find({ activo: true });
    res.status(200).json({ success: true, planes });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: error.message });
  }
};

/**
 * GET /api/planes/admin
 * Lista todos los planes incluyendo inactivos (Solo Admin)
 */
const listarPlanesAdmin = async (req, res) => {
  try {
    const planes = await Plan.find();
    res.status(200).json({ success: true, planes });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: error.message });
  }
};

/**
 * POST /api/planes
 * Crea un nuevo plan (Solo Admin)
 */
const crearPlan = async (req, res) => {
  try {
    const nuevoPlan = await Plan.create(req.body);
    res.status(201).json({ success: true, plan: nuevoPlan });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
};

/**
 * PUT /api/planes/:id
 * Actualiza un plan existente (Solo Admin)
 */
const actualizarPlan = async (req, res) => {
  try {
    const planActualizado = await Plan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!planActualizado) {
      return res.status(404).json({ success: false, mensaje: 'Plan no encontrado' });
    }
    res.status(200).json({ success: true, plan: planActualizado });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
};

/**
 * DELETE /api/planes/:id
 * Elimina un plan (Solo Admin)
 */
const eliminarPlan = async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, mensaje: 'Plan eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: error.message });
  }
};

module.exports = {
  listarPlanes,
  listarPlanesAdmin,
  crearPlan,
  actualizarPlan,
  eliminarPlan,
};