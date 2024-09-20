import { Component } from '@angular/core';
import { ObservablesService } from '../../observables.service';

@Component({
  selector: 'app-groups-and-posts',
  templateUrl: './groups-and-posts.component.html',
  styleUrl: './groups-and-posts.component.scss'
})
export class GroupsAndPostsComponent {
  subGroupDetails: any = {};  // Initialize as an empty object

  constructor(public observable: ObservablesService) {}

  ngOnInit() {
    this.observable.subGroupsPathIndex$.subscribe(response => {
      this.subGroupDetails = response || {};  // Fallback to an empty object if response is null or undefined
      console.log(this.subGroupDetails);
    });
  }

}
