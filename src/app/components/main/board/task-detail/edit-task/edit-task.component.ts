import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PriorityComponent } from '../../../add-task-templates/priority/priority.component';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contact, Tasks } from '../../../../../interfaces/interfaces';
import { UserDatasService } from '../../../../../services/user-datas.service';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    PriorityComponent,
  ],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.scss',
})
export class EditTaskComponent implements OnInit {
  @Input() chosenTask!: Tasks;
  @Output() hideDetails = new EventEmitter<void>();
  editTaskForm!: FormGroup;
  filteredContacts!: Contact[];
  chosen: boolean[] = [];
  showContactList: boolean = false;
  contacts: Contact[] = [];
  chosenPrio: string = 'Medium';

  constructor(
    private fb: FormBuilder,
    private userDataService: UserDatasService
  ) {}

  ngOnInit(): void {    
    this.contacts = this.userDataService.contactsList
    this.filteredContacts = this.contacts
    this.editTaskForm = this.fb.group({
      title: [this.chosenTask.title, { validators: [Validators.required] }],
      description: [this.chosenTask.description],
      assigned: this.fb.array(
        this.chosenTask.assignedTo.map(user => this.fb.control(user)), 
        { validators: [Validators.required] }
      ),
      dueDate: [this.convertDate(this.chosenTask.dueDate), { validators: [Validators.required] }],
      priority: [this.chosenTask.prio],
      subtasks: this.fb.array(
        this.chosenTask.subtasks.map(subtask => this.fb.control(subtask))
      )
    });    
  }

  get assigned(): FormArray {
    return this.editTaskForm.get('assigned') as FormArray;
  }

  get subtasks(): FormArray{
    return this.editTaskForm.get('subtasks') as FormArray;
  }

  closeDetails(): void {
    this.hideDetails.emit();
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

  closeCotactList(){
    this.showContactList = false
  }

  filterContacts(value: string) {
    console.log(this.filteredContacts);
    console.log(value);

    const lowerCaseQuery = value.toLowerCase();
    this.filteredContacts = this.contacts.filter((contact) =>
      contact.name.toLowerCase().includes(lowerCaseQuery)
    );
  }

  convertDate(timestamp: number): string {
    const formattedDate = new Date(timestamp).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
    return formattedDate;
  }
}
