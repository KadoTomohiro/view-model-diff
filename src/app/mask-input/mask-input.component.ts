import {AfterViewInit, Component, ElementRef, forwardRef, Renderer2, ViewChild} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor, FormBuilder, FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
import {map, tap} from 'rxjs/operators';

const noop = () => {}

@Component({
  selector: 'app-mask-input',
  templateUrl: './mask-input.component.html',
  styleUrls: ['./mask-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() =>  MaskInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() =>  MaskInputComponent),
      multi: true
    }
  ]
})
export class MaskInputComponent implements ControlValueAccessor, Validator {
  readonly innerControl = this.fb.control('')
  onTouched: () => void = noop

  @ViewChild('input', {static: true}) input!: ElementRef<HTMLInputElement>

  constructor(private fb: FormBuilder) {}

  writeValue(text: string) {
    this.innerControl.setValue(text, {emitEvent: false})
    this.comma()
  }

  registerOnChange(fn: any) {
    this.innerControl.valueChanges
      .pipe(
        tap(() => {
          this.comma()
        }),
        map((value: string) => this.uncomma(value))
      )
      .subscribe(fn)
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean) {
    isDisabled ? this.innerControl.disable() : this.innerControl.enable();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return null
  }

  comma(): void {
    const value: number = this.innerControl.value
    const numberValue = typeof value === 'string' ?  Number(this.uncomma(value)) : value
    const masked = Number(numberValue).toLocaleString(undefined, {maximumFractionDigits: 10})
    this.innerControl.setValue(masked, {emitEvent: false})
  }

  uncomma(commad: string): number {
    return Number(commad.replace(/,/g, ''));
  }
}
