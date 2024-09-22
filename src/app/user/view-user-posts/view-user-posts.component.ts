import { Component, SecurityContext } from '@angular/core';
import { SharedService } from '../../shared.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { ObservablesService } from '../../observables.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-user-posts',
  templateUrl: './view-user-posts.component.html',
  styleUrl: './view-user-posts.component.scss'
})
export class ViewUserPostsComponent {
  logindata:any;
  groupdata:any;
  
  
  userData: any[] = [];
  paginatedData: any[] = [];
  totalUsers: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  pages: number[] = [];
  sortDirection: boolean = true; // true for ascending, false for descending
  filterQuery: string = '';
user: any;
group: any;
// groupdata: any[] = [];
selectedGroup: any = null; // Stores the currently selected group
activeSubGroup: any = null; // Stores the currently active subgroup

constructor(
  private sharedService: SharedService,
  private sanitizer: DomSanitizer,
  private observable: ObservablesService,
  public router: Router
) {}

ngOnInit() {
  // Fetch user and group data
  this.observable.loginDetailsPathIndex$.subscribe((response) => {
    console.log(response);
    this.logindata = response;
    if (this.logindata) {
      this.sharedService
        .getallgroupsbyuserid(this.logindata.user_id)
        .subscribe((groupResponse: any) => {
          console.log(groupResponse, 'groupname');
          this.groupdata = groupResponse.groups;
        });
    }
  });
}

// Method to select a group and display its subgroups
selectGroup(group: any) {
  this.selectedGroup = group;
  this.activeSubGroup = null;
}

// Method to select a subgroup and display its content
selectSubGroup(subGroup: any) {
  this.activeSubGroup = subGroup;
  this.getForumPostsByUserId(subGroup.group_id,this.logindata.user_id) // Reset the active subgroup when a new group is selected

}
posts: any;

getForumPostsByUserId(groupId:number,userId:number){
this.sharedService.getForumPostsByUserId(groupId,userId).subscribe((response)=>{
  console.log(response)
  this.posts = response; // Store the posts data

})
}
sanitizePostDescription(description: string) {
  return this.sanitizer.bypassSecurityTrustHtml(description);
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
  getPostById(userId:any){
    this.sharedService.getPostsById(userId).subscribe((response)=>{
      console.log(response);
      // alert(response);
      this.observable.postDetailsPathIndex$.next(response)

    })
    // this.router.navigateByUrl('/userPosts');

  }
}
