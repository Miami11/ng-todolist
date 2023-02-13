import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private list = [];
  constructor(private http: HttpClient) { }
  delete(id: any){
    console.log(id,'delete id: ');
    return this.http.delete(`http://localhost:8888/data/${id}`)
  }
  
  toggleStatus(val: any) {
    const statusVal = val.status? 0: 1;
    val.status = statusVal;
    return this.http.patch(`http://localhost:8888/data/${val.id}`, { status: statusVal })
  }
  update(id:any, val:any){
    return this.http.patch(`http://localhost:8888/data/${id}`, { content: val })
  }

}
