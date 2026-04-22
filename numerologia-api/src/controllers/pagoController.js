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
    
    const body = {
      items: [
        {
          id: 'plan-mistico-01',
          title: 'Plan Místico Numerología',
          description: 'Acceso completo a lecturas místicas personalizadas por 31 días',
          quantity: 1,
          unit_price: Number(monto), 
          currency_id: 'COP', 
        }
      ],
      back_urls: {
        success: `${backendUrl}/api/pagos/redirect?type=exito`,
        failure: `${backendUrl}/api/pagos/redirect?type=fallo`,
        pending: `${backendUrl}/api/pagos/redirect?type=pendiente`,
      },
      auto_return: 'approved',
      external_reference: usuarioId.toString(),
    };

    // Solo agregar notification_url si existe la variable de entorno y no es localhost
    if (process.env.WEBHOOK_URL && !process.env.WEBHOOK_URL.includes('localhost')) {
      body.notification_url = process.env.WEBHOOK_URL;
    }

    console.log('[MP] Creando preferencia para:', usuario.email);
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
 * Busca por preference_id en MP (funciona en localhost)
 */
const verificarPago = async (req, res) => {
    const usuarioId = req.usuario._id;

    try {
        console.log(`\n[VERIFICAR] ========== Iniciando verificación para usuario: ${usuarioId} ==========`);

        // Buscar el pago más reciente del usuario
        const pagoReciente = await Pago.findOne({
            usuario_id: usuarioId,
            metodo: 'Mercado Pago',
        }).sort({ createdAt: -1 });

        if (!pagoReciente) {
            console.log(`[VERIFICAR] ❌ No hay pagos para este usuario`);
            return res.json({ 
                success: true, 
                status: 'no_payment', 
                mensaje: 'No hay pagos registrados' 
            });
        }

        console.log(`[VERIFICAR] Pago encontrado:`, {
            id: pagoReciente._id,
            estado: pagoReciente.estado,
            mpPaymentId: pagoReciente.mpPaymentId,
            mpPreferenceId: pagoReciente.mpPreferenceId
        });

        // Si ya está aprobado, devolverlo
        if (pagoReciente.estado === 'aprobado') {
            const usuario = await Usuario.findById(usuarioId);
            console.log(`[VERIFICAR] ✅ Pago ya estaba aprobado`);
            return res.json({
                success: true,
                status: 'approved',
                pago: pagoReciente,
                usuario: usuario,
                mensaje: 'Pago ya aprobado'
            });
        }

        // Intentar verificar en Mercado Pago
        try {
            const mpPayment = new MPPayment(client);
            let pagoMP = null;
            let idEncontrado = null;

             // Primero: buscar por preference_id (es lo más seguro para localhost)
            if (pagoReciente.mpPreferenceId) {
                console.log(`[VERIFICAR] 1️⃣ Buscando pagos por external_reference (usuario ID)...`);
                try {
                    // Buscar todos los pagos del usuario en los últimos 30 minutos
                    const hace30Min = new Date(Date.now() - 30 * 60 * 1000);
                    const listaPagos = await mpPayment.list({
                        external_reference: usuarioId.toString(),
                        begin_date: hace30Min.toISOString(),
                        sort: 'date_created',
                        criteria: 'desc'
                    });

                    console.log(`[VERIFICAR] Total de pagos encontrados: ${listaPagos.results?.length || 0}`);

                    // Buscar el pago que coincida con nuestra preference_id
                    if (listaPagos.results && listaPagos.results.length > 0) {
                        for (const pago of listaPagos.results) {
                            console.log(`[VERIFICAR]   → Pago ${pago.id}: status=${pago.status}, preference=${pago.preference_id}`);
                            
                            // Coincide con nuestra preferencia
                            if (pago.preference_id === pagoReciente.mpPreferenceId) {
                                pagoMP = pago;
                                idEncontrado = pago.id;
                                console.log(`[VERIFICAR] ✓ Encontrado el pago correcto!`);
                                break;
                            }
                        }
                    }
                } catch (err) {
                    console.log(`[VERIFICAR] Error en búsqueda por externe_reference:`, err.message);
                }
            }

            // Segundo: si tenemos payment_id guardado, consultarlo directo
            if (!pagoMP && pagoReciente.mpPaymentId) {
                console.log(`[VERIFICAR] 2️⃣ Consultando payment_id directo: ${pagoReciente.mpPaymentId}`);
                try {
                    pagoMP = await mpPayment.get({ id: pagoReciente.mpPaymentId });
                    idEncontrado = pagoReciente.mpPaymentId;
                    console.log(`[VERIFICAR] ✓ Payment encontrado`);
                } catch (err) {
                    console.log(`[VERIFICAR] Error consultando payment_id:`, err.message);
                }
            }

            // Procesar resultado
            if (pagoMP) {
                const status = pagoMP.status;
                console.log(`[VERIFICAR] 📊 Estado en MP: ${status} (ID: ${idEncontrado})`);

                if (status === 'approved') {
                    console.log(`[VERIFICAR] ✅✅ PAGO APROBADO!`);
                    
                    pagoReciente.mpPaymentId = String(idEncontrado);
                    pagoReciente.estado = 'aprobado';
                    await pagoReciente.save();

                    // Activar plan
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

                    console.log(`[VERIFICAR] 🎉 Plan usuario actualizado a MISTICO`);
                    console.log(`[VERIFICAR] ========== FIN VERIFICACIÓN (APROBADO) ==========\n`);
                    
                    return res.json({
                        success: true,
                        status: 'approved',
                        pago: pagoReciente,
                        usuario: usuarioActualizado,
                        mensaje: '✅ Pago aprobado - Plan Místico activado'
                    });
                } 
                else if (status === 'rejected' || status === 'in_mediation' || status === 'cancelled') {
                    console.log(`[VERIFICAR] ❌ Pago RECHAZADO: ${status}`);
                    
                    pagoReciente.mpPaymentId = String(idEncontrado);
                    pagoReciente.estado = 'rechazado';
                    await pagoReciente.save();

                    console.log(`[VERIFICAR] ========== FIN VERIFICACIÓN (RECHAZADO) ==========\n`);
                    
                    return res.json({
                        success: true,
                        status: 'rejected',
                        pago: pagoReciente,
                        mensaje: `❌ Pago ${status}`
                    });
                } 
                else if (status === 'pending' || status === 'in_process') {
                    console.log(`[VERIFICAR] ⏳ Pago en proceso: ${status}`);
                    console.log(`[VERIFICAR] ========== FIN VERIFICACIÓN (PENDIENTE) ==========\n`);
                    
                    return res.json({
                        success: true,
                        status: 'pending',
                        pago: pagoReciente,
                        mensaje: `⏳ Pago ${status}`
                    });
                }
            }
            else {
                console.log(`[VERIFICAR] ⏳ No se encontró pago en MP (quizás aún no se procesó)`);
                console.log(`[VERIFICAR] ========== FIN VERIFICACIÓN (SIN PAGO EN MP) ==========\n`);
                
                return res.json({
                    success: true,
                    status: 'pending',
                    pago: pagoReciente,
                    mensaje: 'Esperando confirmación de Mercado Pago...'
                });
            }

        } catch (mpError) {
            console.error(`[VERIFICAR] ❌ Error consultando Mercado Pago:`, mpError.message);
            
            console.log(`[VERIFICAR] ⚠️ Fallback: usando estado local de BD`);
            console.log(`[VERIFICAR] ========== FIN VERIFICACIÓN (ERROR MP) ==========\n`);
            
            return res.json({
                success: true,
                status: pagoReciente.estado || 'pending',
                pago: pagoReciente,
                mensaje: 'Estado local (MP no disponible)'
            });
        }

    } catch (error) {
        console.error('[VERIFICAR] ❌ Error general:', error.message);
        console.log(`[VERIFICAR] ========== FIN VERIFICACIÓN (ERROR GENERAL) ==========\n`);
        
        res.status(500).json({ 
            success: false, 
            mensaje: 'Error al verificar el pago'
        });
    }
};

