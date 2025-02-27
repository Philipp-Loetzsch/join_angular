import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PriorityComponent } from '../../../add-task-templates/priority/priority.component';
import { FormArray, FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Contact, Tasks } from '../../../../../interfaces/interfaces';
import { UserDatasService } from '../../../../../services/user-datas.service';
import { GlobalPositionStrategy } from '@angular/cdk/overlay';

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
    FormsModule,
    ReactiveFormsModule
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
    this.setContactList()
  
    this.editTaskForm = this.fb.group({
      title: [this.chosenTask.title, { validators: [Validators.required] }],
      description: [this.chosenTask.description],
      assignedTo: this.fb.array(
        this.chosenTask.assignedTo.map(user => this.fb.control(user)), 
        { validators: [Validators.required] }
      ),
      dueDate: [this.chosenTask.dueDate ? new Date(this.chosenTask.dueDate) : '', { validators: [Validators.required] }],
      priority: [this.chosenTask.prio],
      subtasks: this.fb.array(this.chosenTask.subtasks.map(subtask => this.fb.control(subtask))),
      status:[this.chosenTask.status],
      position:[this.chosenTask.position],
      category:[this.chosenTask.category]
    });    
  }

  async setContactList(){
    // this.contacts = this.userDataService.contactsList
    // this.filteredContacts = this.contacts
    const currentUserName = await this.userDataService.getUserName();
    const currentUserDatas: Contact = {
      name: currentUserName + ' ' + '(Yourself)',
      email: 'none',
      phone: 'none',
      color: 'gold',
      id: this.userDataService.currentUserID,
      shortcut: this.userDataService.getShortcut(currentUserName),
    };    
    this.contacts = [currentUserDatas, ...this.userDataService.contactsList];  
    this.filteredContacts = this.contacts;
  }

  get assignedTo(): FormArray {
    return this.editTaskForm.get('assignedTo') as FormArray;
  }

  get subtasks(): FormArray{
    return this.editTaskForm.get('subtasks') as FormArray;
  }

  updateTask(){
    const formValue = this.editTaskForm.value;
    formValue.dueDate = new Date(formValue.dueDate).getTime();
    this.userDataService.updateSingleTask(formValue, this.chosenTask.id)
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
    const assignedArray = this.assignedTo;
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


  addSubtask(content: HTMLInputElement):void{
    const title = content.value.trim();
    if(title === '') return content.focus()
    const complete = false
    this.subtasks.push(this.fb.control({title, complete}))
    content.value = ''
    content.focus()
  }
   
   editSubtask(i:number){

   }

   deleteSubtask(i:number){
    this.subtasks.removeAt(i)
   }
}
