import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-priority',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './priority.component.html',
  styleUrl: './priority.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PriorityComponent),
      multi: true,
    },
  ],
})
export class PriorityComponent implements ControlValueAccessor {
  @Input()chosenPrio: string = '';

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  setPriority(priority: string) {
    this.chosenPrio = priority;
    this.onChange(priority);
    this.onTouched();
  }

  writeValue(value: string): void {
    this.chosenPrio = value || 'Medium';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
