import { Component, OnInit } from '@angular/core';
import {
  Contact,
  UserDatasService,
} from '../../../services/user-datas.service';
import { CommonModule } from '@angular/common';
import { MainComponent } from '../main.component';
import { interval } from 'rxjs';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent implements OnInit {
  contactsList: Contact[] = [];
  contactFirstLetters: string[] = [];
  chosenContact!: Contact;
  lastLetter!: string;
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
}
