import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';

interface Links {
  name: string;
  img: string;
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterModule, MatSidenavModule, CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  nameLinks: Array<Links> = [
    { name: 'Summary', img: 'summary' },
    { name: 'Add Task', img: 'add_task' },
    { name: 'Board', img: 'board' },
    { name: 'Contacts', img: 'contacts' },
  ];
}
