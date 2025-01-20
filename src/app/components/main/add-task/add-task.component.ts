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
  showCategorySelector:boolean=false
  haveCategory:boolean = false
  textCategory:string='Select contacts to assign'
  
  

  constructor(private fb: FormBuilder, private userDataService: UserDatasService) {
    this.addTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      assigned: this.fb.array([], Validators.required), 
      dueDate: ['', Validators.required],
      priority: ['Medium'],
      category: ['', Validators.required],
      subtasks: this.fb.array([]), 
      status: ['todo']
    });
  }
  


  get assigned(): FormArray {
    return this.addTaskForm.get('assigned') as FormArray;
  }

  get subtasks(): FormArray {
    return this.addTaskForm.get('subtasks') as FormArray;
  }

  async ngOnInit(): Promise<void> {
    this.contacts = this.userDataService.contactsList
    this.filteredContacts = this.contacts
    if(this.contacts.length === 0){
      const contactInterval = setInterval(() => {
        this.contacts = this.userDataService.contactsList
        this.filteredContacts = this.contacts
        console.log(this.contacts);
        if(this.contacts.length >= 0) {
          clearInterval(contactInterval)
          console.log(true);
          
        }
      }, 1000);
    }
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
    if (this.addTaskForm.valid && this.haveCategory) {
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

  isFieldInvalid(field:string): boolean | undefined{
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
      console.log(this.addTaskForm.value);
      
    }
    this.chosen[index] = !this.chosen[index];
  }
  

  filterContacts(value:string){
    console.log(this.filteredContacts);
    console.log(value);
    
    const lowerCaseQuery = value.toLowerCase();
    this.filteredContacts = this.contacts.filter(contact =>
    contact.name.toLowerCase().includes(lowerCaseQuery));
  }

  toggleCategorySelector(){
    this.showCategorySelector = !this.showCategorySelector
  }
  chooseCategory(chosenCategory: string) {
    const formValue = this.addTaskForm.value;
    this.addTaskForm.patchValue({ category: chosenCategory });
    this.textCategory = chosenCategory;
    this.showCategorySelector = false;
    this.haveCategory = true;
  }
  

   addSubtask(content: HTMLInputElement):void{
    const subtaskValue = content.value.trim();
    this.subtasks.push(this.fb.control(subtaskValue))
    content.value = ''
    content.focus()
  }
   
   editSubtask(i:number){

   }
   deleteSubtask(i:number){
    this.subtasks.removeAt(i)
   }
}


