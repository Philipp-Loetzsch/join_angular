import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
} from '@angular/fire/firestore';

export interface Contact{
  id:string,
  name:string,
  email:string,
  phone:string,
  color:string
}
@Injectable({
  providedIn: 'root',
})
export class UserDatasService {
  private firestore = inject(Firestore);
  constructor() {
  }

  async getUserContacts() {
    try {
      const querySnapshot = await getDocs(collection(this.firestore, 'userDatas', '6mVBch0Q7YyYR1AAEnkR', 'contacts'));
      const contacts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data()['name'],
        email: doc.data()['email'],
        phone: doc.data()['phone'],
        color: doc.data()['color']
      }));
      contacts.sort((a, b) => a.name.localeCompare(b.name));
      return contacts;
    } catch (error) {
      console.error('Fehler beim Abrufen der Kontakte:', error);
      throw error;
    }
  }
  

}
