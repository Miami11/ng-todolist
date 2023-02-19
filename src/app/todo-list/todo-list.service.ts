import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { TodoList } from './todo-list.model';
import { map } from 'rxjs/operators';
import { TodoService } from './todo/todo.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoListService {
  constructor(private http: HttpClient, private todoService: TodoService) {}
  add(content: string, status: number) {
    const todo: TodoList = { content: content, status: status };
    return this.http.post<{ content: string; status: number }>(
      'http://localhost:8888/data',
      todo
    );
  }
  changeStatus(id: any, statusVal: number) {
    console.log(id, 'id, statusval=', statusVal);
    return this.http.patch(`http://localhost:8888/data/${id}`, {
      status: statusVal,
    });
  }
  fetchFirst() {
    return this.http.get<{ [key: string]: TodoList }>(
      'http://localhost:8888/data?_sort=id&_order=desc&_limit=1'
    );
  }
  changeStatusFork(list: any, statusVal: number) {
    let actions = list.map((item: { id: any; status: number }) =>
      this.changeStatus(item.id, statusVal)
    );
    return forkJoin(actions);
  }
  delete(id: any) {
    return this.todoService.delete(id);
  }

  deleteFork(list: any) {
    let actions = list.map((item: { id: any }) => this.delete(item.id));
    return forkJoin(actions);
  }
  fetchList() {
    return this.http
      .get<{ [key: string]: TodoList }>(
        `http://localhost:8888/data?_sort=id&_order=desc`
      )
      .pipe(
        map((res) => {
          const listArray = [];
          for (const key in res) {
            if (res.hasOwnProperty(key)) {
              listArray.push({ ...res[key] });
            }
          }
          return listArray;
        })
      );
  }
}
