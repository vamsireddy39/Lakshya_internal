import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { ViewUserPostsComponent } from './view-user-posts/view-user-posts.component';
import { ViewUserIdPostsComponent } from './view-user-id-posts/view-user-id-posts.component';
import { CreatePostsComponent } from './create-posts/create-posts.component';
import { UserPostsComponent } from './user-posts/user-posts.component';

const routes: Routes = [{ path: '', component: UserComponent,
  children:[
    {path :'',component:ViewUserPostsComponent},
    // {path:'userPosts',component:ViewUserIdPostsComponent}
    {path:'Post',component:ViewUserIdPostsComponent},
    {path:'create',component:CreatePostsComponent},
    {path:'MyPosts',component:UserPostsComponent}
  ]
 },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
