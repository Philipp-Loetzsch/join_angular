import { Component, Input, OnInit } from '@angular/core';
import { Contact } from '../../../../interfaces/interfaces';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserDatasService } from '../../../../services/user-datas.service';
import { ChosenContact } from '../../../../interfaces/contact';
import { CommonModule } from '@angular/common';
import { ContactsComponent } from '../contacts.component';


@Component({
  selector: 'app-edit-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-contact.component.html',
  styleUrl: './edit-contact.component.scss'
})
export class EditContactComponent implements OnInit{
  @Input() chosenContact!:Contact
  @Input() editMode!:boolean
  color:string=''
  headline: string = 'Add contact'
  editContactForm: FormGroup

  constructor(private fb:FormBuilder, private userDataService:UserDatasService, private contact : ContactsComponent){
    this.editContactForm = this.fb.group({
      name:['', Validators.required],
      email:['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      phone:['', Validators.required]
    })
   
  }
  
  ngOnInit(): void {
    console.log(this.editMode);
    this.editMode ? this.headline = 'Edit contact' : 'Add contact'; 
    console.log(this.chosenContact);
    if(this.chosenContact === undefined || !this.editMode)this.chosenContact = new ChosenContact
      this.editContactForm.patchValue({
        name: this.chosenContact.name,
        email: this.chosenContact.email,
        phone: this.chosenContact.phone,
      })
    
    console.log(this.editContactForm.value);
    
  }

  closeEdit(){
    this.contact.showEdit=false
  }
  onSubmit(){
    this.editContactForm.markAllAsTouched()
  }
}
