import { inject, Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDocs,
  setDoc,
} from '@angular/fire/firestore';
import { FormGroup } from '@angular/forms';
import contactsData from './../../assets/dummyDatas/contacts.json'; // Lade Dummy-Daten aus JSON
import tasksData from './../../assets/dummyDatas/tasks.json'; // Lade Dummy-Daten aus JSON

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private firestore = inject(Firestore);
  constructor(private auth: Auth) {}

  async createNewUser(signUpForm: FormGroup): Promise<boolean> {
    try {
      const { email, password, name } = signUpForm.value;
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const userId = userCredential.user.uid;
      const userRef = doc(this.firestore, 'userDatas', userId);
      await setDoc(userRef, { userName: name });
      await this.saveContacts(userRef);
      const contacts = await this.loadContacts(userRef);
      await this.saveTasks(userRef, contacts);
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      return false;
    }
  }

  async saveContacts(userRef: any) {
    const contactsRef = collection(userRef, 'contacts');
    for (const contact of contactsData) {
      await addDoc(contactsRef, contact);
    }
  }

  async loadContacts(userRef: any) {
    const contactsRef = collection(userRef, 'contacts');
    const snapshot = await getDocs(contactsRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async saveTasks(userRef: any, contacts: any[]) {
    const tasksRef = collection(userRef, 'tasks');
    for (const task of tasksData) {
      const assignedTo = this.getRandomContacts(contacts);
      await addDoc(tasksRef, { ...task, assignedTo });
    }
  }

  getRandomContacts(contacts: any[], maxContacts: number = 4) {
    const shuffled = [...contacts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * maxContacts) + 1);
  }

  async getUserId(loginForm: FormGroup): Promise<string> {
    const { email, password } = loginForm.value;
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const uid = userCredential.user?.uid;
      return uid;
    } catch (error) {
      console.error('Anmeldefehler:', error);
      return 'error';
    }
  }
}
