import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../shared.service';
import { ObservablesService } from '../../observables.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-registered-users',
  templateUrl: './registered-users.component.html',
  styleUrl: './registered-users.component.scss'
})
export class RegisteredUsersComponent implements OnInit {
  userData: any[] = [];
  paginatedData: any[] = [];
  totalUsers: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  pages: number[] = [];
  sortDirection: boolean = true; // true for ascending, false for descending
  filterQuery: string = '';

  constructor(private sharedService: SharedService, private observable : ObservablesService, public router: Router) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.sharedService.getUserData().subscribe((response: any) => {
      this.userData = response.users;
      this.totalUsers = response.users.length;
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
                      (user.firstname + ' ' + user.lastname).toLowerCase().includes(this.filterQuery.toLowerCase()))
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

  editUser(userId: number) {
      this.sharedService.getUserDataById(userId).subscribe(
      (response: any) => {
        console.log('User updated successfully:', response);
        this.observable.userDetailsByIdPathIndex$.next(response);
        this.observable.editUserPathIndex$.next(true);
        this.router.navigateByUrl('/register');


      },
      (error: any) => {
        console.error('Error updating user:', error);
      }
    );
  }
    deleteUser(userId: number){
      this.sharedService.deleteUser(userId).subscribe(Response=>{console.log(Response)})
    }
}