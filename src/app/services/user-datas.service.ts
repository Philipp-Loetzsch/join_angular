import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
} from '@angular/fire/firestore';

export interface Contact{
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
    this.getUserName()
  }

  async getUserContacts() {
    try {
      const querySnapshot = await getDocs(collection(this.firestore, 'userDatas', 'a6PM3hfF9lUQsu9n6a3HvYLIAW73', 'contacts'));
      const contacts = querySnapshot.docs.map((doc) => ({
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
  
  async getUserName(){
    const docRef = doc(this.firestore, 'userDatas', 'a6PM3hfF9lUQsu9n6a3HvYLIAW73')
    const docSnapshot = await getDoc(docRef)
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      return data['userName'];
    } else {
      console.error('Document does not exist!');
      return '';
    }
       
  }

}
