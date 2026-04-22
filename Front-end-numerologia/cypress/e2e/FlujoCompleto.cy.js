describe("Flujo Completo: Login, Compra y Lecturas", () => {
  const email = "brahiamjavierr@gmail.com";
  const password = "123456";

  beforeEach(() => {
    Cypress.config("defaultCommandTimeout", 60000);
  });

  it("debería completar el flujo solicitado por el usuario", () => {
    // 1. LOGIN
    cy.visit("/");
    cy.get('input[type="email"]').clear().type(email);
    cy.get('input[type="password"]').clear().type(password);
    cy.get(".login-btn").click();

    cy.url().should("not.include", "/login");

    // 2. ABRIR MENU LATERAL Y CLIC EN PLANES
    cy.get(".avatar-mystic-trigger").click();
    cy.contains(".nav-item", "Planes").click();
    cy.url().should("include", "/planes");

    // 3. CLIC EN SUSCRIBIRSE AHORA
    cy.contains("Suscribirse Ahora").click({ force: true });

    // 4. CONFIRMAR EN EL DIÁLOGO
    cy.contains("Ir a Pagar").click();

    // 5. INTERACCIÓN CON MERCADO PAGO (SANDBOX)
    cy.origin("https://sandbox.mercadopago.com.co", { args: { email } }, ({ email }) => {
      cy.get('body', { timeout: 30000 }).should('be.visible');

      // Aceptar cookies
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Aceptar"), button:contains("cookies")').length > 0) {
          cy.contains("button", /Aceptar|Entendido/i).click({ force: true });
        }
      });

      // Seleccionar opción tarjeta
      cy.contains(/Tarjeta/i, { timeout: 20000 }).click({ force: true });
      
      // ESPERA CRÍTICA: Dar tiempo a que el formulario se renderice completamente
      cy.wait(5000);

      // Llenar datos de la tarjeta. 
      // Mercado Pago usa IFRAMES para campos sensibles (PCI) y INPUTS para el resto.
      cy.log("Llenando formulario de tarjeta...");

      // Helper estricto para escribir en iframes de Mercado Pago por su índice exacto
      const typeInIframeByIndex = (index, value) => {
        cy.get('iframe', { timeout: 25000 })
          .eq(index)
          .its('0.contentDocument.body', { timeout: 25000 })
          .should('not.be.empty')
          .then(cy.wrap)
          // Buscamos inputs, pero excluimos los que tienen la clase .hide o son type="hidden"
          .find('input')
          .not('.hide, [type="hidden"], [style*="display: none"]')
          .first()
          .then(($input) => {
            cy.wrap($input).type(value, { delay: 50, force: true });
          });
      };

      // Llenar campos siguiendo el orden visual y separando iframes de inputs

      // 1. Número de tarjeta (Primer Iframe)
      typeInIframeByIndex(0, "5254133674403564");

      // 2. Nombre del titular (Input estándar)
      cy.get('input[name*="Name"], input[id*="Name"], input#cardholderName')
        .clear({force: true}).type("APRO", {force: true});

      // 3. Vencimiento (Segundo Iframe)
      typeInIframeByIndex(1, "1130");

      // 4. Código de seguridad (Tercer Iframe)
      typeInIframeByIndex(2, "123");
      
      // 5. Documento del titular (Input estándar)
      // En la imagen se ve como un input con un prefijo CC
      cy.get('input[name*="IdentificationNumber"], input#cardholderIdentificationNumber, input[placeholder*="9.999.999"]')
        .first()
        .clear({force: true}).type("123456789", {force: true});

      // Aceptar cookies justo antes de continuar, por si el banner apareció tarde y bloquea el botón
      cy.log("Comprobando banner de cookies...");
      cy.get('body').then(($body) => {
        if ($body.text().includes("Aceptar cookies")) {
          cy.contains("button", "Aceptar cookies").click({ force: true });
          cy.wait(1000); // Dar tiempo a que la animación de cierre termine
        }
      });

      // Clic en Continuar (Buscamos el botón que contiene el texto y hacemos scroll)
      cy.log("Clic en Continuar...");
      cy.get('button').contains(/Continuar|Siguiente/i, { timeout: 20000 })
        .should('be.visible')
        .scrollIntoView()
        .click({ force: true });

      // Seleccionar cuotas (Añadimos un wait pequeño para que cargue la lista de cuotas)
      cy.log("Esperando lista de cuotas...");
      cy.wait(4000); 
      cy.contains(/1x \$39\.000|1 cuota/i, { timeout: 35000 }).click({ force: true });

      // Ingresar correo electrónico si Mercado Pago lo solicita
      cy.log("Comprobando si solicita E-mail...");
      cy.get('body').then(($body) => {
        if ($body.find('input[type="email"]').length > 0) {
          cy.get('input[type="email"]').first().clear({ force: true }).type(email, { force: true });
        } else if ($body.text().includes("E-mail") || $body.text().includes("correo")) {
          // Si no es tipo email, buscamos por texto
          cy.contains(/E-mail|correo/i).parent().find('input').first().clear({ force: true }).type(email, { force: true });
        }
      });

      // Finalizar Pago
      cy.get('button').contains(/Pagar|Confirmar/i).click({ force: true });
      
      // Confirmación
      cy.contains(/¡Listo!|Pago aprobado|acreditó/i, { timeout: 60000 }).should("be.visible");
      cy.contains(/Volver|Regresar/i).click({ force: true });
    });

    // 6. GENERAR LECTURAS
    cy.url().should("include", "/planes");
    
    cy.get(".avatar-mystic-trigger").click();
    cy.contains(".nav-item", "Lecturas").click();
    
    cy.contains("Lectura Principal").click();
    cy.contains("Misión de Vida", { timeout: 60000 }).should("be.visible");

    cy.contains("Lectura Diaria").click();
    cy.contains("Guía Diaria", { timeout: 60000 }).should("be.visible");

    // 7. IR A HISTORIAL, ABRIR Y CERRAR LECTURAS
    cy.get(".avatar-mystic-trigger").click();
    cy.contains(".nav-item", "Historial").click();
    cy.url().should("match", /\/historial/i);

    // Abrir y cerrar una Guía Diaria
    cy.get(".history-card").not(".principal-border").first().click();
    cy.get(".q-dialog .q-bar .q-btn").find('i.q-icon:contains("close")').parent().click();

    // Abrir y cerrar una Esencia de Vida
    cy.get(".history-card.principal-border").first().click();
    cy.get(".q-dialog .q-bar .q-btn").find('i.q-icon:contains("close")').parent().click();

    // 8. IR A CONFIGURACIÓN Y ACTUALIZAR PERFIL
    cy.get(".avatar-mystic-trigger").click();
    cy.contains(".nav-item", "Configuración").click();
    cy.url().should("match", /\/configuracion/i);

    cy.get('input[aria-label="Nombre de Iniciado"]').clear().type("Prueba1");
    
    // Seleccionar Género Femenino
    cy.get('.q-select').contains('Esencia (Género)').click({ force: true });
    cy.get('.q-item__label').contains('femenino').click();

    cy.contains("button", "Actualizar Identidad").click();
    cy.contains("Su identidad ha sido actualizada en las estrellas", { timeout: 10000 }).should("be.visible");

    // 9. CERRAR PORTAL
    cy.get(".avatar-mystic-trigger").click();
    cy.get(".logout-btn").contains("Cerrar Portal").click();

    cy.url().should("include", "/");
  });
});
