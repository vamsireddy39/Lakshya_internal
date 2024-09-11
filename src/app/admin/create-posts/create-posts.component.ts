import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Editor } from 'ngx-editor';
import { ObservablesService } from '../../observables.service';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-create-posts',
  templateUrl: './create-posts.component.html',
  styleUrls: ['./create-posts.component.scss']
})
export class CreatePostsComponent implements OnInit, OnDestroy {
  roleID: any;
  editorIntro: Editor;
  CreatePost: FormGroup;
  headerImageFile: File | null = null;
  attachedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private observable: ObservablesService,
    private sharedService: SharedService
  ) {
    this.editorIntro = new Editor();
    this.CreatePost = this.fb.group({
      title:['',[Validators.required,Validators.maxLength(400)]],
      user_id: [''],
      descr: ['', [Validators.required, Validators.maxLength(4500)]],
      header_image: [''],
      attached_file: ['']
    });
  }

  ngOnInit(): void {
    this.observable.loginDetailsPathIndex$.subscribe((response) => {
      this.roleID = response.role_id;
    });
  }

  ngOnDestroy(): void {
    this.editorIntro.destroy();
  }

  createBlog(): void {
  
    // Create FormData to send files and other data
    const formData = new FormData();
    formData.append('title', this.CreatePost.controls['title'].value);
    formData.append('descr', this.CreatePost.controls['descr'].value);
    formData.append('user_id', this.roleID);

    if (this.headerImageFile) {
      formData.append('header_image', this.headerImageFile);
    }

    if (this.attachedFile) {
      formData.append('attached_file', this.attachedFile);
    }

    // const sessionKey = this.sharedService.getSessionKey(); // Retrieve session key
    // if (sessionKey) {
    //   const headers = new HttpHeaders().set('X-Session-Key', sessionKey);

      this.sharedService.postBlog(formData).subscribe((response: any) => {
        console.log(response); // Handle success
      });
    // }
  }

  handleFileInputChange(event: Event, fileType: 'header_image' | 'attached_file'): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length) {
      const selectedFile = inputElement.files[0];

      // Assign the selected file to the correct form field
      if (fileType === 'header_image') {
        this.headerImageFile = selectedFile;
      } else if (fileType === 'attached_file') {
        this.attachedFile = selectedFile;
      }
    }
  }
}
