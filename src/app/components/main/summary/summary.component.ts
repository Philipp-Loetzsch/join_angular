import { Component, OnInit, Type } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserDatasService } from '../../../services/user-datas.service';

interface Amount {
  todo: number;
  inProgress: number;
  feedback: number;
  done: number;
  urgent: number;
  additional: number;
}
@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent implements OnInit {
  hoverd1: boolean = false;
  hoverd2: boolean = false;
  greetingName: string = '';
  taskAmount: Amount = {
    todo: 0,
    inProgress: 0,
    feedback: 0,
    done: 0,
    urgent: 0,
    additional: 0,
  };
  lastDate!: number;
  urgentDate: string = 'no current due date';
  greetingText:string=''

  constructor(public userDataService: UserDatasService) {}

  async ngOnInit(): Promise<void> {
    console.log('hello');
    
    this.greetingName = await this.userDataService.getUserName();
    if (this.userDataService.tasks.length === 0) {
   
      const load = setInterval(() => {
        this.getAmountTasks();
        this.getUrgentDate();
        this.getGreetingText()
        if (this.userDataService.tasks.length > 0) {
          clearInterval(load);
        }
      }, 200);
    }
    this.getAmountTasks();
    this.getUrgentDate();
    this.getGreetingText()
  }
  getAmountTasks() {
    this.userDataService.tasks.forEach(({ status, prio }) => {
      if (status in this.taskAmount) {
        this.taskAmount[status as keyof Amount]++;
        this.taskAmount.additional++;
      }
      if (prio === 'urgent') {
        this.taskAmount.urgent++;
      }
    });  
  }

  getUrgentDate() {
    this.userDataService.tasks.forEach(({ dueDate }) => {
      if (dueDate < this.lastDate || !this.lastDate) {
        this.lastDate = dueDate;
      }
    });
    const date = new Date(this.lastDate * 1);
    this.urgentDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  getGreetingText(){
    const currentDate = new Date().getHours()
    if(currentDate < 4 || currentDate >= 18) this.greetingText = 'Good evening'
    else if (currentDate >= 12) this.greetingText = 'Good afternoon'
    else this.greetingText = 'Good morning'
  }
}
