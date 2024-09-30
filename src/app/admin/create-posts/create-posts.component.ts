// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Component, OnDestroy, OnInit } from '@angular/core';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { Editor } from 'ngx-editor';
// import { ObservablesService } from '../../observables.service';
// import { SharedService } from '../../shared.service';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-create-posts',
//   templateUrl: './create-posts.component.html',
//   styleUrls: ['./create-posts.component.scss']
// })
// export class CreatePostsComponent implements OnInit, OnDestroy {
//   roleID: any;
//   editorIntro: Editor;
//   CreatePost: FormGroup;
//   headerImageFile: File | null = null;
//   attachedFile: File | null = null;
//   parentGroups: any = [];
//   SubparentGroups:any=[];
//   constructor(
//     private fb: FormBuilder,
//     private http: HttpClient,
//     private observable: ObservablesService,
//     private sharedService: SharedService
//   ) {
//     this.editorIntro = new Editor();
//     this.CreatePost = this.fb.group({
//       title:['',[Validators.required,Validators.maxLength(400)]],
//       user_id: [''],
//       descr: ['', [Validators.required, Validators.maxLength(4500)]],
//       header_image: [''],
//       attached_file: [''],
//       group_id:[''],
//     });
//   }

//   ngOnInit(): void {
//     this.observable.loginDetailsPathIndex$.subscribe((response) => {
//       this.roleID = response.role_id;
//     });
//     this.sharedService.getAllParentGroups().subscribe((response) => {
//       console.log(response)
//       this.parentGroups = response;

//     }
//     )
//     this.observable.postdetailsPathIndex$.subscribe((Response)=>{
//       console.log(Response)
//     })
//   }
//   onGroupSelect(event: any) {
//     const groupId = event.target.value;
//     if (groupId) {
//       this.getAllSubGroupsByParentId(groupId);
//     }
//   }

//   // API call to get subgroups based on selected group
//   getAllSubGroupsByParentId(groupid: number) {
//     this.sharedService.getAllSubGroupsByParentId(groupid).subscribe((response) => {
//       this.SubparentGroups = response; // Assigning the API response to SubparentGroups
//     }, (error) => {
//       console.error('Error fetching subgroups:', error);
//     });
//   }


//   ngOnDestroy(): void {
//     this.editorIntro.destroy();
//   }

//   createBlog(): void {
//     // Get the values for group_id and subgroup_id
//     const groupId = this.CreatePost.controls['group_id'].value;
//     const subgroupId = this.CreatePost.controls['subgroup_id']?.value;
  
//     // Determine whether to use the groupId or subgroupId
//     const finalGroupId = subgroupId ? subgroupId : groupId;
  
//     // Create FormData to send files and other data
//     const formData = new FormData();
//     formData.append('title', this.CreatePost.controls['title'].value);
//     formData.append('descr', this.CreatePost.controls['descr'].value);
//     formData.append('user_id', this.roleID);
//     formData.append('group_id', finalGroupId); // Use finalGroupId here
  
//     if (this.headerImageFile) {
//       formData.append('header_image', this.headerImageFile);
//     }
  
//     if (this.attachedFile) {
//       formData.append('attached_file', this.attachedFile);
//     }
  
//     // Send the request
//     this.sharedService.postBlog(formData).subscribe((response: any) => {
//       console.log(response); // Handle success
//       Swal.fire({
//         title: "Post Created!",
//         text: "Your Post has been successfully created.",
//         icon: "success",
//         confirmButtonText: "OK"
//       });
//     },
//     (error: any) => {
//       // Error response
//       console.error(error);
//       Swal.fire({
//         title: "Error",
//         text: "There was an issue creating your Post. Please try again.",
//         icon: "error",
//         confirmButtonText: "OK"
//       });
//     });
//   }
  

//   handleFileInputChange(event: Event, fileType: 'header_image' | 'attached_file'): void {
//     const inputElement = event.target as HTMLInputElement;
//     if (inputElement.files && inputElement.files.length) {
//       const selectedFile = inputElement.files[0];

