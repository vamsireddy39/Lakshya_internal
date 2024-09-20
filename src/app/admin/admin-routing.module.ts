import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CreatePostsComponent } from './create-posts/create-posts.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisteredUsersComponent } from './registered-users/registered-users.component';
import { ViewAllPostsComponent } from './view-all-posts/view-all-posts.component';
import { GroupsComponent } from '../groups/groups.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { RegisteredGroupsComponent } from './registered-groups/registered-groups.component';
import { GroupsAndPostsComponent } from './groups-and-posts/groups-and-posts.component';

const routes: Routes = [{ path: '', component: AdminComponent ,children:[

  {path:'',component:DashboardComponent},
  {path:'createPosts' , component:CreatePostsComponent},
  {path:'registerdUsers' , component:RegisteredUsersComponent},
  {path:'AllPosts', component: ViewAllPostsComponent},
  {path:'creategroups',component:CreateGroupComponent},
  {path:'registerdGroups',component:RegisteredGroupsComponent},
  {path:'groups',component:GroupsAndPostsComponent}

]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
