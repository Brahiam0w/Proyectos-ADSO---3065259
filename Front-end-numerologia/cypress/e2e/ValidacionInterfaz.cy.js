describe("Validación de Interfaz - Página de Inicio de Sesión", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("debería mostrar los elementos visuales principales de la página", () => {
    // Verificar contenedor y tarjeta principal
    cy.get(".login-page").should("be.visible");
    cy.get(".login-card").should("be.visible");

    // Verificar textos de encabezado
    cy.contains("h1.title", "Bienvenido a tu Destino").should("be.visible");
    cy.contains("p.subtitle", "Ingresa a tu portal de numerología").should("be.visible");
  });

  it("debería mostrar el formulario con sus campos correspondientes", () => {
    // Verificar campo de correo electrónico
    cy.get('input[type="email"]').should("be.visible");
    cy.contains("Correo electrónico").should("be.visible");

    // Verificar campo de contraseña
    cy.get('input[type="password"]').should("be.visible");
    cy.contains("Contraseña").should("be.visible");

    // Verificar botón de "Mostrar Contraseña" (icono ojo)
    cy.get('.q-field__append .q-icon').should("be.visible");
  });

  it("debería mostrar los enlaces y botones de acción", () => {
    // Verificar botón de inicio de sesión
    cy.get(".login-btn").should("be.visible").and("contain", "Iniciar sesión");

    // Verificar enlace de recuperación de contraseña
    cy.get(".forgot-link").should("be.visible").and("contain", "¿Olvidaste tu contraseña?");

    // Verificar sección de registro
    cy.contains(".register-text", "¿Aún no tienes cuenta?").should("be.visible");
    cy.get(".register-link").should("be.visible").and("contain", "Regístrate aquí");
  });

  it("debería verificar los elementos de diseño estáticos (CSS y estilos)", () => {
    // Verificar que el pie de página esté presente
    cy.get(".copyright").should("be.visible").and("contain", "Numerología Mística");

    // Verificar que la barra inferior de colores exista
    cy.get(".bottom-bar").should("exist");

    // Verificar el ícono principal
    cy.get(".logo-circle .q-icon").should("be.visible");
  });
});
