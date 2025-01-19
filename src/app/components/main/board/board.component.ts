import { Component, OnInit } from '@angular/core';
import { Tasks, UserDatasService } from '../../../services/user-datas.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit{
tasks!:Tasks[]
 constructor(private userDataService: UserDatasService){
 
 }

 async ngOnInit(): Promise<void> { 
 }
}
