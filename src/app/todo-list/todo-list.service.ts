import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { TodoList } from './todo-list.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {

  constructor(private http: HttpClient) {

  }
  add(content: string, status: number):void {
    const todo:TodoList = { content: content, status: status };
    this.http.post<{ content: string, status: number}>('http://localhost:8888/data',todo)
    .subscribe(res => {
        console.log(res,'post list success')
        
    })
  }
  delete(id: string) {
    this.http.delete(`http://localhost:8888/data/${id}`)
  }
  fetchList(){
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
