import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  LoginForm:FormGroup;
constructor(private fb: FormBuilder, private http: HttpClient, private sharedService: SharedService){
  this.LoginForm = this.fb.group({
    username: ['',Validators.required],
    password: ['',Validators.required],

  });
}
Login(){
  let formData: FormData = new FormData();
    formData.append('username', this.LoginForm.controls['username'].value);
    formData.append('password', this.LoginForm.controls['password'].value);
   

  this.sharedService.Login(formData).subscribe((Response)=>{
    console.log(Response)
  })
}
}
