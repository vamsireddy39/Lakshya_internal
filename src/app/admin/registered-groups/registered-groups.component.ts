import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../shared.service';
import Swal from 'sweetalert2';
import { ObservablesService } from '../../observables.service';

@Component({
  selector: 'app-registered-groups',
  templateUrl: './registered-groups.component.html',
  styleUrl: './registered-groups.component.scss'
})
export class RegisteredGroupsComponent {
  userData: any[] = [];
  paginatedData: any[] = [];
  totalUsers: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  pages: number[] = [];
  sortDirection: boolean = true;
  filterQuery: string = '';
  
  // Add this to store subgroup data
  subGroupsData: any[] = [];
  selectedGroupId: number | null = null;

  constructor(private sharedService: SharedService, public router: Router,public observable:ObservablesService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.sharedService.getAllParentGroups().subscribe((response: any) => {
      this.userData = response;
      this.totalUsers = response.length;
      this.updatePagination();
    });
  }

  updatePagination() {
    this.pages = Array(Math.ceil(this.totalUsers / this.pageSize)).fill(0).map((x, i) => i + 1);
    this.paginateData();
  }

  paginateData() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedData = this.userData
      .filter(user => this.filterQuery === '' || 
                      (user.group_name).toLowerCase().includes(this.filterQuery.toLowerCase()))
      .slice(start, end);
  }

  setPage(page: number) {
    this.currentPage = page;
    this.paginateData();
  }

  sortData(column: string) {
    this.sortDirection = !this.sortDirection;
    this.userData.sort((a, b) => {
      const valA = typeof a[column] === 'string' ? a[column].toLowerCase() : a[column];
      const valB = typeof b[column] === 'string' ? b[column].toLowerCase() : b[column];
      
      return this.sortDirection ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });
    this.paginateData();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterQuery = filterValue;
    this.paginateData();
  }

  // Fetch and display subgroups
  getSubGroups(id: number) {
    this.sharedService.getAllSubGroups(id).subscribe((response: any) => {
      this.subGroupsData = response.sub_groups || [];
    });
  }

//   editUser(userId: number) {
//  this.sharedService.getGroupById(userId).subscribe((response)=>
// {    const newValue = {
//   isSubGroup: true,
//      parentGroupId: response || [] // Assuming response contains parentGroupId
//   // Assuming 'response' contains the group data you want
// };

// this.observable.isGroupPathIndex$.next(newValue); //
//   // this.observable.isGroupPathIndex$.next(true,response)
//   console.log(response);
//   this.router.navigate(['Admin/creategroups']);

// })
//   }
editUser(userId: number) {
  this.sharedService.getGroupById(userId).subscribe((response) => {
    // Prepare the new value to send
    const newValue = {
      isGroup: true, // Sending true as required
      groupData: response // Sending the entire response object
    };

    // Emit the new value to the observable
    this.observable.isGroupPathIndex$.next(newValue);
    
    // Log the response for debugging
    console.log(response);
    
    // Navigate to the creategroups page
    this.router.navigate(['Admin/creategroups']);
  });
}


  deleteUser(userId: number){
    this.sharedService.deleteGroup(userId).subscribe(
      (response) => {
        console.log('User deleted successfully:', response);
        // Show success alert
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'User has been deleted.',
        });
        this.getUsers(); 
        this.getSubGroups(userId)
     // Refresh the user list after deletion
      },
      (error: any) => {
        console.error('Error deleting user:', error);
        // Show error alert
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to delete user. Please try again.',
        });
      }
    );
  }
  activateUser(userId: number){
    this.sharedService.activateGroup(userId).subscribe(
      (response) => {
        console.log('User activated successfully:', response);
        // Show success alert
        Swal.fire({
          icon: 'success',
          title: 'Activated!',
          text: 'User has been deleted.',
        });
        this.getUsers(); 
        this.getSubGroups(userId)
        // Refresh the user list after deletion
      },
      (error: any) => {
        console.error('Error deleting user:', error);
        // Show error alert
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to activate user. Please try again.',
        });
      }
    );
  }
}


