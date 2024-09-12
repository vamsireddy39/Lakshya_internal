import { Component } from '@angular/core';
import { ObservablesService } from '../../observables.service';

@Component({
  selector: 'app-view-user-id-posts',
  templateUrl: './view-user-id-posts.component.html',
  styleUrl: './view-user-id-posts.component.scss'
})
export class ViewUserIdPostsComponent {
newComment: any;
userDetails:any=[];
constructor(private observable : ObservablesService){}


ngOnInit(){
  this.observable.postDetailsPathIndex$.subscribe(response =>{
    console.log(response)
    this.userDetails=response.post
  })
}
}
