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
  parentGroupPosts: any[] = [];
  subGroupDetails: any = { sub_groups: [] };
  userData: any[] = [];
  totalUsers: number = 0;
  userPostDetails:any;

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
  // getAllGroupmembers(groupId:number){
  //   const isSubGroup = this.subGroupDetails.sub_groups.some((subgroup: any) => subgroup.group_id === groupId);
  //   this.observable.isSubGroupPathIndex$.next(isSubGroup); // Emit true if subgroup, false otherwise

  //   this.sharedService.getAllgroupMembers(groupId).subscribe((response)=>{
  //     console.log(response)
  //     this.observable.groupMembersPathIndex$.next(response)
  //     this.openDialog()
  //   })
  // }
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
