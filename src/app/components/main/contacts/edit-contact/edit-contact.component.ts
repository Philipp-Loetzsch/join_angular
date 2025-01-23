import { Component, Input } from '@angular/core';
import { Contact } from '../../../../interfaces/interfaces';

@Component({
  selector: 'app-edit-contact',
  standalone: true,
  imports: [],
  templateUrl: './edit-contact.component.html',
  styleUrl: './edit-contact.component.scss'
})
export class EditContactComponent {
  @Input() chosenContact!:Contact
  color:string='#D1D1D1'
}
