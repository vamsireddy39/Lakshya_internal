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
  logindata: any;
  groupdata: any;
  selectedGroup: any = null; // Currently selected group
  activeSubGroup: any = null; // Currently active subgroup
  posts: any; // Stores the posts data
  publicPosts: any; // Public posts data
  
  constructor(
    private sharedService: SharedService,
    private sanitizer: DomSanitizer,
    private observable: ObservablesService,
    public router: Router
  ) {}

  ngOnInit() {
    // Fetch login and group data
    this.observable.loginDetailsPathIndex$.subscribe((response) => {
      this.logindata = response;
      if (this.logindata) {
        // Fetch all groups by user ID
        this.sharedService.getallgroupsbyuserid(this.logindata.user_id).subscribe((groupResponse: any) => {
          this.groupdata = groupResponse.groups;
        });
        // Load public posts initially
        this.displayPublicPosts();
      }
    });
  }

  // Display public posts initially
  displayPublicPosts() {
    this.selectedGroup = null; // No group selected
    this.activeSubGroup = null; // No subgroup selected
    // Assuming 5 is the group_id for the public group
    this.sharedService.getForumPostsByUserId(5, this.logindata.user_id).subscribe((response) => {
      this.posts = response;
    });
  }

  // Select a group and fetch its posts
  selectGroup(group: any) {
    this.selectedGroup = group;
    this.activeSubGroup = null; // Reset active subgroup when a group is selected
    this.getForumPostsByUserId(group.id, this.logindata.user_id); // Use the group's ID
  }

  // Select a subgroup and fetch its posts
  selectSubGroup(subGroup: any) {
    this.activeSubGroup = subGroup;
    if (subGroup) {
      // If a subgroup is selected, fetch its posts
      this.getForumPostsByUserId(subGroup.group_id, this.logindata.user_id);
    } else {
      // Fetch all posts for the selected group if 'All Posts' is selected
      this.getForumPostsByUserId(this.selectedGroup.id, this.logindata.user_id);
    }
  }

  // Fetch posts by group and user ID
  getForumPostsByUserId(groupId: number, userId: number) {
    this.sharedService.getForumPostsByUserId(groupId, userId).subscribe((response) => {
      this.posts = response;
    });
  }

  // Sanitize description to safely display HTML content
  // sanitizeDescription(descr: string, length: number = 100): string {
  //   const sanitizedDescr = this.sanitizer.sanitize(SecurityContext.HTML, descr) || '';
  //   return sanitizedDescr.length > length ? sanitizedDescr.slice(0, length) + '...' : sanitizedDescr;
  // }
  sanitizeDescription(descr: string, length: number = 100): string {
    const sanitizedDescr = this.sanitizer.bypassSecurityTrustHtml(descr) as string;
    const sanitizedText = typeof sanitizedDescr === 'string' ? sanitizedDescr : '';
    return sanitizedText.length > length ? sanitizedText.slice(0, length) + '...' : sanitizedText;
  }
  

  // Get post details by ID
  getPostById(postId: any) {
    this.sharedService.getPostsById(postId).subscribe((response) => {
      this.observable.postDetailsPathIndex$.next(response);
    });
  }
}
