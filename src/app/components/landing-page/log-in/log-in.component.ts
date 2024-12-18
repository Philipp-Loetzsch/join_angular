import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {ReactiveFormsModule, FormGroup, FormControl} from '@angular/forms';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {
  loginForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
  });

  onSubmit(){
    
  }
}
