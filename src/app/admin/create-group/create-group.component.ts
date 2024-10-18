import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Editor } from 'ngx-editor';
import { ObservablesService } from '../../observables.service';
import { SharedService } from '../../shared.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.scss'
})
export class CreateGroupComponent {
  roleID: any;
  CreateGroup: FormGroup;
  createSubGroup:FormGroup;
  parentGroups: any = [];
isGroup:boolean=false
groupData:any;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private observable: ObservablesService,
    private sharedService: SharedService
  ) {
    this.CreateGroup = this.fb.group({
      group_name: ['', [Validators.required, Validators.maxLength(400)]],
      parent_group_id: [''],
    });
    this.createSubGroup = this.fb.group({
      parent_group_id: ['',Validators.required],
      group_name: ['',[Validators.required, Validators.maxLength(400)]],
    });
  }

  ngOnInit(): void {
    this.sharedService.getAllParentGroups().subscribe((response) => {
      console.log(response)
      this.parentGroups = response;

    }
    )
    this.observable.isGroupPathIndex$.subscribe((response)=>{
      console.log(response)
      this.isGroup = response.isGroup;
      this.groupData = response.groupData;
      if (this.isGroup && this.groupData) {
        this.patchGroupData();
      }
    });
  }

  private patchGroupData(): void {
    if (this.groupData) {
      if (this.groupData.parent_group_id === null) {
        // If parent_group_id is null, set it as a parent group
        this.CreateGroup.patchValue({
          group_name: this.groupData.group_name,
          parent_group_id: null // No parent group ID
        });
      } else {
        // If parent_group_id is not null, set it as a subgroup
        this.createSubGroup.patchValue({
          group_name: this.groupData.group_name,
          parent_group_id: this.groupData.parent_group_id
        });
      }
    }
  }
  createBlog(): void {
    if(this.isGroup === true){
      this.UpdateGroup()
    }else{
      this.createGroup()
    }
  }
  createGroup(): void {
    const formData = {
      group_name: this.CreateGroup.controls['group_name'].value,
      parent_group_id: null, // Corrected to JavaScript `null`
    };

    this.sharedService.createGroup(formData).subscribe(
      (response: any) => {
        console.log(response); // Handle success

        // SweetAlert for success
        Swal.fire({
          icon: 'success',
          title: 'Group Created',
          text: 'The group has been created successfully!',
          confirmButtonText: 'OK'
        });

        // Reset the form after successful creation
        this.CreateGroup.reset();
      },
      (error: any) => {
        console.error('Error:', error); // Handle error

        // SweetAlert for failure
        Swal.fire({
          icon: 'error',
          title: 'Creation Failed',
          text: 'There was an error creating the group. Please try again later.',
          confirmButtonText: 'OK'
        });
      }
    );
  }
  UpdateGroup(): void {
    const formData = {
      group_name: this.CreateGroup.controls['group_name'].value,
      parent_group_id: null, // Corrected to JavaScript `null`
    };

    this.sharedService.updateGroup(this.groupData.group_id,formData).subscribe(
      (response: any) => {
        console.log(response); // Handle success

        // SweetAlert for success
        Swal.fire({
          icon: 'success',
          title: 'Group Edited',
          text: 'The group has been Edited successfully!',
          confirmButtonText: 'OK'
        });

        // Reset the form after successful creation
        this.CreateGroup.reset();
      },
      (error: any) => {
        console.error('Error:', error); // Handle error

        // SweetAlert for failure
        Swal.fire({
          icon: 'error',
          title: 'Creation Failed',
          text: 'There was an error creating the group. Please try again later.',
          confirmButtonText: 'OK'
        });
      }
    );
  }

  createSubGroups(): void {
    if(this.isGroup === true){
      this.UpdateSubGroup()
    }else{
      this.createdSubGroup()
    }
  }
  createdSubGroup(): void {
    const formData = {
      group_name: this.createSubGroup.controls['group_name'].value,
      parent_group_id: this.createSubGroup.controls['parent_group_id'].value
    };

    this.sharedService.createSubGroup(formData).subscribe(
      (response: any) => {
        console.log(response); // Handle success

        // SweetAlert for success
        Swal.fire({
          icon: 'success',
          title: 'Group Created',
          text: 'The group has been created successfully!',
          confirmButtonText: 'OK'
        });

        // Reset the form after successful creation
        this.createSubGroup.reset();
      },
      (error: any) => {
        console.error('Error:', error); // Handle error

        // SweetAlert for failure
        Swal.fire({
          icon: 'error',
          title: 'Creation Failed',
          text: 'There was an error creating the group. Please try again later.',
          confirmButtonText: 'OK'
        });
      }
    );
  }
  UpdateSubGroup(): void {
    const formData = {
      group_name: this.createSubGroup.controls['group_name'].value,
      parent_group_id: this.groupData.parent_group_id, // Corrected to JavaScript `null`
    };

    this.sharedService.updateGroup(this.groupData.group_id,formData).subscribe(
      (response: any) => {
        console.log(response); // Handle success

        // SweetAlert for success
        Swal.fire({
          icon: 'success',
          title: 'Group Edited',
          text: 'The group has been Edited successfully!',
          confirmButtonText: 'OK'
        });

        // Reset the form after successful creation
        this.createSubGroup.reset();
      },
      (error: any) => {
        console.error('Error:', error); // Handle error

        // SweetAlert for failure
        Swal.fire({
          icon: 'error',
          title: 'Creation Failed',
          text: 'There was an error creating the group. Please try again later.',
          confirmButtonText: 'OK'
        });
      }
    );
  }
}
