import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { ViewUserPostsComponent } from './view-user-posts/view-user-posts.component';
import { ViewUserIdPostsComponent } from './view-user-id-posts/view-user-id-posts.component';

const routes: Routes = [{ path: '', component: ViewUserPostsComponent },
  {path:'nby',component:ViewUserIdPostsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