//       // Assign the selected file to the correct form field
//       if (fileType === 'header_image') {
//         this.headerImageFile = selectedFile;
//       } else if (fileType === 'attached_file') {
//         this.attachedFile = selectedFile;
//       }
//     }
//   }
// }
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Editor } from 'ngx-editor';
import { ObservablesService } from '../../observables.service';
import { SharedService } from '../../shared.service';
import Swal from 'sweetalert2';

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
  parentGroups: any = [];
  SubparentGroups:any=[];
  isEditing: boolean = false; // Flag to differentiate between create and update
  postId: any; // To store post ID for updating

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private observable: ObservablesService,
    private sharedService: SharedService
  ) {
    this.editorIntro = new Editor();
    this.CreatePost = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(400)]],
      user_id: [''],
      descr: ['', [Validators.required, Validators.maxLength(4500)]],
      header_image: [''],
      attached_file: [''],
      group_id: [''],
    });
  }

  ngOnInit(): void {
    this.observable.loginDetailsPathIndex$.subscribe((response) => {
      this.roleID = response.role_id;
    });

    this.sharedService.getAllParentGroups().subscribe((response) => {
      // console.log(response);
      this.parentGroups = response;
    });

    // Check if there's an existing post to edit
    this.observable.AdminPostByIdDetailsPathIndex$.subscribe((response) => {
      if (response && response.post.id) {
        this.isEditing = true; // Set editing flag to true
        this.postId = response.post.id; // Save post ID for updating
        this.patchForm(response.post ); // Patch form with the response
console.log(response)
      }
    });
  }

  patchForm(postData: any): void {
    this.CreatePost.patchValue({
      title: postData.title,
      descr: postData.descr,
      group_id: postData.group_id,
      user_id: this.roleID,
    });

    // Load subgroups if available
    if (postData.group_id) {
      this.getAllSubGroupsByParentId(postData.group_id);
    }
  }

  ngOnDestroy(): void {
    this.editorIntro.destroy();
  }

  onGroupSelect(event: any) {
    const groupId = event.target.value;
    if (groupId) {
      this.getAllSubGroupsByParentId(groupId);
    }
  }

  getAllSubGroupsByParentId(groupId: number) {
    this.sharedService.getAllSubGroupsByParentId(groupId).subscribe(
      (response) => {
        this.SubparentGroups = response;
      },
      (error) => {
        console.error('Error fetching subgroups:', error);
      }
    );
  }

  handleFileInputChange(event: Event, fileType: 'header_image' | 'attached_file'): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length) {
      const selectedFile = inputElement.files[0];

      if (fileType === 'header_image') {
        this.headerImageFile = selectedFile;
      } else if (fileType === 'attached_file') {
        this.attachedFile = selectedFile;
      }
    }
  }

  createBlog(): void {
    // Determine if this is a create or update request
    if (this.isEditing == true) {
      this.updatePost();
    } else {
      this.createBlogs();
    }
  }

  createBlogs(): void {
    const formData = this.prepareFormData();

    this.sharedService.postBlog(formData).subscribe(
      (response: any) => {
        Swal.fire({
          title: "Post Created!",
          text: "Your Post has been successfully created.",
          icon: "success",
          confirmButtonText: "OK"
        });
        this.CreatePost.reset()

      },
      (error: any) => {
        console.error(error);
        Swal.fire({
          title: "Error",
          text: "There was an issue creating your Post. Please try again.",
          icon: "error",
          confirmButtonText: "OK"
        });
      }
    );
  }

  updatePost(): void {
    const formData = this.prepareFormData();
    formData.append('id', this.postId); // Append the post ID for updating
    formData.append('post_id',this.postId)

    this.sharedService.updatePost(formData).subscribe(
      (response: any) => {
        Swal.fire({
          title: "Post Updated!",
          text: "Your Post has been successfully updated.",
          icon: "success",
          confirmButtonText: "OK"
        });
        this.CreatePost.reset()
      },
      (error: any) => {
        console.error(error);
        Swal.fire({
          title: "Error",
          text: "There was an issue updating your Post. Please try again.",
          icon: "error",
          confirmButtonText: "OK"
        });
      }
    );
  }

  prepareFormData(): FormData {
    const groupId = this.CreatePost.controls['group_id'].value;
    const subgroupId = this.CreatePost.controls['subgroup_id']?.value;
    const finalGroupId = subgroupId ? subgroupId : groupId;

    const formData = new FormData();
    formData.append('title', this.CreatePost.controls['title'].value);
    formData.append('descr', this.CreatePost.controls['descr'].value);
    formData.append('user_id', this.roleID);
    formData.append('group_id', finalGroupId);
    if (this.headerImageFile) {
      formData.append('header_image', this.headerImageFile);
    }

    if (this.attachedFile) {
      formData.append('attached_file', this.attachedFile);
    }

    return formData;
  }
}
