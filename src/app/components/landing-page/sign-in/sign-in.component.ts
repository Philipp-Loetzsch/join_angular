import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  acceptTerms: boolean = false;
  signupForm:FormGroup

  constructor(private fb : FormBuilder, private authService: AuthService){
    this.signupForm = this.fb.group(
      {
        name:  ['', Validators.required],
        email: ['', [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]],
        password: ['', [
          Validators.required,
          Validators.minLength(6),
        ]],
        conf_password:['', [
          Validators.required,
          Validators.minLength(6),
        ]],
        check: [false, Validators.requiredTrue],
      });
  }
  

  onSubmit() {
    if(this.signupForm.valid){
      this.authService.createNewUser(this.signupForm)
    }
    else{
    this.signupForm.markAllAsTouched()
  }
  }
  toggleCheck() {
    const currentValue = this.signupForm.get('check')?.value;
    this.signupForm.get('check')?.setValue(!currentValue); // Toggle true/false
  }
}
