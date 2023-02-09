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

  fetchLists() {
    this.isLoading = true;
    this.todoListService.fetchList().subscribe((todoList) => {
      this.isLoading = false;
      this.loadedList = todoList;
    })
  }

  addTodo(inputRef:KeyboardEvent):void{
    console.log(inputRef,'html input data ');
    const todoItem = inputRef.target as HTMLInputElement;
    if(!todoItem) {
      return;
    }
    if(inputRef.key === 'Enter') {
      const todo = todoItem.value.trim();
      this.todoListService.add(todo,0);
    }
  }

  ngOnInit() {
    this.fetchLists();
  }
}
