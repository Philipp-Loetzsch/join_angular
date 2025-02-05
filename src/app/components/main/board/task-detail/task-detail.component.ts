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

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    PriorityComponent,
  ],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss',
})
export class TaskDetailComponent implements OnInit{
  @Input() chosenTask!:Tasks
  @Output() hideDetails = new EventEmitter<void>();
  @Output() reloadBoard = new EventEmitter<void>();
  detailsContent: boolean = true;
  editDetails: boolean = false;
  chosenPrio: string = 'Medium';
  editTaskForm!: FormGroup;
  showContactList: boolean = false;
  contacts: Contact[] = [];
  filteredContacts!: Contact[];
  chosen: boolean[] = [];
  status: string = '';
  constructor(
    private fb: FormBuilder,
    private userDataService: UserDatasService
  ) {
      
  }
  
  ngOnInit(): void {
    this.editTaskForm = this.fb.group({
      title: [this.chosenTask.title, Validators.required],
      description: [this.chosenTask.description],
      assigned: this.fb.array([this.chosenTask.assignedTo], Validators.required),
      dueDate: [this.convertDate(this.chosenTask.dueDate), Validators.required],
      priority: [this.chosenTask.prio],
      category: [this.chosenTask.category, Validators.required],
      subtasks: this.fb.array([]),
      status: [this.chosenTask.status],
    }); 
  }

  get assigned(): FormArray {
    return this.editTaskForm.get('assigned') as FormArray;
  }

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

  chooseContact(
    name: string,
    color: string,
    id: string,
    index: number,
    shortcut: string
  ) {
    const assignedArray = this.assigned;
    const existingIndex = assignedArray.controls.findIndex(
      (control) => control.value.id === id
    );
    if (existingIndex !== -1) {
      assignedArray.removeAt(existingIndex);
    } else {
      assignedArray.push(this.fb.control({ name, color, id, shortcut }));
    }
    this.chosen[index] = !this.chosen[index];
  }

  toggleContactList() {
    this.showContactList = !this.showContactList;
  }

  filterContacts(value: string) {
    console.log(this.filteredContacts);
    console.log(value);

    const lowerCaseQuery = value.toLowerCase();
    this.filteredContacts = this.contacts.filter((contact) =>
      contact.name.toLowerCase().includes(lowerCaseQuery)
    );
  }

  convertDate(timestamp:number):string{
    const formattedDate = new Date(timestamp).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
    return formattedDate
  }
}
