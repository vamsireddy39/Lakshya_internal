import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../shared.service';
import { catchError, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ObservablesService } from '../../observables.service';

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
    private router: Router,
    public Observable: ObservablesService
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
      this.Observable.loginDetailsPathIndex$.next(response)
  
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
