import { Component, Input, EventEmitter,Output } from '@angular/core';
import { TodoService } from './todo.service';
import { HttpClient } from '@angular/common/http';
import { Todo } from './todo.model';
@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
  providers: [TodoService]
})
export class TodoComponent {
  @Input() todo: any;
  @Output() todoId = new EventEmitter<any>();
  constructor(private http: HttpClient, private todoservice: TodoService ) { }
  
  deleteTodo(id: HTMLInputElement) {
    this.todoservice.delete(id.id)
    .subscribe((res: any)=>{
      console.log(res,'deleteTodo response');
      this.todoId.emit(id.id)
    }) 
  }
  toggleStatus(input: HTMLInputElement) {
    this.todoservice.toggleStatus(input)
    .subscribe((res: any)=>{
        console.log(res,'toggleStatus response');
    });
  }

}
