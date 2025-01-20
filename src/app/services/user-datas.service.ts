import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
} from '@angular/fire/firestore';
import { FormGroup } from '@angular/forms';
import { Assigned, Contact, Tasks } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserDatasService {
  private firestore = inject(Firestore);
  contactsList:Contact[]=[]
  tasks: Tasks[] = [];
  userName:string ='?'
  constructor() {
    this.getUserContacts()
    this.getUsertasks()
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
}
