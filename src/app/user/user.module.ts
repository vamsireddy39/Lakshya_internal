import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { ViewUserPostsComponent } from './view-user-posts/view-user-posts.component';
import { ViewUserIdPostsComponent } from './view-user-id-posts/view-user-id-posts.component';


@NgModule({
  declarations: [
    UserComponent,
    ViewUserPostsComponent,
    ViewUserIdPostsComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
