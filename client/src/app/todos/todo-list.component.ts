import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Todo } from './todo';
import { Subject, takeUntil } from 'rxjs';
import { RouterLink } from '@angular/router';
import {
  MatNavList,
  MatListSubheaderCssMatStyler,
  MatListItem,
  MatListItemAvatar,
  MatListItemTitle,
  MatListItemLine,
} from '@angular/material/list';
import { TodoCardComponent } from './todo-card.component';

import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatHint, MatError } from '@angular/material/form-field';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-todo-list-component',
  templateUrl: 'todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  providers: [],
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    MatHint,
    MatSelect,
    MatOption,
    MatRadioGroup,
    MatRadioButton,
    TodoCardComponent,
    MatNavList,
    MatListSubheaderCssMatStyler,
    MatListItem,
    RouterLink,
    MatListItemAvatar,
    MatListItemTitle,
    MatListItemLine,
    MatError,
  ],
})
export class TodoListComponent implements OnInit, OnDestroy {
  public serverFilteredTodos: Todo[];
  public filteredTodos: Todo[];

  public todoOwner: string;
  public todoID: number;
  public todoStatus: boolean;
  public todoBody: string;
  public todoCategory: string;
  public filterStatus: 'Complete' | 'Incomplete' = 'Complete';
  public viewType: 'card' | 'list' = 'card';
  public todoLimit: number;

  errMsg = '';
  private ngUnsubscribe = new Subject<void>();

  private todoService = inject(TodoService);
  private snackBar = inject(MatSnackBar);

  // @param todoService
  // @param snackBar
  // constructor(private todoService: TodoService, private snackBar: MatSnackBar) {}

  getTodosFromServer() {
    this.todoService
      .getTodos({
        status: this.todoStatus,
        // category: this.todoCategory,
        owner: this.todoOwner,
        body: this.todoBody,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: returnedTodos => {
          this.serverFilteredTodos = returnedTodos;
          this.updateFilter();
        },
        error: err => {
          if (err.error instanceof ErrorEvent) {
            this.errMsg = `Problem in the client – Error: ${err.error.message}`;
          } else {
            this.errMsg = `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`;
          }
        },
      });
  }

  public updateFilter() {
    this.filteredTodos = this.todoService.filterTodos(this.serverFilteredTodos, {
      category: this.todoCategory,
      body: this.todoBody,
      limit: this.todoLimit,
    });
  }

  ngOnInit(): void {
    this.getTodosFromServer();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
