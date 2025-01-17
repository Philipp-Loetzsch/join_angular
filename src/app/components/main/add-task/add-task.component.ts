import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Contact, UserDatasService } from '../../../services/user-datas.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

type Chosen ={
  name:string;
  color:string;
  id:string;
}
@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  addTaskForm: FormGroup;
  chosenPrio: string = 'medium'
  showContactList:boolean = false
  contacts:Contact[]=[]
  filteredContacts!: Contact[]
  chosen:boolean[] = [];
  

  constructor(private fb: FormBuilder, private userDataService: UserDatasService) {
    this.addTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      assigned: this.fb.array([], Validators.required), 
      dueDate: ['', Validators.required],
      priority: ['Medium'],
      category: ['Select contacts to assign', Validators.required],
      subtasks: this.fb.array([]), 
    });
  }
  


  get assigned(): FormArray {
    return this.addTaskForm.get('assigned') as FormArray;
  }

  get subtasks(): FormArray {
    return this.addTaskForm.get('subtasks') as FormArray;
  }

  async ngOnInit(): Promise<void> {
    this.contacts = await this.userDataService.getUserContacts()
    this.filteredContacts = this.contacts
  }

  getShortcut(name: string): string {
    const parts = name.split(' ');
    if (parts.length === 0) {
      return ''; 
    }
    const firstPart = parts[0];   
    const lastPart = parts[parts.length - 1]; 
    const initials = firstPart.charAt(0) + lastPart.charAt(0);
    return initials.toUpperCase();
  }

  onSubmit(): void {
    if (this.addTaskForm.valid) {
      const formValue = this.addTaskForm.value;
      formValue.dueDate = new Date(formValue.dueDate).getTime();
     this.userDataService.createTask(this.addTaskForm)
    } else {
      this.addTaskForm.markAllAsTouched();
    }
  }

  clearForm(): void {
    this.addTaskForm.reset({ priority: 'Medium' });
    this.assigned.clear();
    this.subtasks.clear();
  }

  isTitleInvalid(field:string): boolean | undefined{
    const control = this.addTaskForm.get(field);
    return control?.touched && control?.invalid;
  }

  toggleContactList(){
    this.showContactList = !this.showContactList
  }

  chooseContact(name: string, color: string, id: string, index: number): void {
    const assignedArray = this.assigned;
    const existingIndex = assignedArray.controls.findIndex(control => control.value.id === id);
    if (existingIndex !== -1) {
      assignedArray.removeAt(existingIndex);
    } else {
      assignedArray.push(this.fb.control({ name, color, id }));
    }
    this.chosen[index] = !this.chosen[index];
  }
  

  filterContacts(value:string){
    const lowerCaseQuery = value.toLowerCase();
    this.filteredContacts = this.contacts.filter(contact =>
    contact.name.toLowerCase().includes(lowerCaseQuery));
  }
}


