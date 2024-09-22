export class TodoListPage {
  navigateTo() {
    return cy.visit('/todos');
  }
  getPageTitle() {
    return cy.title();
  }

  getTodoCards() {
    return cy.get('.todo-cards-container app-todo-card');
  }
}
