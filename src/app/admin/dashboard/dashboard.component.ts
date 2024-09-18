import { Component, SecurityContext } from '@angular/core';
import { SharedService } from '../../shared.service';
import { HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  userLength: any; // Correct type annotation
  userData: any[] = [];
  paginatedData: any[] = [];
  totalUsers: number = 0;
  pageSize: number = 6;
  currentPage: number = 1;
  pages: number[] = [];
  sortDirection: boolean = true; // true for ascending, false for descending
  filterQuery: string = '';
  userDetails: any = [];
  latestFiveUsers: any[] = []; // The array to hold only the latest five users
  activeUsers: number = 0;  // Number of active users
  inactiveUsers: number = 0; // Number of inactive users
  inactivePercentage: number = 0;
  constructor(public sharedService: SharedService, private sanitizer: DomSanitizer) { }
  ngOnInit() {
    this.sharedService.getUserData().subscribe((response: any) => {
      console.log(response); // Handle the response inside the subscribe callback
      this.userLength = response.users.length;
      this.userDetails = response.users;
      this.userDetails.sort((a: { created_at: string | number | Date; }, b: { created_at: string | number | Date; }) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      this.userLength = response.users.length; // Assign the response length

      // Get the latest five users
      this.latestFiveUsers = this.userDetails.slice(0, 4);
      this.activeUsers = this.userDetails.filter((user: any) => user.active === 1).length;
      this.inactiveUsers = this.userDetails.filter((user: any) => user.active === 0).length;

      this.inactivePercentage = (this.inactiveUsers / this.userLength) * 100;
    });


    this.getUsers();

  }



  getUsers() {
    this.sharedService.getPosts().subscribe((response: any) => {

      this.userData = response.posts.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      this.totalUsers = this.userData.length;
      this.updatePagination();
    });
  }

  sanitizeDescription(descr: string, length: number = 20): string {
    const sanitizedDescr = this.sanitizer.sanitize(SecurityContext.HTML, descr) || '';
    return sanitizedDescr.length > length ? sanitizedDescr.slice(0, length) + '...' : sanitizedDescr;
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
        user.descr.toLowerCase().includes(this.filterQuery.toLowerCase()) || // filter by description
        user.header_img_file_name.toLowerCase().includes(this.filterQuery.toLowerCase()) || // filter by header_img_file_name
        user.attached_file_name.toLowerCase().includes(this.filterQuery.toLowerCase())) // filter by attached_file_name
      .slice(start, end);
  }

  setPage(page: number) {
    this.currentPage = page;
    this.paginateData();
  }

  sortData(column: string) {
    this.sortDirection = !this.sortDirection;
    this.userData.sort((a, b) => {
      let valA = a[column];
      let valB = b[column];

      if (column === 'created_at') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      } else if (typeof valA === 'string' && typeof valB === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (this.sortDirection) {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });
    this.paginateData();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterQuery = filterValue;
    this.paginateData();
  }
}