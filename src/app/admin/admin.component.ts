import { Component } from '@angular/core';
import { SharedService } from '../shared.service';
import { ObservablesService } from '../observables.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  parentGroups: any = {};
  constructor(public sharedService: SharedService,public observable : ObservablesService) {

  }
  ngOnInit() {
    this.sharedService.getAllParentGroups().subscribe((response) => {
      console.log(response)
      this.parentGroups = response
    })
  }
  getSubGroups(groupId:number){
    this.sharedService.getAllSubGroupsByParentId(groupId).subscribe((Response=>{
      console.log(Response,'subgroups')
this.observable.subGroupsPathIndex$.next(Response)
    }))
  }
}
