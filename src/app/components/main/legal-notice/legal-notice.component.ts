import { Component } from '@angular/core';
import { UserDatasService } from '../../../services/user-datas.service';

@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [],
  templateUrl: './legal-notice.component.html',
  styleUrl: './legal-notice.component.scss'
})
export class LegalNoticeComponent {
  constructor(private userDataService: UserDatasService){}
}
