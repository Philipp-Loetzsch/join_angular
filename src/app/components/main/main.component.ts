import { Component, OnInit} from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { Contact, UserDatasService } from '../../services/user-datas.service';

interface Links {
  name: string;
  img: string;
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterModule, MatSidenavModule, CommonModule, MatButtonModule, MatMenuModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  contactsList:Contact[]=[]

  constructor(private router: Router, public userDataService: UserDatasService) {
  }
  nameLinks: Array<Links> = [
    { name: 'Summary', img: 'summary' },
    { name: 'Add Task', img: 'add_task' },
    { name: 'Board', img: 'board' },
    { name: 'Contacts', img: 'contacts' },
  ];
  activeUrl: string = '';
  showMenu: boolean = false;
  initials:string = '?'
 async ngOnInit(): Promise<void> {
    this.activeUrl = this.router.url;
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.activeUrl = event.urlAfterRedirects;
        console.log(this.activeUrl);
      });
      this.contactsList = await this.userDataService.getUserContacts()
      console.log(this.contactsList);
      
  }

  isActive(linkImg: string): boolean {
    return this.activeUrl.includes(`/main/${linkImg}`);
  }

  toggleMenu(event:MouseEvent): void{
    this.showMenu = !this.showMenu
    event?.preventDefault()
    event?.stopPropagation();
  }
  notClose(event:MouseEvent){
    event?.stopPropagation();
  }
  closePopup(){
    this.showMenu = false;
  }
}
