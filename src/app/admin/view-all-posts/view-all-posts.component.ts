import { Component, SecurityContext } from '@angular/core';
import { SharedService } from '../../shared.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-view-all-posts',
  templateUrl: './view-all-posts.component.html',
  styleUrls: ['./view-all-posts.component.scss']
})
export class ViewAllPostsComponent {

  userData: any[] = [];
  paginatedData: any[] = [];
  totalUsers: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  pages: number[] = [];
  sortDirection: boolean = true; // true for ascending, false for descending
  filterQuery: string = '';

  constructor(private sharedService: SharedService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.sharedService.getPosts().subscribe((response: any) => {
      this.userData = response.posts;
      this.totalUsers = response.posts.length;
      this.updatePagination();
    });
  }
  // sanitizeDescription(desc: string): SafeHtml {
  //   return this.sanitizer.bypassSecurityTrustHtml(desc);
  // }
  sanitizeDescription(descr: string, length: number = 100): string {
    const sanitizedDescr = this.sanitizer.sanitize(SecurityContext.HTML, descr) || '';
    return sanitizedDescr.length > length ? sanitizedDescr.slice(0, length) + '...' : sanitizedDescr;
  }
  

  // Truncate the description to 150 characters
  truncateDescription(desc: string): string {
    return desc.length > 150 ? desc.slice(0, 150) + '...' : desc;
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
}
