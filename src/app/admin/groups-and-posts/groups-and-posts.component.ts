import { Component, SecurityContext } from '@angular/core';
import { ObservablesService } from '../../observables.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedService } from '../../shared.service';
import { Router, ActivatedRoute } from '@angular/router'; // Added ActivatedRoute

@Component({
  selector: 'app-groups-and-posts',
  templateUrl: './groups-and-posts.component.html',
  styleUrls: ['./groups-and-posts.component.scss']
})
export class GroupsAndPostsComponent {
  parentGroupPosts: any[] = [];
  subGroupDetails: any = { sub_groups: [] };
  userData: any[] = [];
  totalUsers: number = 0;
  userPostDetails:any;

  constructor(
    public observable: ObservablesService, 
    private sharedService: SharedService, 
    private sanitizer: DomSanitizer,
    public router: Router,
    private route: ActivatedRoute // Inject ActivatedRoute
  ) {}

  ngOnInit() {
    // Fetch parent group posts on load
    this.observable.parentGroupPostsPathIndex$.subscribe(response => {
      this.parentGroupPosts = response || [];
      if (this.parentGroupPosts.length > 0) {
        this.getPosts(this.parentGroupPosts[0].group_id); // Load the first group by default
      }
    });

    // Fetch subgroup details on load
    this.observable.subGroupsPathIndex$.subscribe(response => {
      this.subGroupDetails = response || {};
    });
  }

  getPosts(groupId: number) {
    this.sharedService.getForumPosts(groupId).subscribe((response: any) => {
      if (response && response.post) {
        this.userData = response.post;
        this.totalUsers = this.userData.length;
      } else {
        this.userData = [];
        this.totalUsers = 0;
      }
    });
  }

  sanitizeDescription(descr: string, length: number = 100): string {
    const sanitizedDescr = this.sanitizer.sanitize(SecurityContext.HTML, descr) || '';
    return sanitizedDescr.length > length ? sanitizedDescr.slice(0, length) + '...' : sanitizedDescr;
  }

  getPostsById(postId: number) {
    this.sharedService.getPostsById(postId).subscribe((response) => {
      console.log(response);
      this.observable.postByIdDetailsPathIndex$.next(response);
      // Correct relative navigation
      this.router.navigate(['/Admin/Post'], { relativeTo: this.route });
    });
  }
}
