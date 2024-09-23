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



  getTodoListItems(){
    return cy.get('.todo-nav-list .todo-list-item');
  }

  changeView(viewType: 'card' | 'list') {
    return cy.get(`[data-test=viewTypeRadio] mat-radio-button[value="${viewType}"]`).click();
  }




}


