import { Component } from '@angular/core';
import Swal from 'sweetalert2'; // Import SweetAlert
import { ObservablesService } from '../observables.service';
import { SharedService } from '../shared.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent {
  groupMembers: any;
  userdata: any;
  nonGroupMembers: any[] = [];
  isAddingMembers = false;
  isSubgroup: boolean = false;
  parentGroupId: number = 0;
  parentGroupMembers: any;

  constructor(public observable: ObservablesService, public sharedService: SharedService,    private dialogRef: MatDialogRef<GroupsComponent> // Inject MatDialogRef
  ) { }

  ngOnInit() {
    // Fetch the group members (either for the parent group or subgroup)
    this.observable.groupMembersPathIndex$.subscribe((response) => {
      console.log('Group Members:', response);
      this.groupMembers = response;
      this.filterNonGroupMembers(); // Ensure filtering logic is updated
    });
    // Fetch subgroup data (isSubgroup and parentGroupId)
    this.observable.isSubGroupPathIndex$.subscribe((response) => {
      const { isSubGroup, parentGroupId } = response || {};
      this.isSubgroup = isSubGroup || false;
      this.parentGroupId = parentGroupId || 0;

      if (this.isSubgroup) {
        // For subgroups, fetch parent group members
        this.sharedService.getAllgroupMembers(this.parentGroupId).subscribe(
          (response) => {
            console.log('Parent Group Members:', response);
            this.parentGroupMembers = response;
            this.filterNonGroupMembers(); // Call once parent group members are fetched
          },
          (error) => {
            Swal.fire('Error!', 'Failed to fetch parent group members.', 'error');
            console.error('Error fetching parent group members:', error);
          }
        );
      }


    });

    // Fetch all users
    this.sharedService.getUserData().subscribe(
      (response) => {
        console.log('User Data:', response);
        this.userdata = response;
        this.filterNonGroupMembers(); // Filter once all users are fetched
      },
      (error) => {
        Swal.fire('Error!', 'Failed to fetch user data.', 'error');
        console.error('Error fetching user data:', error);
      }
    );
  }

  // Filter users who are not in the group
  // filterNonGroupMembers() {
  //   if (this.userdata?.users) {
  //     const groupMemberIds = this.groupMembers?.group_members
  //       ? this.groupMembers.group_members.map((member: any) => member.user_id)
  //       : [];

  //     if (this.isSubgroup && this.parentGroupMembers?.group_members) {
  //       // Subgroup: Show users in the parent group but not in the subgroup
  //       const parentMemberIds = this.parentGroupMembers.group_members.map((member: any) => member.user_id);
  //       this.nonGroupMembers = this.userdata.users.filter((user: any) =>
  //         parentMemberIds.includes(user.id) && !groupMemberIds.includes(user.id)
  //       );
  //     } else {
  //       // Parent group: Show users not in the group at all, including inactive members
  //       this.nonGroupMembers = this.userdata.users.filter((user: any) => 
  //         !groupMemberIds.includes(user.id) || this.groupMembers.group_members.some((member: any) => member.user_id === user.id && member.active_status === 0)
  //       );
  //     }

  //     // Also include group members with active status 0 in the non-group members list
  //     const inactiveGroupMembers = this.groupMembers?.group_members
  //       ?.filter((member: any) => member.active_status === 0)
  //       .map((member: any) => member.user_id) || [];

  //     this.nonGroupMembers.push(
  //       ...this.userdata.users.filter((user: any) => inactiveGroupMembers.includes(user.id))
  //     );

  //     // Remove duplicates from nonGroupMembers
  //     this.nonGroupMembers = [...new Set(this.nonGroupMembers)];
      
  //     console.log('Non-Group Members:', this.nonGroupMembers);
  //   } else {
  //     console.warn('User data is not available');
  //   }
  // }
  filterNonGroupMembers() {
    if (this.userdata?.users) {
      // Get the user IDs of the group members
      const groupMemberIds = this.groupMembers?.group_members
        ? this.groupMembers.group_members.map((member: any) => member.user_id)
        : [];
  
      if (this.isSubgroup && this.parentGroupMembers?.group_members) {
        // Subgroup logic
        const parentMemberIds = this.parentGroupMembers.group_members.map((member: any) => member.user_id);
  
        if (!this.groupMembers?.group_members || this.groupMembers.group_members.length === 0) {
          // Case 1: No users registered in the subgroup yet, so show only parent group users
          this.nonGroupMembers = this.userdata.users.filter((user: any) =>
            parentMemberIds.includes(user.id)
          );
        } else {
          // Case 2: Subgroup has members, so show parent group users not in the subgroup
          this.nonGroupMembers = this.userdata.users.filter((user: any) =>
            parentMemberIds.includes(user.id) && !groupMemberIds.includes(user.id)
          );
  
          // Add inactive subgroup members (those with active_status = 0)
          const inactiveSubgroupMembers = this.groupMembers.group_members
            ?.filter((member: any) => member.active_status === 0)
            .map((member: any) => member.user_id) || [];
  
          this.nonGroupMembers.push(
            ...this.userdata.users.filter((user: any) => inactiveSubgroupMembers.includes(user.id))
          );
        }
      } else {
        // Parent group logic remains the same
        this.nonGroupMembers = this.userdata.users.filter((user: any) => 
          !groupMemberIds.includes(user.id) || this.groupMembers.group_members.some((member: any) => member.user_id === user.id && member.active_status === 0)
        );
  
        // Include inactive group members
        const inactiveGroupMembers = this.groupMembers?.group_members
          ?.filter((member: any) => member.active_status === 0)
          .map((member: any) => member.user_id) || [];
  
        this.nonGroupMembers.push(
          ...this.userdata.users.filter((user: any) => inactiveGroupMembers.includes(user.id))
        );
      }
  
      // Remove duplicates
      this.nonGroupMembers = [...new Set(this.nonGroupMembers)];
  
      console.log('Non-Group Members:', this.nonGroupMembers);
    } else {
      console.warn('User data is not available');
    }
  }
  
  // Toggle between showing group members and adding new members
  toggleAddMembers() {
    this.isAddingMembers = !this.isAddingMembers;
  }

  // Method to add selected group members
  addGroupMembers() {
   
    const selectedUserIds = this.nonGroupMembers
    .filter((user: any) => user.isSelected)
    .map((user: any) => user.id);

  if (selectedUserIds.length === 0) {
    Swal.fire('Warning!', 'Please select at least one member to add.', 'warning');
    return; // Exit if no users are selected
  }

  const payload = {
    group_id: this.groupMembers.group_id,
    user_ids: selectedUserIds,  // Send only selected user IDs
  };

    if (this.isSubgroup) {
      // API call for adding subgroup members
      this.sharedService.addSubGroupMembers(payload).subscribe(
        (response) => {
          console.log('Subgroup members added successfully:', response);
          Swal.fire('Success!', 'Subgroup members added successfully.', 'success');
          this.toggleAddMembers();
          this.dialogRef.close(); // Close the dialog on success


        },
        (error) => {
          Swal.fire('Error!', 'Failed to add subgroup members.', 'error');
          console.error('Error adding subgroup members:', error);
        }
      );
    } else {
      // API call for adding regular group members
      this.sharedService.addGroupMembers(payload).subscribe(
        (response) => {
          console.log('Group members added successfully:', response);
          Swal.fire('Success!', 'Group members added successfully.', 'success');
          this.toggleAddMembers();
          this.dialogRef.close(); // Close the dialog on success

        },
        (error) => {
          Swal.fire('Error!', 'Failed to add group members.', 'error');
          console.error('Error adding group members:', error);
        }
      );
    }
  }

  // Method to deactivate a member
  deactivate(memberId: any) {
    this.sharedService.deactivate(memberId).subscribe(
      (response) => {
        console.log(response);
        Swal.fire('Success!', 'Member deactivated successfully.', 'success');
        this.dialogRef.close(); // Close the dialog on success

      },
      (error) => {
        Swal.fire('Error!', 'Failed to deactivate member.', 'error');
        console.error('Error deactivating member:', error);
      }
    );
  }

  get activeGroupMembers() {
    return this.groupMembers?.group_members?.filter((member: { active_status: number; }) => member.active_status === 1) || [];
  }
}
