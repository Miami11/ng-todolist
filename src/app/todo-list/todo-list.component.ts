import { Component,OnInit } from '@angular/core';
import { TodoListService } from './todo-list.service';
import { HttpClient } from '@angular/common/http';
import { TodoList } from './todo-list.model';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  constructor(private todoListService: TodoListService, private http: HttpClient) { }
  loadedList:TodoList[] = [];
  isLoading = false;
  isCompleteExist = false;
  showStatus:number = -1;

  fetchLists() {
    this.isLoading = true;
    this.todoListService.fetchList().subscribe((todoList) => {
      this.isLoading = false;
      this.loadedList = todoList;
      this.showStatus = -1;
    })
  }
  showList(){
    if (this.showStatus == -1) {
      return this.loadedList;
    }else {
      return this.loadedList.filter((todo) => {
        return todo.status == this.showStatus
      })
    }
  }
  findCompleted() {
    return this.loadedList.filter(todo => todo.status === 1).length > 0;
  }
  countActive(){
    return this.loadedList.filter(todo =>{
      return todo.status == 0
    }).length;
  }
  clearComplete(){
    this.loadedList.forEach((item,index)=>{
      if(item.status === 1) {
        this.loadedList.splice(index,1);
        this.todoListService.delete(item.id).subscribe(()=>{console.log('deltet')})
      }
    })
  }
  deleteId($event: any){
    const idx = this.loadedList.findIndex(item => {
      return item.id == $event
    })

    this.loadedList.splice(idx,1);
  }
  toggleAll(Input: HTMLInputElement) {
    console.log(Input,"toggleAll")
  }

  addTodo(inputRef:KeyboardEvent):void{
    const todoItem = inputRef.target as HTMLInputElement;
    if(!todoItem) {
      return;
    }
    if(inputRef.key === 'Enter') {
      const todo = todoItem.value.trim();
      this.todoListService.add(todo,0);
      todoItem.value = '';
      this.fetchLists();
    }
  }

  ngOnInit() {
    this.fetchLists();
  }
}
