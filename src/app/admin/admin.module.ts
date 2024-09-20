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
import { RegisteredUsersComponent } from './registered-users/registered-users.component';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CreateGroupComponent } from './create-group/create-group.component';
import { RegisteredGroupsComponent } from './registered-groups/registered-groups.component';
import { GroupsAndPostsComponent } from './groups-and-posts/groups-and-posts.component';

@NgModule({
  declarations: [
    AdminComponent,
    CreatePostsComponent,
    ViewAllPostsComponent,
    ViewIdPostsComponent,
    DashboardComponent,
    AdminHomeComponent,
    RegisteredUsersComponent,
    CreateGroupComponent,
    RegisteredGroupsComponent,
    GroupsAndPostsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,NgxEditorModule,FormsModule,
    ReactiveFormsModule,    HttpClientModule,
    MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule 

  ]
})
export class AdminModule { }
