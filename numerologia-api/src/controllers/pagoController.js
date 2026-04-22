const { MercadoPagoConfig, Preference, Payment: MPPayment } = require('mercadopago');
const Usuario = require('../models/Usuario');
const Pago = require('../models/Pago');

// Configuración de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

/**
 * POST /api/pagos/crear-preferencia
 * Crea una preferencia de pago en Mercado Pago
 */
const crearPreferencia = async (req, res) => {
  const usuarioId = req.usuario._id;
  const { monto = 39000 } = req.body;

  try {
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ success: false, mensaje: 'Usuario no encontrado' });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';

    const preference = new Preference(client);

    // Restauramos la lógica exacta que tenías antes
    const successUrl = `${backendUrl}/api/pagos/redirect?type=exito`.replace(/\/+/g, '/').replace('http:/', 'http://').replace('https:/', 'https://');
    const failureUrl = `${backendUrl}/api/pagos/redirect?type=fallo`.replace(/\/+/g, '/').replace('http:/', 'http://').replace('https:/', 'https://');
    const pendingUrl = `${backendUrl}/api/pagos/redirect?type=pendiente`.replace(/\/+/g, '/').replace('http:/', 'http://').replace('https:/', 'https://');

    const body = {
      items: [
        {
          id: 'plan-mistico-01',
          title: 'Plan Místico Numerología',
          description: 'Acceso completo a lecturas místicas personalizadas por 31 días',
          quantity: 1,
          unit_price: Math.floor(Number(monto)),
          currency_id: 'COP',
        }
      ],
      back_urls: {
        success: successUrl,
        failure: failureUrl,
        pending: pendingUrl,
      },
      auto_return: 'approved',
      binary_mode: true,
      external_reference: usuarioId.toString(),
    };

    console.log('[MP] Success URL:', successUrl);
    const response = await preference.create({ body });

    // Calcular fecha de vencimiento (31 días desde hoy)
    const fecha_pago = new Date();
    const fecha_vencimiento = new Date(fecha_pago);
    fecha_vencimiento.setDate(fecha_vencimiento.getDate() + 31);

    // Guardar pago pendiente en BD
    const nuevoPago = new Pago({
        usuario_id: usuarioId,
        monto,
        metodo: 'Mercado Pago',
        fecha_pago,
        fecha_vencimiento,
        mpPreferenceId: response.id,
        estado: 'pendiente',
    });
    await nuevoPago.save();

    res.status(200).json({
      success: true,
      id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point
    });

  } catch (error) {
    console.error('Error detallado de MP:', error);
    res.status(500).json({ success: false, mensaje: 'Error al crear preferencia de pago' });
  }
};

/**
 * POST /api/pagos/webhook
 * Recibe notificaciones automáticas de Mercado Pago
 */
const recibirNotificacion = async (req, res) => {
    const { type, data } = req.body;

    // Responder rápido a MP
    res.sendStatus(200);

    try {
        if (type === 'payment' && data?.id) {
            const mpPayment = new MPPayment(client);
            const pagoInfo = await mpPayment.get({ id: data.id });

            if (pagoInfo.status === 'approved') {
                const usuarioId = pagoInfo.external_reference;

                // Buscar el pago pendiente
                const pago = await Pago.findOne({
                    usuario_id: usuarioId,
                    estado: 'pendiente',
                    metodo: 'Mercado Pago',
                }).sort({ createdAt: -1 });

                if (pago) {
                    pago.mpPaymentId = String(pagoInfo.id);
                    pago.estado = 'aprobado';
                    await pago.save();

                    // Activar plan del usuario
                    const fechaExpiracion = new Date();
                    fechaExpiracion.setDate(fechaExpiracion.getDate() + 31);

                    await Usuario.findByIdAndUpdate(usuarioId, {
                        plan: 'mistico',
                        fecha_expiracion_plan: fechaExpiracion,
                        estado: 'activo'
                    });
                }
            }
        }
    } catch (err) {
        console.error('Error procesando webhook:', err);
    }
};

/**
 * GET /api/pagos/verificar
 * Verifica el estado del pago más reciente del usuario
 */
