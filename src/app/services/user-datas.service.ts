import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
} from '@angular/fire/firestore';
import { FormGroup } from '@angular/forms';
import { Assigned, Contact, Subtask, Tasks } from '../interfaces/interfaces';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserDatasService {
  private firestore = inject(Firestore);
  contactsList: Contact[] = [];
  tasks: Tasks[] = [];
  userName: string = '?';
  currentUserID: string = '';
  constructor(private route: ActivatedRoute, private router: Router) {
    this.init();
  }

  init(): void {
    this.getCurrentUserId();
  }

  getCurrentUserId() {
    console.log(this.currentUserID);
    this.route.queryParams.subscribe((params) => {
      this.currentUserID = params['UID'];
    });
    if (this.currentUserID != '' && this.currentUserID != undefined) {
      console.log(this.currentUserID);
      this.getUserContacts();
      this.getUsertasks();
    } else {
      this.router.navigate(['/']);
      console.log(this.tasks);
      return;
    }
  }

  async getUserName() {
    const docRef = doc(this.firestore, this.RefDatabase(''));
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      return data['userName'];
    } else {
      this.router.navigate(['/']);
      return '';
    }
  }

  async getUsertasks() {
    try {
      const querySnapshot = await getDocs(
        collection(this.firestore, this.RefDatabase('tasks'))
      );
      const tasks = querySnapshot.docs.map((doc) => ({
        assignedTo: doc.data()['assigned'] as Assigned[],
        subtasks: doc.data()['subtasks'] as Subtask[],
        description: doc.data()['description'] as string,
        dueDate: doc.data()['dueDate'] as number,
        prio: doc.data()['priority'] as string,
        status: doc.data()['status'] as string,
        title: doc.data()['title'] as string,
        category: doc.data()['category'] as string,
        id: doc.id,
      }));
      this.tasks = tasks;
    } catch (error) {
      console.error('Fehler beim Abrufen der Kontakte:', error);
      throw error;
    }
  }

  async createTask(tasks: FormGroup): Promise<void> {
    try {
      const taskData = tasks.value;
      const docRef = await addDoc(
        collection(this.firestore, this.RefDatabase('tasks')),
        taskData
      );
      console.log('Document written with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  }

  async deleteTask(taskId: string):Promise<boolean>{
    try {
      await deleteDoc(
        doc(this.firestore, `${this.RefDatabase('tasks')}/${taskId}`)
      );
      this.getUsertasks()
      return true;
    } catch (err) {
      console.log('delete contact failed', err);
      return false;
    }
  }

  async createContact(contactData: FormGroup): Promise<string> {
    try {
      const contact = contactData.value;
      const color = this.createColor();
      const shortcut = this.getShortcut(contact.name);
      const docRef = await addDoc(
        collection(this.firestore, this.RefDatabase('contacts')),
        {
          email: contact.email,
          phone: contact.phone,
          name: contact.name,
          color: color,
          shortcut: shortcut,
        }
      );
      return docRef.id;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to create contact');
    }
  }

  async getUserContacts(): Promise<void> {
    try {
      const querySnapshot = await getDocs(
        collection(this.firestore, this.RefDatabase('contacts'))
      );
      const contacts = querySnapshot.docs.map((doc) => ({
        name: doc.data()['name'] as string,
        email: doc.data()['email'] as string,
        phone: doc.data()['phone'] as string,
        color: doc.data()['color'] as string,
        shortcut: doc.data()['shortcut'] as string,
        id: doc.id as string,
      }));
      contacts.sort((a, b) => a.name.localeCompare(b.name));
      this.contactsList = contacts;
    } catch (error) {
      console.error('Fehler beim Abrufen der Kontakte:', error);
      throw error;
    }
  }

  async deleteContact(id: string): Promise<boolean> {
    try {
      await deleteDoc(
        doc(this.firestore, `${this.RefDatabase('contacts')}/${id}`)
      );
      return true;
    } catch (err) {
      console.log('delete contact failed', err);
      return false;
    }
  }

  RefDatabase(subtask: string) {
    return `userDatas/${this.currentUserID}/${subtask}`;
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

  createColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
