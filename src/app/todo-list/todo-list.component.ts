import { Component, OnInit } from '@angular/core';
import { TodoListService } from './todo-list.service';
import { HttpClient } from '@angular/common/http';
import { TodoList } from './todo-list.model';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit {
  constructor(
    private todoListService: TodoListService,
    private http: HttpClient
  ) {}
  loadedList: TodoList[] = [];
  isLoading = false;
  showStatus: number = -1;
  page = 1;
  totalTodoCount: number = 0;
  pageSize: number = 1;
  pageItemLimit: number = 5;

  goPage(page: number) {
    this.page = page;
  }
  fetchLists() {
    this.isLoading = true;
    this.todoListService.fetchList().subscribe((todoList) => {
      this.isLoading = false;
      this.loadedList = todoList;
      this.showStatus = -1;
      this.updatePage(todoList.length);
    });
  }

  updatePage(totalTodo: number) {
    this.totalTodoCount = totalTodo;
    this.pageSize = Math.ceil(totalTodo / this.pageItemLimit);
  }
  showList() {
    const start = (this.page - 1) * this.pageItemLimit;
    const end = start + this.pageItemLimit;
    if (this.showStatus == -1) {
      return this.loadedList.slice(start, end);
    } else {
      return this.loadedList
        .filter((todo) => {
          return todo.status == this.showStatus;
        })
        .slice(start, end);
    }
  }
  statusUpdate($event: any) {
    this.changeStatus(this.showStatus);
  }
  changeStatus(val: number) {
    this.showStatus = val;
    let countStatusList = 0;
    if (val == -1) {
      countStatusList = this.loadedList.length;
    } else {
      countStatusList = this.loadedList.filter(
        (item) => item.status == this.showStatus
      ).length;
    }
    this.page = 1;
    this.updatePage(countStatusList);
  }
  findCompleted() {
    return this.showList().filter((todo) => todo.status === 1).length > 0;
  }
  countActive() {
    let list = this.showList();
    return list.filter((todo) => {
      return todo.status == 0;
    }).length;
  }

  deleteId($event: any) {
    let idx = this.loadedList.findIndex((item) => {
      return item.id == $event;
    });
    this.loadedList.splice(idx, 1);
    this.updatePage((this.totalTodoCount = this.totalTodoCount - 1));
  }
  updateTodoItem($event: any) {
    const { id, content } = $event;
    let idx = this.loadedList.findIndex((item) => {
      return item.id == id;
    });
    this.loadedList[idx].content = content;
  }
  clearComplete() {
    let completedList = this.showList().filter((todo) => todo.status === 1);
    this.todoListService.deleteFork(completedList).subscribe((responseList) => {
      this.loadedList = this.loadedList.filter((item) => {
        return item.status == 0;
      });
      this.updatePage(
        (this.totalTodoCount = this.totalTodoCount - completedList.length)
      );
    });
  }

  toggleAll() {
    let status = this.countActive() > 0 ? 1 : 0;
    this.todoListService
      .changeStatusFork(this.showList(), status)
      .subscribe((responseList) => {
        this.showList().map((item) => {
          item.status = status;
        });
      });
  }
  goPrevious() {
    if (this.page > 1) {
      this.page--;
    } else {
      return;
    }
  }
  goNext() {
    if (this.page >= this.pageSize) {
      return;
    } else {
      this.page++;
    }
  }

  addTodo(inputRef: KeyboardEvent): void {
    const todoItem = inputRef.target as HTMLInputElement;
    if (!todoItem) {
      return;
    }
    if (inputRef.key === 'Enter') {
      const todo = todoItem.value.trim();
      if (todo.length !== 0) {
        this.todoListService.add(todo, 0).subscribe(() => {
          todoItem.value = '';
          this.page = 1;
          this.loadedList.splice(4, 1);
          this.todoListService.fetchFirst().subscribe((res: any) => {
            this.loadedList.unshift(...res);
          });
          this.updatePage((this.totalTodoCount = this.totalTodoCount + 1));
        });
      }
    }
  }

  ngOnInit() {
    this.fetchLists();
  }
}
