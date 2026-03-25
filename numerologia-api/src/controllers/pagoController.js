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
    console.log(`[REDIRECT] Tipo: ${type}`);
    console.log(`[REDIRECT] Usuario: ${usuarioId}`);
    console.log(`[REDIRECT] Preference ID: ${preference_id}`);
    console.log(`[REDIRECT] Payment ID: ${payment_id}`);

    try {
        // Validar que tenemos usuario_id válido
        if (!usuarioId || usuarioId === 'test123' || usuarioId === 'undefined') {
            console.log(`[REDIRECT] ⚠️ Usuario ID inválido: ${usuarioId}`);
            // Devolver página amigable sin actualizar BD
            const html = `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Información de Pago</title>
                    <style>
                        body { font-family: Arial; display: flex; align-items: center; justify-content: center; height: 100vh; background: #f0f0f0; }
                        .container { background: white; padding: 2rem; border-radius: 8px; text-align: center; max-width: 500px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                        h1 { color: #f39c12; }
                        p { color: #666; line-height: 1.6; }
                        a { display: inline-block; margin-top: 1rem; padding: 0.75rem 2rem; background: #667eea; color: white; text-decoration: none; border-radius: 4px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>⏳ Procesando tu Pago</h1>
                        <p>Tu solicitud está siendo procesada. Por favor, espera a ser redirigido o haz click en el botón.</p>
                        <a href="${frontendUrl}/#/planes">Volver a Planes</a>
                    </div>
                </body>
                </html>
            `;
            res.send(html);
            console.log(`[REDIRECT] ========== FIN REDIRECT (PREVIEW) ==========\n`);
            return;
        }

        // Buscar el pago más reciente del usuario
        let pagoData = null;
        let usuarioData = null;
        let mpStatus = type;

        if (usuarioId) {
            // Buscar pago en BD
            pagoData = await Pago.findOne({
                usuario_id: usuarioId,
                metodo: 'Mercado Pago'
            }).sort({ createdAt: -1 });

            // Si encontramos el pago y está aprobado, activar plan
            if (pagoData && mpStatus === 'exito') {
                console.log(`[REDIRECT] ✅ Pago encontrado, actualizando usuario`);
                
                const fechaExpiracion = new Date();
                fechaExpiracion.setDate(fechaExpiracion.getDate() + 31);
                
                usuarioData = await Usuario.findByIdAndUpdate(
                    usuarioId,
                    {
                        plan: 'mistico',
                        fecha_expiracion_plan: fechaExpiracion,
                        estado: 'activo'
                    },
                    { new: true }
                );

                // Actualizar estado del pago
                pagoData.estado = 'aprobado';
                await pagoData.save();
            }
            else if (pagoData && (mpStatus === 'fallo' || mpStatus === 'pendiente')) {
                usuarioData = await Usuario.findById(usuarioId);
                pagoData.estado = mpStatus === 'fallo' ? 'rechazado' : 'pendiente';
                await pagoData.save();
            }
        }

        // Determinar icon y colores según el tipo
        let icon = '⏳';
        let color = '#f39c12';
        let titulo = 'Pago Pendiente';
        let mensaje = 'Tu pago está siendo procesado';

        if (type === 'exito') {
            icon = '✅';
            color = '#27ae60';
            titulo = '¡Pago Aprobado!';
            mensaje = 'Tu suscripción al Plan Místico ha sido activada correctamente';
        } 
        else if (type === 'fallo') {
            icon = '❌';
            color = '#e74c3c';
            titulo = 'Pago Rechazado';
            mensaje = 'El pago no pudo ser procesado. Por favor, intenta nuevamente';
        }

        // HTML de la pantalla de resultado
        const html = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${titulo}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                        display: flex; 
                        flex-direction: column; 
                        align-items: center; 
                        justify-content: center; 
                        min-height: 100vh; 
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: #333;
                        padding: 20px;
                    }
                    .container {
                        background: white;
                        border-radius: 20px;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                        max-width: 600px;
                        width: 100%;
                        overflow: hidden;
                        animation: slideUp 0.5s ease-out;
                    }
                    @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                    .header {
                        background: ${color};
                        padding: 3rem 2rem;
                        text-align: center;
                        color: white;
                    }
                    .icon { font-size: 4rem; margin-bottom: 1rem; }
                    .titulo { 
                        font-size: 2rem; 
                        font-weight: 700; 
                        margin-bottom: 0.5rem;
                    }
                    .subtitulo {
                        font-size: 1.1rem;
                        opacity: 0.95;
                        line-height: 1.5;
                    }
                    .body {
                        padding: 2.5rem;
                    }
                    .mensaje {
                        color: #666;
                        font-size: 1rem;
                        margin-bottom: 2rem;
                        line-height: 1.6;
                        text-align: center;
                    }
                    .detalles {
                        background: #f8f9fa;
                        border-radius: 12px;
                        padding: 1.5rem;
                        margin-bottom: 2rem;
                    }
                    .detalle-item {
                        display: flex;
                        justify-content: space-between;
                        padding: 0.75rem 0;
                        border-bottom: 1px solid #e0e0e0;
                    }
                    .detalle-item:last-child {
                        border-bottom: none;
                    }
                    .label {
                        font-weight: 600;
                        color: #2c3e50;
                    }
                    .valor {
                        color: #667eea;
                        font-weight: 500;
                    }
                    .acciones {
                        display: flex;
                        gap: 1rem;
                        justify-content: center;
                        flex-wrap: wrap;
                    }
                    .btn {
                        padding: 0.75rem 2rem;
                        border: none;
                        border-radius: 8px;
                        font-size: 1rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        text-decoration: none;
                        display: inline-block;
                    }
                    .btn-primary {
                        background: ${color};
                        color: white;
                    }
                    .btn-primary:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 20px rgba(0,0,0,0.15);
                    }
                    .btn-secondary {
                        background: white;
                        color: ${color};
                        border: 2px solid ${color};
                    }
                    .btn-secondary:hover {
                        background: ${color};
                        color: white;
                    }
                    .footer {
                        text-align: center;
                        padding: 1.5rem;
                        background: #f8f9fa;
                        color: #666;
                        font-size: 0.9rem;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="icon">${icon}</div>
                        <div class="titulo">${titulo}</div>
                        <div class="subtitulo">${mensaje}</div>
                    </div>
                    
                    <div class="body">
                        ${pagoData ? `
                        <div class="detalles">
                            <div class="detalle-item">
                                <span class="label">Plan</span>
                                <span class="valor">Plan Místico Numerología</span>
                            </div>
                            <div class="detalle-item">
                                <span class="label">Monto Pagado</span>
                                <span class="valor">$${pagoData.monto?.toLocaleString('es-CO') || '39,000'} COP</span>
                            </div>
                            <div class="detalle-item">
                                <span class="label">Duración</span>
                                <span class="valor">31 días</span>
                            </div>
                            <div class="detalle-item">
                                <span class="label">Fecha de Pago</span>
                                <span class="valor">${new Date(pagoData.fecha_pago).toLocaleDateString('es-CO')}</span>
                            </div>
                            <div class="detalle-item">
                                <span class="label">Estado</span>
                                <span class="valor" style="color: ${color}">${type === 'exito' ? 'APROBADO' : type === 'fallo' ? 'RECHAZADO' : 'PENDIENTE'}</span>
                            </div>
                        </div>
                        ` : ''}
                        
                        <div class="acciones">
                            ${type === 'exito' ? `
                                <a href="${frontendUrl}/#/planes" class="btn btn-primary">
                                    Ir a Mi Cuenta
                                </a>
                            ` : `
                                <a href="${frontendUrl}/#/planes" class="btn btn-secondary">
                                    Volver a Planes
                                </a>
                                <a href="${frontendUrl}/#/planes" class="btn btn-primary">
                                    Intentar de Nuevo
                                </a>
                            `}
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p>Operación ${type === 'exito' ? '#' + (pagoData?.mpPaymentId || pagoData?._id || 'N/A'): 'procesada'}</p>
                        <p style="margin-top: 0.5rem; opacity: 0.7;">Seguridad garantizada por Mercado Pago</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        res.send(html);
        console.log(`[REDIRECT] ========== FIN REDIRECT (${type.toUpperCase()}) ==========\n`);

    } catch (error) {
        console.error('[REDIRECT] Error:', error);
        res.status(500).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Error</title>
                <style>
                    body { font-family: Arial; display: flex; align-items: center; justify-content: center; height: 100vh; background: #f0f0f0; }
                    .error { background: white; padding: 2rem; border-radius: 8px; text-align: center; max-width: 500px; }
                    h1 { color: #e74c3c; }
                </style>
            </head>
            <body>
                <div class="error">
                    <h1>❌ Error al procesar el pago</h1>
                    <p>Por favor, contacta con soporte.</p>
                </div>
            </body>
            </html>
        `);
    }
};

module.exports = { crearPreferencia, recibirNotificacion, verificarPago, redirigirDesdeMP };