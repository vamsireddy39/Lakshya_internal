import { Component } from '@angular/core';
import Swal from 'sweetalert2'; // Import SweetAlert
import { ObservablesService } from '../observables.service';
import { SharedService } from '../shared.service';

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

  constructor(public observable: ObservablesService, public sharedService: SharedService) {}

  ngOnInit() {
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

      // Fetch the group members (either for the parent group or subgroup)
      this.observable.groupMembersPathIndex$.subscribe((response) => {
        console.log('Group Members:', response);
        this.groupMembers = response;
        this.filterNonGroupMembers(); // Ensure filtering logic is updated
      });
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
  filterNonGroupMembers() {
    if (this.groupMembers && this.userdata?.users) {
      const groupMemberIds = this.groupMembers.group_members.map((member: any) => member.user_id);

      if (this.isSubgroup && this.parentGroupMembers?.group_members) {
        // Subgroup: Show users in the parent group but not in the subgroup
        const parentMemberIds = this.parentGroupMembers.group_members.map((member: any) => member.user_id);
        this.nonGroupMembers = this.userdata.users.filter((user: any) =>
          parentMemberIds.includes(user.id) && !groupMemberIds.includes(user.id)
        );
      } else {
        // Parent group: Show users not in the group at all
        this.nonGroupMembers = this.userdata.users.filter((user: any) => !groupMemberIds.includes(user.id));
      }
      console.log('Non-Group Members:', this.nonGroupMembers);
    } else {
      console.warn('Group members or user data is not available');
    }
  }

  // Toggle between showing group members and adding new members
  toggleAddMembers() {
    this.isAddingMembers = !this.isAddingMembers;
  }

  // Method to add selected group members
  addGroupMembers() {
    const payload = {
      group_id: this.groupMembers.group_id,
      user_ids: this.nonGroupMembers.map((user: any) => user.id),
    };

    if (this.isSubgroup) {
      // API call for adding subgroup members
      this.sharedService.addSubGroupMembers(payload).subscribe(
        (response) => {
          console.log('Subgroup members added successfully:', response);
          Swal.fire('Success!', 'Subgroup members added successfully.', 'success');
          this.toggleAddMembers();
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
