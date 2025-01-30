import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserDatasService } from '../../../../services/user-datas.service';
import { Contact } from '../../../../interfaces/interfaces';
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
export class TaskDetailComponent {
  @Output() hideDetails = new EventEmitter<void>();
  detailsContent: boolean = true;
  editDetails: boolean = false;
  chosenPrio: string = 'Medium';
  editTaskForm: FormGroup;
  showContactList: boolean = false;
  contacts: Contact[] = [];
  filteredContacts!: Contact[];
  chosen: boolean[] = [];
  status: string = '';
  constructor(
    private fb: FormBuilder,
    private userDataService: UserDatasService
  ) {
    this.editTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      assigned: this.fb.array([], Validators.required),
      dueDate: ['', Validators.required],
      priority: ['Medium'],
      category: ['', Validators.required],
      subtasks: this.fb.array([]),
      status: [this.status],
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
}
