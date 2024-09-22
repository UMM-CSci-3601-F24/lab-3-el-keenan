import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from './todo';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  readonly todoUrl: string = environment.apiUrl + 'todos';

  constructor(private httpClient: HttpClient) {}

  getTodos(filters?: {
    status?: boolean;
    body?: string;
    owner?: string;
    category?: string;
    limit?: number;
  }): Observable<Todo[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.owner) {
        httpParams = httpParams.set('owner', filters.owner);
      }
      if (filters.body) {
        httpParams = httpParams.set('body', filters.body);
      }
      if (filters.status != undefined) {
        httpParams = httpParams.set('status', filters.status.toString());
      }
    }
    return this.httpClient.get<Todo[]>(this.todoUrl, {
      params: httpParams,
    });
  }
  // if want to implement view more uncoment
  //   getTodoById(id: string): Observable<Todo> {
  //     return this.httpClient.get<Todo>(this.todoUrl + '/' + id);
  //   }

  filterTodos(todos: Todo[], filters: { body?: string; category?: string; limit?: number }): Todo[] {
    let filteredTodos = todos;

    if (filters.category) {
      filters.category = filters.category.toLowerCase();
      filteredTodos = filteredTodos.filter(todo => todo.category.toLowerCase().indexOf(filters.category) !== -1);
    }

    if (filters.body) {
      filters.body = filters.body.toLowerCase();
      filteredTodos = filteredTodos.filter(todo => todo.body.toLowerCase().indexOf(filters.body) !== -1);
    }

    if (filters.limit) {
      filteredTodos = filteredTodos.slice(0, filters.limit);
    }

    return filteredTodos;
  }
}
