import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-title-description',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './title-description.component.html',
  styleUrls: ['./title-description.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TitleDescriptionComponent),
      multi: true,
    },
  ],
})
export class TitleDescriptionComponent implements OnInit{
  // @Input() title: string = '';
  // @Input() description: string = '';
  @Input() requiered: boolean = false;
  @Input() formGroup!: FormGroup
  ngOnInit(): void {
    console.log(this.formGroup.value)    
  }
  // onChange: (value: any) => void = () => {};
  // onTouched: () => void = () => {};

  // setTitle() {
  //   // Optional: Falls zusätzliche Logik beim Setzen benötigt wird
  //   this.onChange({ title: this.title, description: this.description });
  // }

  // writeValue(value: any): void {
  //   if (value) {
  //     this.title = value.title;
  //     this.description = value.description;
  //   }
  // }

  // registerOnChange(fn: any): void {
  //   this.onChange = fn;
  // }

  // registerOnTouched(fn: any): void {
  //   this.onTouched = fn;
  // }
}
