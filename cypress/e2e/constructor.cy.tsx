describe('Страница конструктора бургера', () => {
  const bunId = 'bun-1';
  const mainId = 'main-1';
  const sauceId = 'sauce-1';

  beforeEach(() => {
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('добавляет булку и начинки в конструктор', () => {
    cy.get(`[data-testid="ingredient-card"][data-ingredient-id="${bunId}"]`)
      .contains('Добавить')
      .click();
    cy.get(`[data-testid="ingredient-card"][data-ingredient-id="${mainId}"]`)
      .contains('Добавить')
      .click();
    cy.get(`[data-testid="ingredient-card"][data-ingredient-id="${sauceId}"]`)
      .contains('Добавить')
      .click();

    cy.get('[data-testid="constructor-bun-top"]').contains(
      'Флюоресцентная булка R2-D3'
    );
    cy.get('[data-testid="constructor-bun-bottom"]').contains(
      'Флюоресцентная булка R2-D3'
    );
    cy.get('[data-testid="constructor-ingredient"]').should('have.length', 2);
    cy.get(
      `[data-testid="constructor-ingredient"][data-ingredient-id="${mainId}"]`
    ).should('exist');
    cy.get(
      `[data-testid="constructor-ingredient"][data-ingredient-id="${sauceId}"]`
    ).should('exist');
  });

  it('открывает и закрывает модальное окно ингредиента', () => {
    cy.get(`[data-testid="ingredient-card"][data-ingredient-id="${bunId}"] a`)
      .first()
      .click();

    cy.get('[data-testid="modal"]').should('be.visible');
    cy.get('[data-testid="ingredient-details-name"]').should(
      'contain',
      'Флюоресцентная булка R2-D3'
    );

    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');

    cy.get(`[data-testid="ingredient-card"][data-ingredient-id="${mainId}"] a`)
      .first()
      .click();
    cy.get('[data-testid="modal"]').should('be.visible');
    cy.get('[data-testid="ingredient-details-name"]').should(
      'contain',
      'Биокотлета из марсианской Магнолии'
    );

    cy.get('[data-testid="modal-overlay"]').click({ force: true });
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('создаёт заказ, показывает номер и очищает конструктор', () => {
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
        win.document.cookie = 'accessToken=test-access-token';
      }
    });
    cy.wait('@getIngredients');
    cy.wait('@getUser');

    cy.get(`[data-testid="ingredient-card"][data-ingredient-id="${bunId}"]`)
      .contains('Добавить')
      .click();
    cy.get(`[data-testid="ingredient-card"][data-ingredient-id="${mainId}"]`)
      .contains('Добавить')
      .click();
    cy.get(`[data-testid="ingredient-card"][data-ingredient-id="${sauceId}"]`)
      .contains('Добавить')
      .click();

    cy.contains('button', 'Оформить заказ').click();

    cy.wait('@createOrder');
    cy.get('[data-testid="modal"]').should('be.visible');
    cy.get('[data-testid="order-number"]').should('contain', '12345');

    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');

    cy.get('[data-testid="constructor-ingredient"]').should('have.length', 0);
    cy.get('[data-testid="constructor-bun-top"]').should('not.exist');
    cy.get('[data-testid="constructor-bun-bottom"]').should('not.exist');
    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });
});
