import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { ViewUserPostsComponent } from './view-user-posts/view-user-posts.component';
import { ViewUserIdPostsComponent } from './view-user-id-posts/view-user-id-posts.component';
import { SharedModule } from "../shared/shared.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreatePostsComponent } from './create-posts/create-posts.component';
import { UserPostsComponent } from './user-posts/user-posts.component';
import { NgxEditorModule } from 'ngx-editor';


@NgModule({
  declarations: [
    UserComponent,
    ViewUserPostsComponent,
    ViewUserIdPostsComponent,
    CreatePostsComponent,
    UserPostsComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,ReactiveFormsModule,FormsModule,NgxEditorModule
]
})
export class UserModule { }
