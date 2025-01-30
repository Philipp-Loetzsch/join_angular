import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { FormGroup } from '@angular/forms';
import { createUserWithEmailAndPassword } from 'firebase/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) {}
  

  createNewUser(signUpForm: FormGroup){
    const {email, password} = signUpForm.value
    createUserWithEmailAndPassword(this.auth, email, password).then((user) => {
      console.log(user.user);
      
    })

    
  }

  async getUserId(loginForm: FormGroup):Promise<string>{
    const {email, password} = loginForm.value
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user?.uid; 
      console.log('Anmeldung erfolgreich:', uid);
      return uid; 
    } catch (error) {
      console.error('Anmeldefehler:', error);
      return 'error';
    }
    
  }
}
