import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Editor, Validators } from 'ngx-editor';
import Swal from 'sweetalert2';
import { ObservablesService } from '../../observables.service';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-create-posts',
  templateUrl: './create-posts.component.html',
  styleUrl: './create-posts.component.scss'
})
export class CreatePostsComponent {

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
      this.roleID = response.user_id;
    });

    this.sharedService.getallgroupsbyuserid(this.roleID).subscribe((response) => {
      // console.log(response);
      this.parentGroups = response ;
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
      // this.getAllSubGroupsByParentId(postData.group_id);
    }
  }

  ngOnDestroy(): void {
    this.editorIntro.destroy();
  }

  // onGroupSelect(event: any) {
  //   const groupId = event.target.value;
  //   if (groupId) {
  //     this.getAllSubGroupsByParentId(groupId);
  //   }
  // }
  onGroupSelect(event: any) {
    const groupId = event.target.value;
    
    // Find the selected parent group based on groupId
    const selectedGroup = this.parentGroups.groups.find((group: any) => group.group_id === +groupId);
  
    // If the group exists and has subgroups, set them to SubparentGroups
    if (selectedGroup && selectedGroup.sub_groups.length > 0) {
      this.SubparentGroups.sub_groups = selectedGroup.sub_groups;
    } else {
      this.SubparentGroups.sub_groups = []; // Clear the subgroups if none are available
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
