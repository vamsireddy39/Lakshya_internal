import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../shared.service';
import { catchError, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  RegisterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private http: HttpClient
  ) {
    this.RegisterForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      mobile: ['', Validators.required],
      role_id: ['', Validators.required]
    });
  }

  Register() {
    const formData = {
      firstname: this.RegisterForm.controls['firstname'].value,
      lastname: this.RegisterForm.controls['lastname'].value,
      email: this.RegisterForm.controls['email'].value,
      mobile: this.RegisterForm.controls['mobile'].value,
      role_id: this.RegisterForm.controls['role_id'].value
    };
    const sessionKey = this.sharedService.getSessionKey(); // Retrieve session key

    if (sessionKey) {
      console.log('Session Key:', sessionKey); // Debug: Print session key to verify

      const headers = new HttpHeaders().set('X-Session-Key', ` ${sessionKey}`);
      this.sharedService.Register(formData).subscribe((response: any) => {
        console.log(response); // Debug: Check the Register response

      });
    }
  }

}

