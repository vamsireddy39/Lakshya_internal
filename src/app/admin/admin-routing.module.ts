import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CreatePostsComponent } from './create-posts/create-posts.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [{ path: '', component: AdminComponent ,children:[

  {path:'',component:DashboardComponent},
  {path:'createPosts' , component:CreatePostsComponent}
]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
