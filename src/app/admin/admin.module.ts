import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { CreatePostsComponent } from './create-posts/create-posts.component';
import { ViewAllPostsComponent } from './view-all-posts/view-all-posts.component';
import { ViewIdPostsComponent } from './view-id-posts/view-id-posts.component';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { NgxEditorModule } from 'ngx-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AdminComponent,
    CreatePostsComponent,
    ViewAllPostsComponent,
    ViewIdPostsComponent,
    DashboardComponent,
    AdminHomeComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,NgxEditorModule,FormsModule,
    ReactiveFormsModule,    HttpClientModule,

  ]
})
export class AdminModule { }
