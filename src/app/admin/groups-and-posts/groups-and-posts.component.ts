import { Component, SecurityContext } from '@angular/core';
import { ObservablesService } from '../../observables.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedService } from '../../shared.service';
import { Router, ActivatedRoute } from '@angular/router'; // Added ActivatedRoute
import { GroupsComponent } from '../../groups/groups.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-groups-and-posts',
  templateUrl: './groups-and-posts.component.html',
  styleUrls: ['./groups-and-posts.component.scss']
})
export class GroupsAndPostsComponent {
  parentGroupPosts: any;
  parentIdGroupPosts: any;

  subGroupDetails: any = { sub_groups: [] };
  userData: any[] = [];
  totalUsers: number = 0;
  userPostDetails:any;
  message: string = ''; // Declare the message property

  constructor(
    public observable: ObservablesService, 
    private sharedService: SharedService, 
    private sanitizer: DomSanitizer,
    public router: Router,public dialog: MatDialog,
    private route: ActivatedRoute // Inject ActivatedRoute
  ) {}
  ngOnInit() {
    // Fetch parent group posts on load
    this.observable.parentGroupPostsPathIndex$.subscribe(response => {
      this.parentGroupPosts = response || [];
      this.parentIdGroupPosts = response.post;
  
      if (response.message) {
        this.getPosts(response.group_id);
      } else if (this.parentIdGroupPosts.length > 0) {
        this.getPosts(this.parentIdGroupPosts[0].group_id);
      }
    });

    // Fetch subgroup details on load
    this.observable.subGroupsPathIndex$.subscribe(response => {
      this.subGroupDetails = response || {};
    });
  }

  getPosts(groupId: number) {
    this.sharedService.getForumPosts(groupId).subscribe(
      (response: any) => {
        if (response) {
          if (response.message) {
            // No posts available, set message
            this.message = response.message;
            this.userData = [];
            this.totalUsers = 0;
          } else {
            // Posts available, reset message and show posts
            this.message = '';
            this.userData = response.post || [];
            this.totalUsers = this.userData.length;
          }
        } else {
          // Handle empty response
          this.userData = [];
          this.totalUsers = 0;
          this.message = 'No data received from the server.';
        }
      },
      (error) => {
        alert('Failed to load posts. Please try again.');
      }
    );
  }
  
  sanitizeDescription(descr: string, length: number = 100): string {
    const sanitizedDescr = this.sanitizer.bypassSecurityTrustHtml(descr) as string;
    const sanitizedText = typeof sanitizedDescr === 'string' ? sanitizedDescr : '';
    return sanitizedText.length > length ? sanitizedText.slice(0, length) + '...' : sanitizedText;
  }
  
  getPostsById(postId: number) {
    this.sharedService.getPostsById(postId).subscribe((response) => {
      console.log(response);
      this.observable.postByIdDetailsPathIndex$.next(response);
      // Correct relative navigation
      this.router.navigate(['/Admin/Post'], { relativeTo: this.route });
    });
  }
  openDialog() {
    const dialogRef = this.dialog.open(GroupsComponent,{
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
 
  getAllGroupMembers(groupId: number, isSubGroup: boolean, parentGroupId: number = 0) {
    this.sharedService.getAllgroupMembers(groupId).subscribe((response) => {
      console.log(response);

      // Emit both parentGroupId and isSubGroup status
      this.observable.isSubGroupPathIndex$.next({ isSubGroup, parentGroupId });
      this.observable.groupMembersPathIndex$.next(response)
      // Open the dialog after emitting the status
      this.openDialog();
    });
  }

}
