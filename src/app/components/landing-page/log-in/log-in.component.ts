import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss',
})
export class LogInComponent {
  constructor(private router:Router){}
   loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  onSubmit() {
    this.router.navigate(['/main/summary'])
    if (this.loginForm.invalid) {
      // Markiere alle Felder als "touched", um die Fehlermeldungen anzuzeigen
      this.loginForm.markAllAsTouched();
      return; // Verhindere das Absenden des Formulars
    }
    console.log('hat geklappt');

    console.log(this.loginForm.value.email);
  }

}
