import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../shared.service';
import { catchError, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  LoginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private http: HttpClient,
    private router : Router
  ) {
    this.LoginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  Login() {
    const formData = {
      username: this.LoginForm.controls['username'].value,
      password: this.LoginForm.controls['password'].value
    };

    this.sharedService.Login(formData).subscribe((response: any) => {
      console.log(response); // Debug: Check the login response

      if (response.session_key) {
        // Store the session key in the service
        this.sharedService.setSessionKey(response.session_key);
      } else {
        console.error('No session key found in response.');
      }
      if (response.role_id === 1 || response.role_id === 3) {
        this.router.navigateByUrl('Admin');
      } else if (response.role_id === 2) {
        this.router.navigateByUrl('User');
      } else {
        console.error('Unknown role_id:', response.role_id);
      }
    });
  }

  
}
