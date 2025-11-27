import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { passwordMatchValidator } from '../../validators/password-match.validator';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-auth-form',
  imports: [CommonModule, ReactiveFormsModule,BsDatepickerModule],
  templateUrl: './auth-form.html',
  styleUrl: './auth-form.css'
})
export class AuthForm implements OnInit {
  @Input() formType: 'Login' | 'Register' = 'Login';
  @Output() formSubmitted = new EventEmitter<any>();

  authForm!: FormGroup;
showPassword: boolean = false; 
showConfirmPassword: boolean = false;

  constructor(private fb: FormBuilder) {}

  togglePassword(): void {
  this.showPassword = !this.showPassword;
}

toggleConfirmPassword(): void {
  this.showConfirmPassword = !this.showConfirmPassword;
}


  ngOnInit(): void {
    this.authForm = this.fb.group({
      userName: ['', [Validators.required, Validators.pattern(/^(?!\s)(?!.*\s$).+$/)]],
      passwordHash: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?!\s)(?!.*\s$).+$/)] ]
    });

    if (this.formType === 'Register') {
      this.authForm.addControl('confirmPassword', this.fb.control('', [Validators.required]));   
      this.authForm.addControl('email', this.fb.control('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.com$')]));
      this.authForm.addControl('gender', this.fb.control('')); 
      this.authForm.addControl('dateOfBirth', this.fb.control(null, [this.dateValidator])); 
      this.authForm.addControl('contactNumber', this.fb.control('', [Validators.pattern('^[0-9]{10}$')])); 
      this.authForm.addControl('address', this.fb.control('', [Validators.maxLength(250)])); 
      this.authForm.setValidators(passwordMatchValidator());
    }

    this.authForm.get('userName')?.valueChanges.subscribe(value => {
  this.authForm.get('userName')?.setValue(value.trim(), { emitEvent: false });
});

  }

 onSubmit(): void {
  if (this.authForm.valid) {
    const payload = { ...this.authForm.value };

    if (payload.contactNumber !== null && payload.contactNumber !== undefined && payload.contactNumber !== '') {
      payload.contactNumber = String(payload.contactNumber);
    } else {
      payload.contactNumber = null;
    }

    this.formSubmitted.emit(payload);
  } else {
    this.authForm.markAllAsTouched();
  }
}
  

    dateValidator: ValidatorFn = function(control : AbstractControl): ValidationErrors | null {
  const currentDate = new Date(); 
  const date = new Date(control.value); 
  const fiveYearsFromNow = new Date();
  fiveYearsFromNow.setFullYear(fiveYearsFromNow.getFullYear() - 5);
  return date > fiveYearsFromNow ? {isFuture: true} : null; 
}
}



