describe("Flujo Simplificado: Acceso Rápido y Guía Diaria", () => {
  const email = "brahiamjavierr@gmail.com";
  const password = "123456";

  beforeEach(() => {
    Cypress.config("defaultCommandTimeout", 60000);
  });

  it("debería realizar el acceso y consulta rápida", () => {
    // 1. LOGIN RÁPIDO
    cy.visit("/");
    cy.get('input[type="email"]').clear().type(email);
    cy.get('input[type="password"]').clear().type(password);
    cy.get(".login-btn").click();
    cy.url().should("not.include", "/login");

    // 2. NAVEGACIÓN A LECTURAS
    cy.get(".avatar-mystic-trigger").click();
    cy.contains(".nav-item", "Lecturas").click();
    cy.url().should("match", /\/lecturas/i);

    // 3. GENERAR ÚNICAMENTE LECTURA DIARIA (Core Action)
    cy.contains("button", "Lectura Diaria").click();
    cy.contains("Guía Diaria", { timeout: 60000 }).should("be.visible");

    // 4. CIERRE RÁPIDO DEL PORTAL
    cy.get(".avatar-mystic-trigger").click();
    cy.get(".logout-btn").contains("Cerrar Portal").click();
    cy.url().should("include", "/");
  });
});
