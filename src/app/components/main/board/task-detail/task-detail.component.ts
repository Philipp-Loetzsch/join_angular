import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserDatasService } from '../../../../services/user-datas.service';
import { Contact, Tasks } from '../../../../interfaces/interfaces';
import { PriorityComponent } from '../../add-task-templates/priority/priority.component';
import { EditTaskComponent } from './edit-task/edit-task.component';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    EditTaskComponent
  ],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss',
})
export class TaskDetailComponent{
  @Input() chosenTask!:Tasks
  @Output() hideDetails = new EventEmitter<void>();
  @Output() reloadBoard = new EventEmitter<void>();
  detailsContent: boolean = true;
  editDetails: boolean = false;
  chosenPrio: string = 'Medium';
  contacts: Contact[] = [];
  status: string = '';
  constructor(
    private userDataService: UserDatasService
  ) {}
  
  closeDetails(): void {
    this.hideDetails.emit();
  }

  showEditMode() {
    this.detailsContent = false;
    this.editDetails = true;
  }

  async deleteTask(){
    const deleted = await this.userDataService.deleteTask(this.chosenTask.id)
    if(deleted === true){
      this.closeDetails()
      this.reloadBoard.emit();
    }
    else if (deleted === false){
      console.error('not deleted');
      
    }
  }

  convertDate(timestamp:number):string{
    const formattedDate = new Date(timestamp).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
    return formattedDate
  }

  toggleCompleteSubtask(i:number){
    this.chosenTask.subtasks[i].complete = !this.chosenTask.subtasks[i].complete
    this.userDataService.updateSubtask(this.chosenTask, i)
  }
}
