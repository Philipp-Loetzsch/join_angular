import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  acceptTerms: boolean = false;
  signupForm: FormGroup;
  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;
  loadDatas: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      conf_password: ['', [Validators.required, Validators.minLength(6)]],
      check: [false, Validators.requiredTrue],
    });
  }

  async onSubmit() {
    if (this.signupForm.valid) {
      this.loadDatas = true;
      const success = await this.authService.createNewUser(this.signupForm);
      if (success) {
        this.loadDatas = false;
        this.showSuccessMessage = true;
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      } else {
        this.loadDatas = false;
        this.showErrorMessage = true;
      }
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
  toggleCheck() {
    const currentValue = this.signupForm.get('check')?.value;
    this.signupForm.get('check')?.setValue(!currentValue); // Toggle true/false
  }
}
