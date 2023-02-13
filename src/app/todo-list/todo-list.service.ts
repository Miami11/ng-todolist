import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { TodoList } from './todo-list.model';
import { map } from 'rxjs/operators';
import { TodoService } from './todo/todo.service';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  constructor(private http: HttpClient, private todoService: TodoService) {}
  add(content: string, status: number):void {
    const todo:TodoList = { content: content, status: status };
    this.http.post<{ content: string, status: number}>('http://localhost:8888/data',todo)
    .subscribe(res => {
        console.log(res,'post list success')
    })
  }
  changeStatus(id: any,statusVal: number) {
    return this.http.patch(`http://localhost:8888/data/${id}`, { status: statusVal });
  }
  delete(id: any){
    return this.todoService.delete(id)
  }
  fetchList(page:number){
    return this.http.get<{[key: string]: TodoList}>(`http://localhost:8888/data?_page=${page}&_limit=5`)
      .pipe(map((res)=>{
        const listArray = []
        for (const key in res) {
          if(res.hasOwnProperty(key)){ 
            listArray.push({...res[key]})
          }
        }
        return listArray;
      }))
  }

  fetchAll(){
    return this.http.get<{[key: string]: TodoList}>('http://localhost:8888/data')
    .pipe(map((res)=>{
      const listArray = []
      for (const key in res) {
        if(res.hasOwnProperty(key)){ 
          listArray.push({...res[key]})
        }
      }
      return listArray;
    }))
  }
}
