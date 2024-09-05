import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../shared.service';
import { catchError, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
    private http: HttpClient
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
    });
  }

  getProtectedData() {
    const sessionKey = this.sharedService.getSessionKey(); // Retrieve session key

    if (sessionKey) {
      console.log('Session Key:', sessionKey); // Debug: Print session key to verify

      const headers = new HttpHeaders().set('X-Session-Key', ` ${sessionKey}`);

    //   this.http.get('http://www.crocusglobal.com/forum/api/users', { headers })
    //     .pipe(
    //       catchError((error) => {
    //         console.error('Error occurred:', error);
    //         return throwError(error);
    //       })
    //     )
    //     .subscribe((data) => {
    //       console.log('Protected Data:', data);
    //     });
    // } else {
    //   console.error('No session key found. Unable to fetch protected data.');
    // }
    this.sharedService.getUserData().subscribe((response)=>
    console.log(response))
  }}
}
