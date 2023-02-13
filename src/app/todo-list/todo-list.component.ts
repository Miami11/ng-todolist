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
  showStatus:number = -1;
  page = 1;
  totalTodoCount:number = 0;
  pageSize:number = 1;
  pageItemLimit:number = 5;

  fetchInitData() {
    this.todoListService.fetchAll().subscribe((todoList) => {
      this.totalTodoCount = todoList.length;
      this.pageSize = Math.ceil(this.totalTodoCount/this.pageItemLimit)
    })
  }
  goPage(page:number) {
    this.page = page;
    this.fetchLists()
  }
  fetchLists() {
    this.isLoading = true;
    this.todoListService.fetchList(this.page).subscribe((todoList) => {
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
        this.todoListService.delete(item.id).subscribe(()=>{
          item.status = 2;
        })  
      }
      this.loadedList = this.loadedList.filter((item,index)=>{
        return item.status != 2
      }) 
    })
  }
  deleteId($event: any){
    let idx = this.loadedList.findIndex(item => {
      return item.id == $event
    })
    this.loadedList.splice(idx,1);
  }
  updateTodoItem($event: any){
    const { id, content } = $event;
    let idx = this.loadedList.findIndex(item => {
      return item.id == id
    })
    this.loadedList[idx].content = content;
  }
  toggleAll() {
    let status = this.countActive() > 0 ? 1 : 0;
    this.loadedList.forEach((item)=>{
      this.todoListService.changeStatus(item.id,status).subscribe(()=>{
        item.status = status;
      })
    })
  }
  goPrevious() {
    if(this.page > 1){
      this.page--;
      this.fetchLists();
    }else {
      return ;
    }
  }
  goNext() {
    if (this.page > this.pageSize){
      return;
    }else {
      this.page++
      this.fetchLists();
    }
  }

  addTodo(inputRef:KeyboardEvent):void{
    const todoItem = inputRef.target as HTMLInputElement;
    if(!todoItem) {
      return;
    }
    if(inputRef.key === 'Enter') {
      const todo = todoItem.value.trim();
      if(todo.length!==0) {
        this.todoListService.add(todo,0);
        todoItem.value = '';
        this.page = 1;
        this.fetchLists();
      }
    }
  }

  ngOnInit() {
    this.fetchLists();
    this.fetchInitData();
  }
}
