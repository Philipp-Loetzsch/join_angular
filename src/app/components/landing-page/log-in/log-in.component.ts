import { Component, HostListener } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UserDatasService } from '../../../services/user-datas.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss',
})
export class LogInComponent {
  constructor(private router: Router, private authService: AuthService, private userDatasService:UserDatasService) {}
  innerWidth:number = window.innerWidth
  logInFailed:boolean=false
  rememberLogIn:boolean = true

  loginForm = new FormGroup({
    email: new FormControl('jointester@havefun.com', [
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
    ]),
    password: new FormControl('123456', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  async onSubmit() {
    if (this.loginForm.valid) {
      const userID = await this.authService.getUserId(this.loginForm);
      if (userID !== 'error') {
        this.router.navigate(['/main/summary'], { queryParams: { UID: userID }})
        .then(()=> {this.userDatasService.init()});

      } else{
        this.logInFailed = true
      }
    }
    this.loginForm.markAllAsTouched();
  }

  toggleRemember(){
    this.rememberLogIn = !this.rememberLogIn
  }


  @HostListener('window:resize', ['$event'])
  onResize() {
  this.innerWidth = window.innerWidth;
  }
}
