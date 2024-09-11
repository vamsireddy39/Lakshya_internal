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
}