/**
 * GET /api/pagos/redirect
 * Pantalla que muestra el estado del pago con detalles
 */
const redirigirDesdeMP = async (req, res) => {
    const { type, external_reference, preference_id, payment_id } = req.query;
    const usuarioId = external_reference;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    console.log(`\n[REDIRECT] ========== REDIRECT desde Mercado Pago ==========`);
    console.log(`[REDIRECT] Tipo: ${type}, Usuario: ${usuarioId}`);

    try {
        const esExitoso = type === 'exito' || req.query.status === 'approved' || req.query.collection_status === 'approved';
        
        if (!usuarioId || usuarioId === 'undefined') {
            console.log(`[REDIRECT] ⚠️ Usuario ID inválido`);
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
            
            console.log(`[REDIRECT] ✅ Plan activado para: ${usuarioId}`);

            // Renderizar pantalla de confirmación con botón "Ir a Mi Cuenta"
            const html = `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>¡Pago Exitoso!</title>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: linear-gradient(135deg, #1a0f2e 0%, #0d081a 100%); color: white; text-align: center; }
                        .card { background: rgba(255,255,255,0.05); padding: 3rem; border-radius: 24px; border: 1px solid rgba(212, 175, 55, 0.3); box-shadow: 0 20px 50px rgba(0,0,0,0.5); max-width: 400px; width: 90%; }
                        h1 { color: #d4af37; margin-bottom: 1rem; }
                        p { color: #ccc; line-height: 1.6; margin-bottom: 2rem; }
                        .btn { display: inline-block; padding: 1rem 2rem; background: #d4af37; color: #0d081a; text-decoration: none; border-radius: 12px; font-weight: bold; transition: 0.3s; }
                        .btn:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(212, 175, 55, 0.3); }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <div style="font-size: 4rem; margin-bottom: 1rem;">✨</div>
                        <h1>¡Pago Aprobado!</h1>
                        <p>Tu conexión con el oráculo ha sido elevada. El Plan Místico ya está activo en tu cuenta.</p>
                        <a href="${frontendUrl}/#/planes?status=success&external_reference=${usuarioId}" class="btn">
                            Ir a Mi Cuenta
                        </a>
                    </div>
                </body>
                </html>
            `;
            return res.send(html);
            }
        if (pagoData && (mpStatus === 'fallo' || mpStatus === 'pendiente')) {
            pagoData.estado = mpStatus === 'fallo' ? 'rechazado' : 'pendiente';
            await pagoData.save();
        }

        return res.redirect(`${frontendUrl}/#/planes?status=${type || 'pendiente'}`);

    } catch (error) {
        console.error('[REDIRECT] ❌ Error:', error);
        res.redirect(`${frontendUrl}/#/planes?status=error`);
    }
};

module.exports = { crearPreferencia, recibirNotificacion, verificarPago, redirigirDesdeMP };