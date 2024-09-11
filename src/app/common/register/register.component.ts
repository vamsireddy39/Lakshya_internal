import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../shared.service';
import { HttpClient } from '@angular/common/http';
import { ObservablesService } from '../../observables.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  RegisterForm: FormGroup;
  loginRegisterForm: FormGroup;
  isRegistrationSuccessful: boolean = false;
  registerResponse: any = [];
  userDetails: any = [];
  editDetails: boolean = false;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private http: HttpClient,
    private observable: ObservablesService
  ) {
    this.RegisterForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], // Added email validation
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Mobile number validation
      role_id: ['', Validators.required]
    });

    this.loginRegisterForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      user_id: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Patch the form with user details if they exist
    this.observable.userDetailsByIdPathIndex$.subscribe((response) => {
      console.log(response);
      this.userDetails = response;
      if (response) {
        this.RegisterForm.patchValue({
          firstname: response.user.firstname,
          lastname: response.user.lastname,
          email: response.user.email,
          mobile: response.user.mobile,
          role_id: response.user.role_id
        });
      }
    });

    // Set edit mode based on observable
    this.observable.editUserPathIndex$.subscribe(resp => {
      console.log(resp);
      if (resp === true) {
        this.editDetails = true; // Corrected assignment of editDetails
      }
    });
  }

  Submit() {
    // Check if the form is valid before submission
    if (this.RegisterForm.invalid) {
      console.log('Form is invalid, cannot submit');
      return;
    }

    if (this.editDetails) {
      this.editRegisteredUser(this.userDetails.user.id);
    } else {
      this.Register();
    }
  }

  Register() {
    const formData = {
      firstname: this.RegisterForm.controls['firstname'].value,
      lastname: this.RegisterForm.controls['lastname'].value,
      email: this.RegisterForm.controls['email'].value,
      mobile: this.RegisterForm.controls['mobile'].value,
      role_id: this.RegisterForm.controls['role_id'].value
    };

    this.sharedService.Register(formData).subscribe((response: any) => {
      console.log(response); // Debug: Check the Register response
      this.registerResponse = response;
      this.isRegistrationSuccessful = true;
    });
  }

  submitloginRegisterForm() {
    const secondFormData = {
      username: this.loginRegisterForm.controls['username'].value,
      password: this.loginRegisterForm.controls['password'].value,
      user_id: this.registerResponse.user_id
    };

    this.sharedService.LoginRegister(secondFormData).subscribe((response: any) => {
      console.log(response); // Handle success or error for the second form submission
    });
  }

  editRegisteredUser(userid: number) {
    const formData = {
      firstname: this.RegisterForm.controls['firstname'].value,
      lastname: this.RegisterForm.controls['lastname'].value,
      email: this.RegisterForm.controls['email'].value,
      mobile: this.RegisterForm.controls['mobile'].value,
      role_id: this.RegisterForm.controls['role_id'].value
    };

    this.sharedService.UpdateRegister(userid, formData).subscribe((response: any) => {
      console.log(response); // Debug: Check the update response
    });
  }
}
