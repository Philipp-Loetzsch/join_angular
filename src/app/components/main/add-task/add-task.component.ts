import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormsModule,
} from '@angular/forms';
import { UserDatasService } from '../../../services/user-datas.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { Contact } from '../../../interfaces/interfaces';
import { PriorityComponent } from '../add-task-templates/priority/priority.component';
import { TitleDescriptionComponent } from '../add-task-templates/title-description/title-description.component';
import { getAuth } from '@angular/fire/auth';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    PriorityComponent,
  ],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  @Input() board!: boolean;
  @Input() status: string = 'todo';
  @Output() hideAddTask = new EventEmitter<void>();

  addTaskForm: FormGroup;
  showContactList: boolean = false;
  contacts: Contact[] = [];
  filteredContacts!: Contact[];
  chosen: boolean[] = [];
  showCategorySelector: boolean = false;
  haveCategory: boolean = false;
  textCategory: string = 'Select contacts to assign';
  subtaskInputText: string = "";
  prepareSubtask:number | null= null

  constructor(
    private fb: FormBuilder,
    private userDataService: UserDatasService,
    private authService: AuthService
  ) {
    this.addTaskForm = this.fb.group({
      // text: this.fb.group({
      title: ['', Validators.required],
      description: [''],
      //  }),
      assignedTo: this.fb.array([], Validators.required),
      dueDate: ['', Validators.required],
      priority: ['Medium'],
      category: ['', Validators.required],
      subtasks: this.fb.array([]),
      status: [this.status],
    });
  }

  get assignedTo(): FormArray {
    return this.addTaskForm.get('assignedTo') as FormArray;
  }

  get subtasks(): FormArray {
    return this.addTaskForm.get('subtasks') as FormArray;
  }

  // get textFormGroup(): FormGroup {
  //   return this.addTaskForm.get('text') as FormGroup;
  // }

  async ngOnInit(): Promise<void> {
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

    if (this.contacts.length === 1) {
      const contactInterval = setInterval(() => {
        this.contacts = [
          currentUserDatas,
          ...this.userDataService.contactsList,
        ];
        if (this.contacts.length > 1) {
          this.filteredContacts = this.contacts;
          clearInterval(contactInterval);
        }
      }, 1000);
    }
  }

  hideTask(): void {
    this.hideAddTask.emit();
  }

  onSubmit(): void {   
    if (this.addTaskForm.valid && this.haveCategory) {
      this.addTaskForm.patchValue({ status: this.status });
      const formValue = this.addTaskForm.value;
      formValue.dueDate = new Date(formValue.dueDate).getTime();
      this.userDataService.createTask(this.addTaskForm);
    } else {
      this.addTaskForm.markAllAsTouched();
    }
  }

  clearForm(): void {
    this.addTaskForm.reset({ priority: 'Medium' });
    this.assignedTo.clear();
    this.subtasks.clear();
  }

  isFieldInvalid(field: string): boolean {
    const control = this.addTaskForm.get(field);
    return (control?.touched && control?.invalid) || false;
  }

  toggleContactList() {
    this.showContactList = !this.showContactList;
  }

  closeContactList() {
    this.showContactList = false;
  }

  chooseContact(
    name: string,
    color: string,
    id: string,
    index: number,
    shortcut: string
  ): void {
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

  filterContacts(value: string) {
    const lowerCaseQuery = value.toLowerCase();
    this.filteredContacts = this.contacts.filter((contact) =>
      contact.name.toLowerCase().includes(lowerCaseQuery)
    );
  }

  toggleCategorySelector() {
    this.showCategorySelector = !this.showCategorySelector;
  }

  chooseCategory(chosenCategory: string) {
    this.addTaskForm.patchValue({ category: chosenCategory });
    this.textCategory = chosenCategory;
    this.showCategorySelector = false;
    this.haveCategory = true;
  }



  addSubtask(event: Event, content: HTMLInputElement): void {
    event.preventDefault();
    const title = content.value.trim();
    if (title === '') return content.focus();
    const complete = false;
    this.subtasks.push(this.fb.control({ title, complete }));
    content.value = '';
    content.focus();
    this.subtaskInputText= ""
    console.log(this.subtasks.value);

  }

  showEditMode(content:HTMLInputElement){
    this.subtaskInputText = content.value.trim();    
  }

  clearInput(content: HTMLInputElement){
    this.subtaskInputText = ""
    content.value = ""
  }

  editSubtask(i: number) {
    this.prepareSubtask = i
    
  }
  changeSubtask(event: Event, index: number, input: HTMLInputElement): void {
    event.preventDefault();
    const title = input.value.trim();
    if (title === '') return input.focus();
    const subtask = this.subtasks.at(index).value; 
    this.subtasks.at(index).setValue({ ...subtask, title });
    this.prepareSubtask = null;
  }
  
  
  cancelEdit() {
    this.prepareSubtask = null;
  }
    

  deleteSubtask(i: number) {
    this.subtasks.removeAt(i);
    if(this.prepareSubtask != null){
      this.prepareSubtask = null
    }
  }
}
