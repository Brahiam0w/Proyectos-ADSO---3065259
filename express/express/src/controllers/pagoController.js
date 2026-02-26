import * as Pago from '../models/pagoModel.js';
import * as Usuario from '../models/usuarioModel.js';
import db from '../config/db.js';

export const registrarPago = async (req,res) => {
  try{
    const {usuario_id,monto,metodo} = req.body;
    const fecha_pago = new Date().toISOString().split('T')[0];
    const fv = new Date();
    fv.setDate(fv.getDate() + 30);
    const fecha_vencimiento = fv.toISOString().split('T')[0];
    const id = await Pago.createPago({usuario_id,monto,fecha_pago,fecha_vencimiento,metodo});
    // actualizar estado usuario a activo
    await Usuario.setEstadoUsuario(usuario_id, 'activo');
    res.status(201).json({id, fecha_vencimiento});
  }catch(err){
    res.status(500).json({error: err.message});
  }
};

export const listarPagos = async (req,res) => {
  try{
    const rows = await Pago.getAllPagos();
    res.json(rows);
  }catch(err){
    res.status(500).json({error: err.message});
  }
};

export const pagosPorUsuario = async (req,res) => {
  try{
    const rows = await Pago.getPagosByUsuario(req.params.usuario_id);
    res.json(rows);
  }catch(err){
    res.status(500).json({error: err.message});
  }
};

export const estadoMembresia = async (req,res) => {
  try{
    const estado = await Pago.getEstadoMembresia(req.params.usuario_id);
    res.json(estado);
  }catch(err){
    res.status(500).json({error: err.message});
  }
};
