import { TodoListPage } from '../support/todo-list.po';

const page = new TodoListPage();

describe('Todo list', () => {
  beforeEach(() => {
    page.navigateTo();
  });

  it('should have correct page title', () => {
    page.getPageTitle().should('eq', 'Todos');
  });

  it('Should enter owner in input box and check for correct return', () => {
    cy.get('[data-test=todoOwnerInput]').type('Fry');
    page.getTodoCards().each($card => {
      cy.wrap($card).find('.todo-card-owner').should('have.text', ' Fry');
    });
    page
      .getTodoCards()
      .find('.todo-card-owner')
      .each($owner => expect($owner.text()).to.equal(' Fry'));
  });

  it('Should enter category in input box and check for correct return', () => {
    cy.get('[data-test=todoCategoryInput]').click();
    cy.get('mat-option').contains('video games').click();
    page.getTodoCards().each($card => {
      cy.wrap($card).find('.todo-card-category').should('include.text', 'video games');
    });
  });

  it('Should type something in the limit and category filter and check that it returned correct elements', () => {
    // Filter for limit of '3'
    cy.get('[data-test=todoLimitInput]').type('3');
    cy.get('[data-test=todoCategoryInput]').click();
    cy.get('mat-option').contains('video games').click();
    page.getTodoCards().should('have.lengthOf', 3);

    // Go through each of the cards that are being shown and get the cards
    page.getTodoCards().each($card => {
      cy.wrap($card).find('.todo-card-category').should('include.text', 'video games');
      cy.wrap($card).find('.todo-card-category').should('not.contain.text', 'software');
    });
  });

  it('Should change the view', () => {
    // Choose the view type "List"
    page.changeView('list');

    // We should not see any cards
    // There should be list items
    page.getTodoCards().should('not.exist');
    page.getTodoListItems().should('exist');

    // Choose the view type "Card"
    page.changeView('card');

    // There should be cards
    // We should not see any list items
    page.getTodoCards().should('exist');
    page.getTodoListItems().should('not.exist');
  });
});
