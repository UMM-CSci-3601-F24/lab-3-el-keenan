import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
// import { Todo, TodoRole } from '../app/todos/todo';
import { TodoService } from '../app/todos/todo.service';
import { Todo } from 'src/app/todos/todo';

/**
 * A "mock" version of the `UserService` that can be used to test components
 * without having to create an actual service. It needs to be `Injectable` since
 * that's how services are typically provided to components.
 */
@Injectable()
export class MockTodoService extends TodoService {
  static testTodos: Todo[] = [
    {
      _id: '58895985a22c04e761776d54',
      owner: 'Blanche',
      status: false,
      body: 'In sunt ex non tempor cillum commodo amet incididunt anim qui commodo quis. Cillum non labore ex sint esse.',
      category: 'software design',
    },
    {
      _id: '58895985c1849992336c219b',
      owner: 'Fry',
      status: false,
      body: 'Ipsum esse est ullamco magna tempor anim laborum non officia deserunt veniam commodo. Aute minim incididunt ex commodo.',
      category: 'video games',
    },
    {
      _id: '5889598528c4748a0292e014',
      owner: 'Workman',
      status: true,
      body: 'Eiusmod commodo officia amet aliquip est ipsum nostrud duis sunt voluptate mollit excepteur. Sunt non in pariatur et culpa est sunt.',
      category: 'software design',
    },
  ];

  constructor() {
    super(null);
  }

  // It's OK that the `_filters` argument isn't used here, so we'll disable
  // this warning for just his function.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTodos(_filters: { owner?: string; category?: string }): Observable<Todo[]> {
    // Our goal here isn't to test (and thus rewrite) the service, so we'll
    // keep it simple and just return the test users regardless of what
    // filters are passed in.
    //
    // The `of()` function converts a regular object or value into an
    // `Observable` of that object or value.
    return of(MockTodoService.testTodos);
  }

  getTodosById(id: string): Observable<Todo> {
    // If the specified ID is for one of the test users,
    // return that user, otherwise return `null` so
    // we can test illegal user requests.
    if (id === MockTodoService.testTodos[0]._id) {
      return of(MockTodoService.testTodos[0]);
    } else if (id === MockTodoService.testTodos[1]._id) {
      return of(MockTodoService.testTodos[1]);
    } else if (id === MockTodoService.testTodos[2]._id) {
      return of(MockTodoService.testTodos[2]);
    } else {
      return of(null);
    }
  }
}
