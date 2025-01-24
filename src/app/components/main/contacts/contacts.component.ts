import { Component, OnInit } from '@angular/core';
import { UserDatasService}from '../../../services/user-datas.service';
import { CommonModule } from '@angular/common';
import { Contact } from '../../../interfaces/interfaces';
import { EditContactComponent } from './edit-contact/edit-contact.component';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, EditContactComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent implements OnInit {
  contactsList: Contact[] = [];
  contactFirstLetters: string[] = [];
  chosenContact!: Contact;
  lastLetter!: string;
  showEdit:boolean=false;
  editMode:boolean=false;


  constructor(public userDatas: UserDatasService) {}
  ngOnInit(): void {
    if (this.userDatas.contactsList.length === 0) {
      const load = setInterval(() => {
        this.prepareContactFirstLetters();
        if (this.userDatas.contactsList.length > 0) {
          clearInterval(load);
        }
      }, 200);
    }
    this.prepareContactFirstLetters();
  }

  prepareContactFirstLetters() {
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
  }

  showEditField(option:boolean){
    this.showEdit=true
    option ? this.editMode = true : this.editMode = false
    
  }


}
