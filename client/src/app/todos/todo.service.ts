import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from './todo';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  constructor(private httpClient: HttpClient) {}

  readonly todoUrl: string = environment.apiUrl + 'todos';

  getTodos(filters?: { status?: boolean; category?: string; owner?: string }): Observable<Todo[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.owner) {
        httpParams = httpParams.set('owner', filters.category);
      }
      if (filters.category) {
        httpParams = httpParams.set('category', filters.category);
      }
      if (filters.status != undefined) {
        httpParams = httpParams.set('status', filters.status.toString());
      }
    }
    return this.httpClient.get<Todo[]>(this.todoUrl, {
      params: httpParams,
    });
  }
  filterTodos(todos: Todo[], filters: {category: string}): Todo[] {
    let filteredTodos = todos;

    if(filters.category) {
      filters.category = filters.category.toLocaleLowerCase();
      filteredTodos = filteredTodos.filter(todo => todo.category.toLocaleLowerCase().indexOf(filters.category) !== -1);
    }

    return filteredTodos;
  }
}
