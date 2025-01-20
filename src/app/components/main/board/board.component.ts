import { Component, OnInit } from '@angular/core';
import { Assigned, Tasks, UserDatasService } from '../../../services/user-datas.service';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit {
  tasks: Tasks[] =[];
  assigned: Assigned[] = [];
  constructor(private userDataService: UserDatasService) {}

  ngOnInit(): void {
    this.getTasks();

  }

  getTasks() {
    this.tasks = this.userDataService.tasks;    
    if (this.tasks.length === 0) {
      const contactInterval = setInterval(() => {
        this.tasks = this.userDataService.tasks;
        this.getAssigned()
        if (this.tasks.length >= 0) {
          clearInterval(contactInterval);
        }
      }, 1000);
    }
    this.getAssigned()
  }

  getAssigned(){
  }
}
