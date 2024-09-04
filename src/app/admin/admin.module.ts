import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { CreatePostsComponent } from './create-posts/create-posts.component';
import { ViewAllPostsComponent } from './view-all-posts/view-all-posts.component';
import { ViewIdPostsComponent } from './view-id-posts/view-id-posts.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    AdminComponent,
    CreatePostsComponent,
    ViewAllPostsComponent,
    ViewIdPostsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
