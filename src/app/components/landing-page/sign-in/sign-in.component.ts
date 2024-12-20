import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  acceptTerms: boolean = false;

  signupForm = new FormGroup(
    {
      name: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      conf_password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      check: new FormControl(false, Validators.requiredTrue),
    });

  onSubmit() {}
  toggleCheck() {
    const currentValue = this.signupForm.get('check')?.value;
    this.signupForm.get('check')?.setValue(!currentValue); // Toggle true/false
  }
}
