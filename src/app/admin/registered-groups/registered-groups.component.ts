import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../shared.service';

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

  constructor(private sharedService: SharedService, public router: Router) { }

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

  editUser(userId: number) {
    this.router.navigate(['/register', userId]);
  }

  deleteUser(userId: number) {
    this.sharedService.deleteUser(userId).subscribe(response => {
      console.log('User deleted', response);
      this.getUsers();
    });
  }
}
