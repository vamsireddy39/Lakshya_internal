import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObservablesService {

  constructor() { }
   loginDetailsPathIndex$ = new BehaviorSubject<any>({});
   userDetailsByIdPathIndex$ = new BehaviorSubject<any>({})
   editUserPathIndex$ =  new BehaviorSubject<boolean>(false);
   postDetailsPathIndex$ = new BehaviorSubject<any>({});
   subGroupsPathIndex$ = new BehaviorSubject<any>({});
   parentGroupPostsPathIndex$ = new BehaviorSubject<any>({});
   postByIdDetailsPathIndex$ = new BehaviorSubject<any>({});
   groupMembersPathIndex$ = new BehaviorSubject<any>({});
   isGroupPathIndex$ =  new BehaviorSubject<any>({});
   isSubGroupPathIndex$ = new BehaviorSubject<{ isSubGroup: boolean, parentGroupId: number }>({ isSubGroup: false, parentGroupId: 0 });
  AdminPostByIdDetailsPathIndex$ =  new BehaviorSubject<any>({});


}
