import { Component, SecurityContext } from '@angular/core';
import { SharedService } from '../../shared.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ObservablesService } from '../../observables.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-all-posts',
  templateUrl: './view-all-posts.component.html',
  styleUrls: ['./view-all-posts.component.scss']
})
export class ViewAllPostsComponent {
  userData: any[] = [];
  paginatedData: any[] = [];
  totalUsers: number = 0;
  pageSize: number = 12;
  currentPage: number = 1;
  pages: number[] = [];
  sortDirection: boolean = true; // true for ascending, false for descending
  filterQuery: string = '';
  AllGroups:any;

  constructor(
    private sharedService: SharedService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    public router: Router,
    public observable: ObservablesService
  ) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.sharedService.getPosts().subscribe(
      (response: any) => {
        this.userData = response.posts;
        this.totalUsers = this.userData.length;
        this.updatePagination();
        this.sortUsers(); // Sort users based on active status

         // Then fetch the group data
         this.sharedService.getAllGroups().subscribe(
          (groupResponse: any) => {
            this.AllGroups = groupResponse;
            this.mapUsersToGroups(); // Map users to their corresponding group
          },
          (error) => {
            console.error('Error fetching groups', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching posts', error);
        Swal.fire({
          title: 'Error!',
          text: 'Could not fetch posts. Please try again later.',
          icon: 'error',
        });
      }
    );
  }
  
  // Function to map users to their group based on group_id
  mapUsersToGroups() {
    this.userData.forEach(user => {
      const userGroup = this.findGroupById(user.group_id, this.AllGroups);
      if (userGroup) {
        // Check if it's a child group or a parent group
        if (userGroup.parent_group_id) {
          // It's a child group, find the parent group
          const parentGroup = this.AllGroups.find((group: { group_id: any; }) => group.group_id === userGroup.parent_group_id);
          user.groupName = parentGroup ? `${parentGroup.group_name} -> ${userGroup.group_name}` : userGroup.group_name;
        } else {
          // It's a parent group
          user.groupName = userGroup.group_name;
        }
      }
    });
  }
  
  // Helper function to find a group by its ID
  findGroupById(groupId: number, groups: any[]): any {
    for (let group of groups) {
      if (group.group_id === groupId) {
        return group;
      }
      // Check if the group has children
      if (group.children && group.children.length > 0) {
        const childGroup = group.children.find((child: { group_id: number; }) => child.group_id === groupId);
        if (childGroup) {
          return childGroup;
        }
      }
    }
    return null;
  }

  sortUsers() {
    this.userData.sort((a, b) => b.active - a.active); // Sorts active (1) first, then inactive (0)
  }


  getBackgroundColor(active: number): string {
    return active === 1 ? '#ffffff' : '#f5f5f5'; // White for active, light red for inactive
  }
  sanitizeDescription(descr: string, length: number = 100): SafeHtml {
    const sanitizedDescr = this.sanitizer.sanitize(SecurityContext.HTML, descr) || '';
    return this.sanitizer.bypassSecurityTrustHtml(
      sanitizedDescr.length > length ? sanitizedDescr.slice(0, length) + '...' : sanitizedDescr
    );
  }

  updatePagination() {
    this.pages = Array(Math.ceil(this.totalUsers / this.pageSize)).fill(0).map((x, i) => i + 1);
    this.paginateData();
  }

  paginateData() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.paginatedData = this.userData
    .filter(user => 
      this.filterQuery === '' ||
      (user.title && user.title.toLowerCase().includes(this.filterQuery.toLowerCase())) || // Check if title exists
      (user.descr && user.descr.toLowerCase().includes(this.filterQuery.toLowerCase())) || // Check if descr exists
      (user.header_img_file_name && user.header_img_file_name.toLowerCase().includes(this.filterQuery.toLowerCase())) || // Check if header_img_file_name exists
      (user.attached_file_name && user.attached_file_name.toLowerCase().includes(this.filterQuery.toLowerCase())) // Check if attached_file_name exists
    )
      .slice(start, end);
  }

  setPage(page: number) {
    this.currentPage = page;
    this.paginateData();
  }

  sortData(column: string) {
    this.sortDirection = !this.sortDirection;
    this.userData.sort((a, b) => {
      const valA = a[column] ?? ''; // Use nullish coalescing
      const valB = b[column] ?? '';
      return this.sortDirection ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });
    this.paginateData();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterQuery = filterValue;
    this.paginateData();
  }

  update(userid: any) {
    this.sharedService.getPostsById(userid).subscribe(response => {
      const responseWithFlag = {
        ...response,
        flag: true
      };
      this.observable.AdminPostByIdDetailsPathIndex$.next(responseWithFlag);
      this.router.navigate(['/Admin/createPosts'], { relativeTo: this.route });
    });
  }

  deletePost(postId: any) {
    this.sharedService.deletePost(postId).subscribe(() => {
      Swal.fire({
        title: 'Deleted!',
        text: 'Your post has been deleted.',
        icon: 'success'
      });
      this.getUsers(); // Refresh the post list
    });
  }
  ActivatePost(postId: any) {
    this.sharedService.activatePost(postId).subscribe(() => {
      Swal.fire({
        title: 'Activated!',
        text: 'Your post has been Activated.',
        icon: 'success'
      });
      this.getUsers(); // Refresh the post list
    });
  }
}
