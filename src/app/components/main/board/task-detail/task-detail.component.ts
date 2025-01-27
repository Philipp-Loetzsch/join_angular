import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss'
})
export class TaskDetailComponent {
  constructor(){}
  @Output() hideDetails = new EventEmitter<void>();
  
  closeDetails():void{
    this.hideDetails.emit()
  }
}
