import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObservablesService {

  constructor() { }
   loginDetailsPathIndex$ = new BehaviorSubject<any>({});
}
