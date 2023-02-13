import { Component, Input, EventEmitter,Output, ElementRef, ViewChild } from '@angular/core';
import { TodoService } from './todo.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
  providers: [TodoService]
})
export class TodoComponent {
  @Input() todo: any;
  @Output() todoId = new EventEmitter<any>();
  @Output() updateTodo = new EventEmitter<any>();
  @ViewChild("editedtodo") editedtodo: ElementRef<Input>
  editing = false;
  
  constructor(private http: HttpClient, private todoservice: TodoService ) { }
  
  deleteTodo(id: HTMLInputElement) {
    this.todoservice.delete(id.id)
    .subscribe((res: any)=>{
      console.log(res,'deleteTodo response');
      this.todoId.emit(id.id)
    }) 
  }
  update(editedValue: any){
    this.todo.conetnt = editedValue;
    this.todoservice.update(this.todo.id,this.todo.conetnt).subscribe((res: any)=>{
      this.editing = false;
      this.updateTodo.emit({id: this.todo.id, content: this.todo.conetnt});
    })
  }
  cancelEditing() {
    this.editing = false;
  }
  edit(id: any) {
    (this.editedtodo.nativeElement as HTMLElement)?.focus();
    this.editing = true;
  }
  toggleStatus(input: HTMLInputElement) {
    this.todoservice.toggleStatus(input)
    .subscribe((res: any)=>{
        // console.log(res,'toggleStatus response');
    });
  }
}