const verificarPago = async (req, res) => {
    const usuarioId = req.usuario._id;

    try {
        const pagoReciente = await Pago.findOne({
            usuario_id: usuarioId,
            metodo: 'Mercado Pago',
        }).sort({ createdAt: -1 });

        if (!pagoReciente) {
            return res.json({ success: true, status: 'no_payment' });
        }

        if (pagoReciente.estado === 'aprobado') {
            const usuario = await Usuario.findById(usuarioId);
            return res.json({
                success: true,
                status: 'approved',
                pago: pagoReciente,
                usuario: usuario
            });
        }

        try {
            const mpPayment = new MPPayment(client);
            let pagoMP = null;
            let idEncontrado = null;

            if (pagoReciente.mpPreferenceId) {
                const hace30Min = new Date(Date.now() - 30 * 60 * 1000);
                const listaPagos = await mpPayment.list({
                    external_reference: usuarioId.toString(),
                    begin_date: hace30Min.toISOString(),
                    sort: 'date_created',
                    criteria: 'desc'
                });

                if (listaPagos.results && listaPagos.results.length > 0) {
                    for (const pago of listaPagos.results) {
                        if (pago.preference_id === pagoReciente.mpPreferenceId) {
                            pagoMP = pago;
                            idEncontrado = pago.id;
                            break;
                        }
                    }
                }
            }

            if (pagoMP) {
                const status = pagoMP.status;

                if (status === 'approved') {
                    pagoReciente.mpPaymentId = String(idEncontrado);
                    pagoReciente.estado = 'aprobado';
                    await pagoReciente.save();

                    const fechaExpiracion = new Date();
                    fechaExpiracion.setDate(fechaExpiracion.getDate() + 31);

                    const usuarioActualizado = await Usuario.findByIdAndUpdate(
                        usuarioId,
                        {
                            plan: 'mistico',
                            fecha_expiracion_plan: fechaExpiracion,
                            estado: 'activo'
                        },
                        { new: true }
                    );

                    return res.json({
                        success: true,
                        status: 'approved',
                        pago: pagoReciente,
                        usuario: usuarioActualizado
                    });
                }
                else if (status === 'rejected' || status === 'in_mediation' || status === 'cancelled') {
                    pagoReciente.mpPaymentId = String(idEncontrado);
                    pagoReciente.estado = 'rechazado';
                    await pagoReciente.save();
                    return res.json({ success: true, status: 'rejected', pago: pagoReciente });
                }
            }
            
            return res.json({ success: true, status: 'pending', pago: pagoReciente });

        } catch (mpError) {
            return res.json({
                success: true,
                status: pagoReciente.estado || 'pending',
                pago: pagoReciente
            });
        }

    } catch (error) {
        res.status(500).json({ success: false, mensaje: 'Error al verificar el pago' });
    }
};

/**
 * GET /api/pagos/redirect
 * Redirección directa al frontend
 */
const redirigirDesdeMP = async (req, res) => {
    const { type, external_reference, payment_id } = req.query;
    const usuarioId = external_reference;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    try {
        const esExitoso = type === 'exito' || req.query.status === 'approved' || req.query.collection_status === 'approved';

        if (!usuarioId || usuarioId === 'undefined') {
            return res.redirect(`${frontendUrl}/#/planes?status=error`);
        }

        const pagoData = await Pago.findOne({
            usuario_id: usuarioId,
            metodo: 'Mercado Pago'
        }).sort({ createdAt: -1 });

        if (pagoData && esExitoso) {
            const fechaExpiracion = new Date();
            fechaExpiracion.setDate(fechaExpiracion.getDate() + 31);

            await Usuario.findByIdAndUpdate(usuarioId, {
                plan: 'mistico',
                fecha_expiracion_plan: fechaExpiracion,
                estado: 'activo'
            });

            pagoData.estado = 'aprobado';
            if (payment_id) pagoData.mpPaymentId = String(payment_id);
            await pagoData.save();

            return res.redirect(`${frontendUrl}/#/planes?status=success&external_reference=${usuarioId}`);
        }

        if (pagoData && (type === 'fallo' || type === 'pendiente')) {
            pagoData.estado = type === 'fallo' ? 'rechazado' : 'pendiente';
            await pagoData.save();
        }

        return res.redirect(`${frontendUrl}/#/planes?status=${type || 'pendiente'}`);

    } catch (error) {
        res.redirect(`${frontendUrl}/#/planes?status=error`);
    }
};

module.exports = { crearPreferencia, recibirNotificacion, verificarPago, redirigirDesdeMP };