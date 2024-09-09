import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CreatePostsComponent } from './create-posts/create-posts.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisteredUsersComponent } from './registered-users/registered-users.component';
import { ViewAllPostsComponent } from './view-all-posts/view-all-posts.component';

const routes: Routes = [{ path: '', component: AdminComponent ,children:[

  {path:'',component:DashboardComponent},
  {path:'createPosts' , component:CreatePostsComponent},
  {path:'registerdUsers' , component:RegisteredUsersComponent},
  {path:'AllPosts', component: ViewAllPostsComponent}

]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
