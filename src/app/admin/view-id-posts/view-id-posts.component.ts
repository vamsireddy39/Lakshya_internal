import { Component } from '@angular/core';
import { ObservablesService } from '../../observables.service';

@Component({
  selector: 'app-view-id-posts',
  templateUrl: './view-id-posts.component.html',
  styleUrl: './view-id-posts.component.scss'
})
export class ViewIdPostsComponent {
  postIdDetails:any;
  constructor(public observable : ObservablesService){

  }
  ngOnInit(){
    this.observable.postByIdDetailsPathIndex$.subscribe((response)=>{
      console.log(response);
      this.postIdDetails = response
    })
  }

}
