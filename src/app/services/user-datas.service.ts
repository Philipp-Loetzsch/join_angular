import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from '@angular/fire/firestore';
import { FormGroup } from '@angular/forms';
import { Assigned, Contact, Tasks } from '../interfaces/interfaces';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserDatasService {
  private firestore = inject(Firestore);
  contactsList:Contact[]=[]
  tasks: Tasks[] = [];
  userName:string ='?'
  currentUserID:string=''
  constructor(private route: Router) {
    this.getCurrentUserId()
    this.getUserContacts()
    this.getUsertasks()
    
  }

  getCurrentUserId(){

  }
  
  async getUserContacts() {
    try {
      const querySnapshot = await getDocs(
        collection( this.firestore, 'userDatas', 'a6PM3hfF9lUQsu9n6a3HvYLIAW73', 'contacts'
        )
      );
      const contacts = querySnapshot.docs.map((doc) => ({
        name: doc.data()['name'],
        email: doc.data()['email'],
        phone: doc.data()['phone'],
        color: doc.data()['color'],
        shortcut:doc.data()['shortcut'],
        id: doc.id
      
      }));
      contacts.sort((a, b) => a.name.localeCompare(b.name));    
     this.contactsList = contacts;     
    } catch (error) {
      console.error('Fehler beim Abrufen der Kontakte:', error);
      throw error;
    }
  }

  async getUserName() {
    const docRef = doc( this.firestore, 'userDatas', 'a6PM3hfF9lUQsu9n6a3HvYLIAW73'
    );
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      return data['userName'];
    } else {
      console.error('Document does not exist!');
      return '';
    }
  }

  async getUsertasks() {
    try {
      const querySnapshot = await getDocs(
        collection(
          this.firestore,
          'userDatas',
          'a6PM3hfF9lUQsu9n6a3HvYLIAW73',
          'tasks'
        )
      );
      const tasks = querySnapshot.docs.map((doc) => ({
        assignedTo: doc.data()['assigned'] as Assigned[],
        subtasks: doc.data()['subtasks'] as string[],
        description: doc.data()['description'] as string,
        dueDate: doc.data()['dueDate'] as number,
        prio: doc.data()['priority'] as string,
        status: doc.data()['status'] as string,
        title: doc.data()['title'] as string,
        category:doc.data()['category'] as string,
        id: doc.id,
      }));
      this.tasks = tasks;
      console.log(this.tasks[0].assignedTo); 
      
    } catch (error) {
      console.error('Fehler beim Abrufen der Kontakte:', error);
      throw error;
    }
  }

  async createTask(tasks: FormGroup): Promise<void> {
    try {
      const taskData = tasks.value;
      const docRef = await addDoc(
        collection(this.firestore, 'userDatas/a6PM3hfF9lUQsu9n6a3HvYLIAW73/tasks'),
        taskData 
      );  
      console.log('Document written with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  }

  getShortcut(name: string): string {
    const parts = name.split(' ');
    if (parts.length === 0) {
      return ''; 
    }
    const firstPart = parts[0];   
    const lastPart = parts[parts.length - 1]; 
    const initials = firstPart.charAt(0) + lastPart.charAt(0);
    return initials.toUpperCase();
  }

  async createContact(contactData:FormGroup){
    try{   
      const contact = contactData.value
      const color = this.createColor()
      const shortcut = this.getShortcut(contact.name)
      console.log(shortcut);
      console.log(contact);
      
      
      console.log(color);
      const docRef = await addDoc(
        collection(this.firestore, 'userDatas/a6PM3hfF9lUQsu9n6a3HvYLIAW73/contacts'),{
        email:contact.email,
        phone: contact.phone,
        name: contact.name,
        color: color,
        shortcut: shortcut
      });
      console.log('contact created with ID: ' + docRef.id);
      
    } catch(err){
      console.error(err);
      
    }
  }

  createColor(){
    const letters = '0123456789ABCDEF';
    let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
  }
}
