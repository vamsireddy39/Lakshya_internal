import { Component } from '@angular/core';
import { SharedService } from '../shared.service';
import { ObservablesService } from '../observables.service';
import Swal from 'sweetalert2'; // Import SweetAlert
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  parentGroups: any = {};
  userData: any;
  noPostsAvailable: boolean = false; // Variable to control no posts message

  constructor(
    public sharedService: SharedService,
    public observable: ObservablesService,
    private route: ActivatedRoute,
    public router: Router,
  ) {}

  ngOnInit() {
    this.loadParentGroups();
  }

  loadParentGroups() {
    this.sharedService.getAllParentGroups().subscribe(
      (response) => {
        console.log(response);
        this.parentGroups = response;
      },
      (error) => {
        this.showError('Failed to load parent groups. Please try again.'); // Display error message
      }
    );
  }

  // getSubGroups(groupId: number) {
  //   this.sharedService.getAllSubGroupsByParentId(groupId).subscribe(
  //     (response) => {
  //       console.log(response, 'subgroups');
  //       this.observable.subGroupsPathIndex$.next(response);
  //       this.getPosts(groupId);
  //       this.router.navigate(['/Admin/groups']);
  //     },
  //     (error) => {
  //       this.showError('Failed to load subgroups. Please try again.'); // Display error message
  //     }
  //   );
  // }

  // getPosts(groupId: number) {
  //   this.sharedService.getForumPosts(groupId).subscribe(
  //     (response: any) => {
  //       if (response && response.post && response.post.length > 0) {
  //         this.userData = response.post;
  //         console.log(response.post, 'posts'); // Assign the posts to userData
  //         this.observable.parentGroupPostsPathIndex$.next(this.userData);
  //         this.noPostsAvailable = false; // Reset the no posts message
  //       } else {
  //         this.userData = []; // Reset userData if no posts
  //         this.noPostsAvailable = true; // Set the flag to show the no posts message
  //       }
  //     },
  //     (error) => {
  //       this.showError('Failed to load posts. Please try again.'); // Display error message
  //     }
  //   );
  // }
  getSubGroups(groupId: number) {
    this.sharedService.getAllSubGroupsByParentId(groupId).subscribe(
      (response) => {
        console.log(response, 'subgroups');
        this.observable.subGroupsPathIndex$.next(response);
        this.getPosts(groupId); // Get posts for the selected subgroup
      },
      (error) => {
        this.showError('Failed to load subgroups. Please try again.'); // Display error message
      }
    );
  }
  
  getPosts(groupId: number) {
    this.sharedService.getForumPosts(groupId).subscribe(
      (response: any) => {
        // if (response && response.post && response.post.length > 0) {
          this.userData = response;
          console.log(response.post, 'posts'); // Assign the posts to userData
          this.observable.parentGroupPostsPathIndex$.next(this.userData);
          this.noPostsAvailable = false; // Reset the no posts message
  
          // Navigate to groups after successfully fetching posts
        // } else {
        //   this.userData = []; // Reset userData if no posts
        //   this.noPostsAvailable = true; // Set the flag to show the no posts message
        // }
        this.router.navigate(['/Admin/groups']);

      },
      (error) => {
        this.showError('Failed to load posts. Please try again.'); // Display error message
      }
      
    );
  }
  
  showError(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      confirmButtonText: 'OK'
    });
  }
}
