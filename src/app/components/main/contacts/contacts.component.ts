import { Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { UserDatasService}from '../../../services/user-datas.service';
import { CommonModule } from '@angular/common';
import { Contact } from '../../../interfaces/interfaces';
import { EditContactComponent } from './edit-contact/edit-contact.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, EditContactComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent implements OnInit {
  @ViewChild('contactListContainer') contactListContainer!: ElementRef;
  contactFirstLetters: string[] = [];
  chosenContact!: Contact;
  lastLetter!: string;
  showEdit:boolean=false;
  editMode:boolean=false;
  hideAnimation:boolean=false
  chosen!:number

  constructor(public userDatas: UserDatasService) {}

  ngOnInit(){
   if (this.userDatas.contactsList.length === 0) {
      this.loadContacts();
    } else {
      this.prepareContactFirstLetters(); 
    }
  }
  
  
  loadContacts(){
    const load = setInterval(() => {
      if (this.userDatas.contactsList.length > 0) {
        clearInterval(load);
        this.prepareContactFirstLetters();
      }
    }, 200);
  }
  
  prepareContactFirstLetters() {
    this.contactFirstLetters = []
    this.contactFirstLetters = this.userDatas.contactsList.map((contact) => {
      const firstLetter = contact.name.charAt(0);
      if (firstLetter === this.lastLetter) {
        return '';
      } else {
        this.lastLetter = firstLetter;
        return firstLetter;
      }
    });
  }

  showDetailContact(i: number) {
    this.chosenContact = this.userDatas.contactsList[i];
    this.chosen = i
  }

  showEditField(option:boolean){
    this.showEdit=true
    option ? this.editMode = true : this.editMode = false
    
  }

  markNewContact(id:string){
   const index = this.userDatas.contactsList.findIndex(contact => contact.id === id)
   if (index !== -1){
    this.showDetailContact(index)
    const element = this.contactListContainer.nativeElement.querySelector(`#contact-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
   }else{
    this.markNewContact(id)
   }

  }

  closeEdit() {
    this.hideAnimation = true;
    setTimeout(() => {
      this.showEdit = false;
      this.hideAnimation = false;
    }, 800);
  }
}
