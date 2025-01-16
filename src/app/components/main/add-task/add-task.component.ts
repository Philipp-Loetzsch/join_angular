import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDatasService } from '../../../services/user-datas.service';
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
export class AddTaskComponent {
  addTaskForm: FormGroup;
  chosenPrio: string = 'medium'
  constructor(private fb: FormBuilder, private userDataService:UserDatasService ) {
    this.addTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      assigned: ['', Validators.required],
      dueDate: ['', Validators.required],
      priority: ['Medium'],
      category: ['', Validators.required],
      subtasks: [''],
    });
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
  }

  isTitleInvalid(field:string): boolean | undefined{
    const control = this.addTaskForm.get(field);
    return control?.touched && control?.invalid;
  }
  
}


