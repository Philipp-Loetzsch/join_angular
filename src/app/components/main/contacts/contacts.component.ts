import { Component, OnInit } from '@angular/core';
import { Contact, UserDatasService } from '../../../services/user-datas.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent implements OnInit {
  contactsList!:Contact[]
  contactFirstLetters: string[] = [];
  chosenContact!: Contact
  lastLetter!:string
  constructor(private userDataService: UserDatasService){
  }
  async ngOnInit(): Promise<void> {
   this.contactsList = await this.userDataService.getUserContacts()
   console.log(this.contactsList);
   this.prepareContactFirstLetters();
   console.log(this.contactFirstLetters);
   
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

  prepareContactFirstLetters() {
    this.contactFirstLetters = this.contactsList.map((contact) => {
      const firstLetter = contact.name.charAt(0);
      if (firstLetter === this.lastLetter) {
        return '';
      } else {
        this.lastLetter = firstLetter;
        return firstLetter;
      }
    });
  }

  showDetailContact(i:number){
    this.chosenContact = this.contactsList[i]
    console.log(this.chosenContact);
    
  }

}
