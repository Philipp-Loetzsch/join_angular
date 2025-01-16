import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Contact, UserDatasService } from '../../../services/user-datas.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

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
  constructor(private fb: FormBuilder, private userDataService: UserDatasService) {
    this.addTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      assigned: this.fb.array([], Validators.required), 
      dueDate: ['', Validators.required],
      priority: ['Medium'],
      category: ['', Validators.required],
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
}


