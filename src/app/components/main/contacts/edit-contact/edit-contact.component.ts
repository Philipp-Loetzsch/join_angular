import { Component, Input, OnInit } from '@angular/core';
import { Contact } from '../../../../interfaces/interfaces';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserDatasService } from '../../../../services/user-datas.service';
import { ChosenContact } from '../../../../interfaces/contact';
import { CommonModule } from '@angular/common';
import { ContactsComponent } from '../contacts.component';

@Component({
  selector: 'app-edit-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-contact.component.html',
  styleUrl: './edit-contact.component.scss',
})
export class EditContactComponent implements OnInit {
  @Input() chosenContact!: Contact;
  @Input() editMode!: boolean;
  color: string = '';
  headline: string = 'Add contact';
  editContactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userDataService: UserDatasService,
    public contact: ContactsComponent
  ) {
    this.editContactForm = this.fb.group({
      name: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ],
      ],
      phone: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.editMode ? (this.headline = 'Edit contact') : 'Add contact';
    if (this.chosenContact === undefined || !this.editMode)
      this.chosenContact = new ChosenContact();
    this.editContactForm.patchValue({
      name: this.chosenContact.name,
      email: this.chosenContact.email,
      phone: this.chosenContact.phone,
    });
  }

  async onSubmit(): Promise<void> {
    if (this.editContactForm.invalid) 
      return this.editContactForm.markAllAsTouched();
    const contactId = this.editMode ? this.chosenContact.id : await this.userDataService.createContact(this.editContactForm);
    if (this.editMode) 
      await this.userDataService.updateContact(this.editContactForm, contactId);
    await this.userDataService.getUserContacts();
    await this.contact.loadContacts();
    this.contact.markNewContact(contactId);
    this.contact.closeEdit();
  }

  cancleEdit() {
    this.contact.closeEdit();
    setTimeout(() => {
      if (this.editMode) this.contact.deleteContact();
    }, 900);
  }
}
