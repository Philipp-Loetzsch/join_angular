import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserDatasService } from '../../../services/user-datas.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent implements OnInit {
 hoverd1:boolean = false
 hoverd2:boolean = false
  greetingName:string = ''
 constructor(private userDataService : UserDatasService){
 }

async ngOnInit(): Promise<void> {
   this.greetingName = await this.userDataService.getUserName()
   console.log(this.greetingName);
   
  }
  
}
