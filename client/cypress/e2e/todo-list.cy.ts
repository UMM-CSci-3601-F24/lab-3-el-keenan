import { TodoListPage } from '../support/todo-list.po';

const page = new TodoListPage();

describe('Todo list', () => {
  beforeEach(() => {
    page.navigateTo();
  });

  it('should have correct page title', () => {
    page.getPageTitle().should('eq', 'Todos');
  });

  it('Should enter name in input box and check for correct return', () => {
    cy.get('[data-test=todoOwnerInput]').type('Fry');
    page.getTodoCards().each($card => {
      cy.wrap($card).find('.todo-card-owner').should('have.text', ' Fry');
    });
    page
      .getTodoCards()
      .find('.todo-card-owner')
      .each($owner => expect($owner.text()).to.equal(' Fry'));
  });
});
